<script setup lang="ts">
import { isFetchWeatherError } from "~/interfaces/WeatherData"
const { getCurrentWeather } = useWeather()

const route = useRoute()
const data = computed(() => getCurrentWeather())
const routeName = computed(() => route.name)

/**
 * 取得日時に基づいてフォーマットされた時刻を計算して返します。
 * @returns {string} 取得日時に基づいてフォーマットされた時刻
 */
const date = computed(() => {
  if (!data.value) return
  const { fetch_date: fetchDate } = data.value
  const dateObj = new Date(fetchDate)
  const hours = dateObj.getHours().toString().padStart(2, "0")
  const minutes = dateObj.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
})

/**
 * ヘッダーのタイトルを計算して返します。
 * @returns {string} ヘッダーのタイトル
 */
const title = computed(() => {
  const weatherTitleSuffix = "天気"
  if (routeName.value === "index") {
    return `東京の${weatherTitleSuffix}`
  } else if (data.value && !isFetchWeatherError(data.value)) {
    return `${data.value.city}の詳しい${weatherTitleSuffix}`
  }
  return `${route.params.city}の詳しい${weatherTitleSuffix}`
})
</script>

<template>
  <header>
    <h1>{{ title }}</h1>
    <p>
      <time datetime="city-header__time">{{ date ?? new Date() }}</time>
      現在
    </p>
  </header>
</template>
