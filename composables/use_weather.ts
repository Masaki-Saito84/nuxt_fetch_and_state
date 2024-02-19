import type { WeatherData, FetchWeatherError } from "~/interfaces/WeatherData"

export const useWeather = () => {
  const weatherList: Ref<Array<WeatherData | FetchWeatherError>> = useState<Array<WeatherData>>("weatherList", () => [])

  const removeWeatherData = (city: string) => {
    const baseList = weatherList.value.filter((data) => data.city_param !== city)
    weatherList.value = baseList
  }

  const updateWeatherList = async (city: string) => {
    const baseList = weatherList.value.filter((data) => data.city_param !== city)
    const { data, error } = (await $fetch(`/api/weather/${city}`)) as { data: WeatherData; error: FetchWeatherError }
    weatherList.value = data ? [...baseList, data] : [...baseList, error]
  }

  const getWeatherData = () => {
    const { name: routeName, params: routeParams } = useRoute()
    const city = routeName === "index" ? "tokyo" : routeParams.city
    const weatherData = weatherList.value.find((data) => data.city_param === city)

    if (weatherData && new Date(weatherData.fetch_date).getTime() > new Date().getTime() - 600000) {
      return weatherData
    }
    updateWeatherList(city.toString())
  }

  return {
    removeWeatherData,
    getWeatherData,
  }
}
