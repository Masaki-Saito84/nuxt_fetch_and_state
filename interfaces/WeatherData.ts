export interface FetchCurrentWeatherResultType {
  coord: FetchCoordType
  weather: FetchWeatherDataType[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  rain?: {
    "1h"?: number
    "3h"?: number
  }
  snow?: {
    "1h"?: number
    "3h"?: number
  }
  clouds?: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface FetchFutureWeatherResultType {
  cod: string
  message: number
  cnt: number
  list: FetchFutureWeatherListType[]
  city: {
    id: number
    name: string
    coord: FetchCoordType
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

interface FetchCoordType {
  lat: number
  lon: number
}

interface FetchWeatherDataType {
  id: number
  main: string
  description: string
  icon: string
}

interface FetchFutureWeatherListType {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: FetchWeatherDataType[]
  clouds?: {
    all: number
  }
  wind?: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  rain?: {
    "3h"?: number
  }
  snow?: {
    "3h"?: number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}

export interface WeatherData {
  city: string
  city_param: string
  cod: number
  fetch_date: number
  temp: number
  temp_max: number
  temp_min: number
  icon: string
  description: string
  wind: number
  humidity: number
  list?: FutureData[]
}

interface FutureData {
  date: number
  icon: string
  description: string
}
export interface FetchWeatherParams {
  params: {
    q: string
    units?: string
    cnt?: number
    lang?: string
    appid?: string
  }
}

export interface FetchWeatherError {
  cod: number
  city_param: string
  fetch_date: number
  message: string
}

export const isFetchWeatherError = (data: any): data is FetchWeatherError => {
  return data.cod !== undefined && data.city_param !== undefined && data.fetch_date !== undefined && data.message !== undefined
}