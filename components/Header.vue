<script setup lang="ts">
import { isFetchWeatherError } from "~/interfaces/WeatherData"

const { getWeatherData } = useWeather()
const route = useRoute()

const data = computed(() => getWeatherData())
const routeName = computed(() => route.name)
const date = computed(() => {
  if (!data.value) return
  const { fetch_date: fetchDate } = data.value
  const dateObj = new Date(fetchDate)
  const hours = dateObj.getHours().toString().padStart(2, "0")
  const minutes = dateObj.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
})
const cityLabel = computed(() => {
  if (routeName.value === "index") {
    return "東京"
  } else if (data.value !== undefined && !isFetchWeatherError(data.value)) {
    return data.value.city
  }
  return route.params.city
})
const title = computed(() => (routeName.value !== "index" ? `${cityLabel.value}の詳しい天気` : `${cityLabel.value}の天気`))
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
