import { FetchError } from "ofetch"
import {
  FetchCurrentWeatherResultType,
  FetchFutureWeatherResultType,
  WeatherData,
  FetchWeatherParams,
  FetchWeatherError,
} from "~/interfaces/WeatherData"

/**
 * 天気データを取得するための関数です。
 * @param url
 * @param params
 * @returns 天気データまたはエラー
 */
const handleFetch = async (url: string, params: FetchWeatherParams) => {
  try {
    const response = await $fetch(url, params)
    return { data: response }
  } catch (error) {
    console.error(`Error fetching data from ${url}`, error)
    const fetchError = error as FetchError
    const { data: fetchErrorData } = fetchError
    const { cod, message } = fetchErrorData
    const errorData: FetchWeatherError = {
      cod,
      city_param: params.params.q,
      fetch_date: new Date().getTime(),
      message,
    }
    return { error: errorData }
  }
}

/**
 * 天気データを取得するイベントハンドラーです。
 */
export default defineEventHandler(async (event) => {
  const key = "96b09366a5dcde18dae9ff6d17349504"
  const endPoint = "https://api.openweathermap.org/data/2.5/"
  const iconPath = "https://openweathermap.org/img/wn/"

  if (!event.context?.params?.city) {
    const errorData: FetchWeatherError = {
      cod: 400,
      fetch_date: new Date().getTime(),
      message: "InvalidArgument",
      city_param: "undefined",
    }
    return { error: errorData }
  }
  const city = event.context.params.city

  try {
    const weatherParams: FetchWeatherParams = {
      params: {
        q: city,
        appid: key,
        lang: "ja",
        units: "metric",
        cnt: 3,
      },
    }

    const { data: currentResult, error: currentWeatherError } = (await handleFetch(`${endPoint}weather`, weatherParams)) as {
      data: FetchCurrentWeatherResultType
      error?: FetchWeatherError
    }
    const { data: futureResult, error: futureWeatherError } = (await handleFetch(`${endPoint}forecast`, weatherParams)) as {
      data: FetchFutureWeatherResultType
      error?: FetchWeatherError
    }

    const fetchErrorData = currentWeatherError || futureWeatherError
    if (fetchErrorData) {
      const message = fetchErrorData.message
      const errorData: FetchWeatherError = {
        cod: fetchErrorData.cod,
        city_param: city,
        fetch_date: new Date().getTime(),
        message,
      }

      return { error: errorData }
    }

    const weatherData: WeatherData = {
      city: currentResult.name,
      city_param: city,
      cod: currentResult.cod,
      fetch_date: new Date().getTime(),
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
    }
    return { data: weatherData }
  } catch (error) {
    console.error("データの取得中にエラーが発生しました", error)

    const errorData: FetchWeatherError = {
      cod: 400,
      fetch_date: new Date().getTime(),
      message: "データの取得中にエラーが発生しました",
      city_param: city,
    }
    return { error: errorData }
  }
})
