import { FetchCurrentWeatherResultType, FetchFutureWeatherResultType, WeatherData } from "~/interfaces/WeatherData"
import { FetchError } from "ofetch"

const handleFetch = async (url: string, params: object) => {
  try {
    const response = await $fetch(url, params)
    return response
  } catch (error) {
    console.error(`Error fetching data from ${url}`, error)
    const fetchError = error as FetchError
    const cod = fetchError.data.cod
    return cod
  }
}

export default defineEventHandler(async (event) => {
  const key = "96b09366a5dcde18dae9ff6d17349504"
  const endPoint = "https://api.openweathermap.org/data/2.5/"
  const iconPath = "https://openweathermap.org/img/wn/"

  if (!event.context || !event.context.params || !event.context.params.city) {
    console.log("InvalidArgument")
    const errorData = {
      cod: 400,
    } as WeatherData
    return { data: errorData }
  }

  const city = event.context.params.city

  try {
    const currentWeatherData = await handleFetch(`${endPoint}weather`, {
      params: {
        q: city,
        appid: key,
        lang: "ja",
        units: "metric",
      },
    })

    const futureWeatherData = await handleFetch(`${endPoint}forecast`, {
      params: {
        q: city,
        appid: key,
        lang: "ja",
        units: "metric",
        cnt: 3,
      },
    })

    if (typeof currentWeatherData === "number" || typeof futureWeatherData === "number") {
      console.log("typeerror")
      console.log("error")
      const errorData = {
        cod: typeof currentWeatherData === "number" ? currentWeatherData : futureWeatherData,
        city_param: city,
      } as WeatherData

      return { data: errorData }
    }

    const currentResult = currentWeatherData as FetchCurrentWeatherResultType
    const futureResult = futureWeatherData as FetchFutureWeatherResultType

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
    console.log("error", error)

    const errorData = {
      cod: 400,
    } as WeatherData
    return { data: errorData }
  }
})
