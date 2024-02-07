import {
  FetchCurrentWeatherResultType,
  FetchFutureWeatherResultType,
  WeatherData,
  FetchWeatherParams,
  FetchWeatherError,
} from "~/interfaces/WeatherData"
import { FetchError } from "ofetch"

const handleFetch = async (url: string, params: FetchWeatherParams) => {
  try {
    const response = await $fetch(url, params)
    return { data: response }
  } catch (error) {
    console.error(`Error fetching data from ${url}`, error)
    const fetchError = error as FetchError
    const { data: fetchErrorData } = fetchError
    const { cod, message } = fetchErrorData
    const errorData = {
      cod,
      city_param: params.params.q,
      fetch_date: new Date().getTime(),
      message,
    } as FetchWeatherError
    return { error: errorData }
  }
}

export default defineEventHandler(async (event) => {
  const key = "96b09366a5dcde18dae9ff6d17349504"
  const endPoint = "https://api.openweathermap.org/data/2.5/"
  const iconPath = "https://openweathermap.org/img/wn/"

  if (!event.context || !event.context.params || !event.context.params.city) {
    const errorData = {
      cod: 400,
      fetch_date: new Date().getTime(),
      message: "InvalidArgument",
      city_param: "undefined",
    } as FetchWeatherError
    return { error: errorData }
  }
  const city = event.context.params.city

  try {
    const currentWeatherParams = {
      params: {
        q: city,
        appid: key,
        lang: "ja",
        units: "metric",
      },
    } as FetchWeatherParams

    const futureWeatherParams = {
      params: {
        q: city,
        appid: key,
        lang: "ja",
        units: "metric",
        cnt: 3,
      },
    } as FetchWeatherParams

    const { data: currentResult, error: currentWeatherError } = (await handleFetch(`${endPoint}weather`, currentWeatherParams)) as {
      data: FetchCurrentWeatherResultType
      error?: FetchWeatherError
    }
    const { data: futureResult, error: futureWeatherError } = (await handleFetch(`${endPoint}forecast`, futureWeatherParams)) as {
      data: FetchFutureWeatherResultType
      error?: FetchWeatherError
    }

    if (currentWeatherError || futureWeatherError) {
      const message = currentWeatherError ? currentWeatherError.message : futureWeatherError?.message
      const errorData = {
        cod: currentWeatherError ? currentWeatherError.cod : futureWeatherError?.cod,
        city_param: city,
        fetch_date: new Date().getTime(),
        message,
      } as FetchWeatherError

      return { error: errorData }
    }

    const weatherData = {
      city: currentResult.name,
      city_param: city,
      cod: currentResult.cod,
      fetch_date: new Date().getTime(),
      date: currentResult.dt,
      temp: currentResult.main.temp,
      temp_max: currentResult.main.temp_max,
      temp_min: currentResult.main.temp_min,
      icon: `${iconPath}${currentResult.weather[0].icon}@2x.png`,
      description: currentResult.weather[0].description,
      wind: currentResult.wind.speed,
      humidity: currentResult.main.humidity,
      list: futureResult.list.map((item) => ({
        date: item.dt,
        icon: `${iconPath}${item.weather[0].icon}@2x.png`,
        description: item.weather[0].description,
      })),
    } as WeatherData
    return { data: weatherData }
  } catch (error) {
    console.error("データの取得中にエラーが発生しました", error)

    const errorData = {
      cod: 400,
      fetch_date: new Date().getTime(),
      message: "データの取得中にエラーが発生しました",
      city_param: city,
    } as FetchWeatherError
    return { error: errorData }
  }
})
