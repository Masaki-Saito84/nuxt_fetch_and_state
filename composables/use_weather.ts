import type { WeatherData, FetchWeatherError } from "~/interfaces/WeatherData"

export const useWeather = () => {
  const weatherList: Ref<Array<WeatherData | FetchWeatherError>> = useState<Array<WeatherData | FetchWeatherError>>("weatherList", () => [])
  const currentWeatherData: Ref<WeatherData | FetchWeatherError | null> = useState<WeatherData | FetchWeatherError | null>("currentWeather", () => null)


  const updateWeatherList = async (city: string) => {
    const baseList = weatherList.value.filter((data) => data.city_param !== city)
    const { data, error } = (await $fetch(`/api/weather/${city}`)) as { data: WeatherData; error: FetchWeatherError }
    weatherList.value = data ? [...baseList, data] : [...baseList, error]
  }

  /**
   * 指定された都市の天気データを取得します。
   * @param city - 都市の名前
   * @returns 天気データ
   */
  const findWeatherData = (city: string) => weatherList.value.find((data) => data.city_param === city)

  /**
   * 現在表示している天気データをクリアします。
   */
  const clearCurrentWeather = () => currentWeatherData.value = null

  /**
   * 指定された都市の天気データを取得し、現在表示している天気データを設定します。
   * @param city - 都市の名前
   */
  const setCurrentWeather = async (city: string) => {
    clearCurrentWeather()
    const selectedWeatherData = computed(() => findWeatherData(city))

    // 天気データが存在しないか、取得してから10分以上経過している場合は更新
    if (!selectedWeatherData.value || new Date(selectedWeatherData.value.fetch_date).getTime() <= new Date().getTime() - 600000) {
      await updateWeatherList(city)
    }
    currentWeatherData.value = selectedWeatherData.value || null
  }

  /**
   * 現在表示している天気データを更新します。
   */
  const updateCurrentWeather = async () => {
    if (currentWeatherData.value) {
      const { city_param: city } = currentWeatherData.value
      clearCurrentWeather()
      await updateWeatherList(city)
      currentWeatherData.value = findWeatherData(city) || null
    }
  }

  return {
    // getWeatherData,
    currentWeatherData,
    setCurrentWeather,
    // getCurrentWeather,
    // resetCurrentWeather
    updateCurrentWeather,
  }
}
