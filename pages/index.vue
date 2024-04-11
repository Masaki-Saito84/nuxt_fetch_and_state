<script setup lang="ts">
import { isFetchWeatherError } from "~/interfaces/WeatherData"
const { $cityList } = useNuxtApp()
const { getCurrentWeather } = useWeather()
const data = computed(() => getCurrentWeather())

const submit = (e: Event) => {
  const input = (e.target as HTMLFormElement).querySelector("input")
  if (!input) return
  const cityName = input.value
  if (!cityName) return
  navigateTo(cityName)
}
</script>
<template>
  <WeatherIcon />
  <p v-if="data && !isFetchWeatherError(data)">{{ data.description }}</p>
  <section class="home__section" v-if="$cityList">
    <h2>主な都市を詳しく見る</h2>
    <nav>
      <ul class="city-list">
        <li class="city-list__item" v-for="(city, index) in $cityList" :key="index">
          <NuxtLink :to="`/${city.name}`">{{ city.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </section>
  <section class="home__section">
    <h2>都市の天気を検索</h2>
    <form v-on:submit.prevent="submit" class="city-search">
      <input type="text" class="city-search__input" placeholder="都市名を入力" />
      <button type="submit" class="city-search__btn">検索</button>
    </form>
  </section>
</template>
