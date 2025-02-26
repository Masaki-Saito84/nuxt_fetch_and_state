import type { WeatherData, FetchWeatherError } from "~/interfaces/WeatherData"

/**
 * 天気データを取得し、管理するためのカスタムフックです。
 * @returns 天気データを取得し、管理するための関数群
 */
export const useWeather = () => {
  const { $cityList } = useNuxtApp()
  const weatherList: Ref<Array<WeatherData | FetchWeatherError>> = useState<Array<WeatherData | FetchWeatherError>>("weatherList", () => [])
  const currentWeatherData: Ref<WeatherData | FetchWeatherError | null> = useState<WeatherData | FetchWeatherError | null>(
    "currentWeatherData",
    () => null
  )

  /**
   * 指定された都市の天気データをAPIから取得し、天気リストを更新します。
   * @param city - 都市の名前
   */
  const updateWeatherList = async (city: string) => {
    const filteredList = weatherList.value.filter((data) => data.city_param !== city)
    const { data, error } = (await $fetch(`/api/weather/${city}`)) as { data: WeatherData; error: FetchWeatherError }
    weatherList.value = data ? [...filteredList, data] : [...filteredList, error]
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
  const clearCurrentWeather = () => (currentWeatherData.value = null)

  /**
   * 現在表示している天気データを取得します。
   * @returns 現在表示している天気データ
   */
  const getCurrentWeather = () => currentWeatherData.value

  /**
   * 指定された都市の天気データを取得し、現在表示している天気データを設定します。
   * @param city - 都市の名前
   */
  const setCurrentWeather = async (city: string) => {
    clearCurrentWeather()
    const selectedWeatherData = computed(() => findWeatherData(city))

    if ($cityList.some((cityData) => cityData.name === city)) {
      if (!selectedWeatherData.value || new Date(selectedWeatherData.value.fetch_date).getTime() <= new Date().getTime() - 600000) {
        await updateWeatherList(city)
      }
      currentWeatherData.value = selectedWeatherData.value || null
    } else {
      const { data, error } = (await $fetch(`/api/weather/${city}`)) as { data: WeatherData; error: FetchWeatherError }
      currentWeatherData.value = data ? data : error
    }
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
    getCurrentWeather,
    setCurrentWeather,
    updateCurrentWeather,
  }
}
