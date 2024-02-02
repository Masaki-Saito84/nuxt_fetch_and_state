<script setup lang="ts">
const route = useRoute()
const { weatherList, addWeatherData } = useWeather()

const routeName = computed(() => route.name)
const city = computed(() => (routeName.value === "index" ? "tokyo" : route.params.city))

const data = computed(() => {
  const weatherData = weatherList.value.find((data) => data.city_param === city.value)
  if (weatherData) {
    return weatherData
  }
  addWeatherData(city.value.toString())
})
</script>

<template>
  <div>
    <Navbar />
    <header class="city-header">
      <div class="pending" v-if="!data">
        <p>天気を取得中...</p>
      </div>
      <div class="city-header__wrapper" v-else>
        <p>
          <time datetime="city-header__time">{{ data.date }}</time>
          現在
        </p>
        <div class="current-weather" v-if="data.cod === 200">
          <img :src="data.icon" :alt="data.description" />
          <p v-if="routeName === 'index'">{{ data.description }}</p>
          <ul v-if="routeName === 'city'" class="current-weather__list">
            <li class="current-weather__item">天候 {{ data.description }}</li>
            <li class="current-weather__item">気温 {{ data.temp }}℃</li>
            <li class="current-weather__item">湿度 {{ data.humidity }}%</li>
            <li class="current-weather__item">風速 {{ data.wind }}m</li>
          </ul>
        </div>
        <p v-else>{{ data.city }}の天気の取得に失敗しました</p>
      </div>
    </header>
    <slot />
  </div>
</template>
