<script setup lang="ts">
import { isFetchWeatherError } from "~/interfaces/WeatherData"

const { getWeatherData } = useWeather()
const data = computed(() => getWeatherData())
const cityList = [
  { name: "tokyo", label: "東京" },
  { name: "osaka", label: "大阪" },
  { name: "nagoya", label: "名古屋" },
]
</script>
<template>
  <WeatherIcon />
  <p v-if="data && !isFetchWeatherError(data)">{{ data.description }}</p>
  <section class="home__section" v-if="cityList">
    <h2>主な都市を詳しく見る</h2>
    <nav>
      <ul class="city-list">
        <li class="city-list__item" v-for="(city, index) in cityList" :key="index">
          <NuxtLink :to="`/${city.name}`">{{ city.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </section>
  <section class="home__section">
    <h2>都市の天気を検索</h2>
    <form action="" class="city-search">
      <input type="text" class="city-search__input" placeholder="都市名を入力" />
      <button type="submit" class="city-search__btn">検索</button>
    </form>
  </section>
</template>
