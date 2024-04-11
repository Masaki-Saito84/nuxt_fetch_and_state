const cityList = [
  { name: "tokyo", label: "東京" },
  { name: "osaka", label: "大阪" },
  { name: "nagoya", label: "名古屋" },
]

export default defineNuxtPlugin(() => {
  return {
    provide: {
      cityList
    }
  }
})