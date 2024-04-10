<script setup lang="ts">
import { isFetchWeatherError } from "~/interfaces/WeatherData"
const { getCurrentWeather, updateCurrentWeather } = useWeather()
const data = computed(() => getCurrentWeather())
</script>

<template>
  <div class="icon__wrapper">
    <p class="pending" v-if="!data">天気を取得中...</p>
    <p v-else-if="isFetchWeatherError(data)">{{ data.city_param }}の天気の取得に失敗しました</p>
    <img v-else :src="data.icon" :alt="data.description" />
    <p v-if="data" @click="updateCurrentWeather">更新</p>
  </div>
</template>
