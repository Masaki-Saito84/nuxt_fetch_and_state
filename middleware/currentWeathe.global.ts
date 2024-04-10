/**
 * 現在の天気情報を設定するミドルウェア
 * @param context - コンテキスト
 */
export default defineNuxtRouteMiddleware(async (context) => {
  const { params: routeParams } = context
  const { setCurrentWeather } = useWeather()
  const city = routeParams.city || "tokyo"

  setCurrentWeather(city.toString())
})
