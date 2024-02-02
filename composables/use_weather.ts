import type { WeatherData } from "~/interfaces/WeatherData"

export const useWeather = () => {
  const weatherList: Ref<Array<WeatherData>> = useState<Array<WeatherData>>("weatherList", () => [])

  const addWeatherData = async(city: string) => {
    const baseList = weatherList.value
    const {data} = await $fetch(`/api/weather/${city}`)
    if (data.cod === 200) {
      baseList.push(data)
      weatherList.value = baseList
    }
  }

  return {
    weatherList,
    addWeatherData,
  }
}
