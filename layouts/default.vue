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

const city = computed(() => {
  if (routeName.value === "index") {
    return "東京"
  } else if (data.value !== undefined && !isFetchWeatherError(data.value)) {
    return data.value.city
  }
  return route.params.city
})

const title = computed(() => (routeName.value !== "index" ? `${city.value}の詳しい天気` : `${city.value}の天気`))
</script>

<template>
  <div>
    <header class="city-header">
      <h1>{{ title }}</h1>
      <div class="pending" v-if="!data">
        <p>天気を取得中...</p>
      </div>
      <div v-else>
        <p>
          <time datetime="city-header__time">{{ date }}</time>
          現在
        </p>
        <div v-if="isFetchWeatherError(data)">
          <p>{{ data.city_param }}の天気の取得に失敗しました</p>
        </div>
        <div class="city-header__wrapper" v-else>
          <img :src="data.icon" :alt="data.description" />
          <p v-if="routeName === 'index'">{{ data.description }}</p>
          <ul v-if="routeName === 'city'" class="current-weather__list">
            <li class="current-weather__item">天候 {{ data.description }}</li>
            <li class="current-weather__item">気温 {{ data.temp }}℃</li>
            <li class="current-weather__item">湿度 {{ data.humidity }}%</li>
            <li class="current-weather__item">風速 {{ data.wind }}m</li>
          </ul>
        </div>
      </div>
    </header>
    <slot />
  </div>
</template>
