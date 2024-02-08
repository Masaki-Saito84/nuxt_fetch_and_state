<script lang="ts" setup>
import { isFetchWeatherError } from "~/interfaces/WeatherData"
const { getWeatherData } = useWeather()

const data = computed(() => getWeatherData())
</script>
<template>
  <main v-if="data && !isFetchWeatherError(data)">
    <section class="detail__section">
      <h2>本日の気温</h2>
      <ul class="temp">
        <li class="temp__max">最高気温 {{ data.temp_max }}℃</li>
        <li class="temp__min">最低気温 {{ data.temp_min }}℃</li>
      </ul>
    </section>
    <section class="detail__section">
      <h2>今後の天気</h2>
      <ul class="feature-weather__list">
        <li v-for="(futureData, index) in data.list" :key="index" class="feature-weather__item">
          <img :src="futureData.icon" :alt="futureData.description" />
          <p>{{ (index + 1) * 3 }}時間後</p>
        </li>
      </ul>
    </section>
  </main>
</template>
