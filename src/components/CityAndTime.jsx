import sun from "../assets/sun.png"
import Clock from "./Clock";
import sunraise from "../assets/sunraise.png"
import sunset from "../assets/sunset.png"
import sunny from "../assets/sunny.png"
import humidity from "../assets/humidity.png"
import wind from "../assets/wind.png"
import pressure from "../assets/pressure.png"
import UV from "../assets/UV.png"
import ForeCast from "./ForeCast";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"


const CityAndTime = ({cityName, lat, lon, setLat, setLon}) => {

  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [uvIndex, setUvIndex] = useState(null)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  const fetchData = async () => {
    try {
      const encodedCity = encodeURIComponent(cityName)
      let url;

      if(encodedCity && cityName){
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`
      }
      else if(lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      } else {
        toast.error("No city name or coordinates")
        return;
      }

      const currentWeather = await axios.get(url)
      setWeatherData(currentWeather.data)

      const {coord} = currentWeather.data
      setLat(coord.lat)
      setLon(coord.lon)

      // Fixed typo: coord.lat instead of coord,lat and coord.lon instead of coord.log
      const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${API_KEY}`)
      setForecastData(forecast.data)

      // Fixed UV API endpoint - using correct OpenWeather UV API
      const uv = await axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`)
      setUvIndex(uv.data.value)

    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch weather data")
    }
  }

  useEffect(()=>{
    // Fixed logic: check if cityName is empty or null
    if(!cityName && (!lat || !lon)){
      navigator.geolocation.getCurrentPosition(
        (pos)=>{
          const {latitude, longitude} = pos.coords
          setLat(latitude)
          setLon(longitude)
        }, 
        (error)=>{
          console.log("Geolocation error:",error)
          toast.error("Location access denied. please enter a city manually")
        }
      )
    } else if(cityName || (lat && lon)) {
      fetchData()
    }
  }, [cityName, lat, lon])

  if(!weatherData || !forecastData){
    return <div className="flex items-center justify-center text-white md:text-6xl text-3xl">Loading...</div>
  }

  const {main, weather, sys, wind: windData} = weatherData
  const { list } = forecastData

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
  

  return (
    <>
    <div className="flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-1/3 h-auto md:h-72 bg-[#050e1fde] shadow-black shadow-2xl rounded-lg text-white p-4 flex flex-col justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">{cityName || weatherData.name}</h1>
          {/* <img src={weatherIconUrl} alt="weatherImage" className="w-18 select-none" /> */}
          <img src={weatherIconUrl} alt="weatherImage" className="w-24 h-24 select-none" />
           <Clock />    
        </div>

        <div className="flex-grow h-auto md:h-72 bg-[#050e1fde] shadow-2xl shadow-black rounded-lg text-white p-4 flex flex-col justify-around md:flex-row items-center md:items-stretch gap-4">
          <div className="flex flex-col items-center justify-between xl:justify-center gap-6 md:gap-4">
            <h1 className="text-5xl md:text-7xl font-bold">{Math.round(main.temp)}&#8451;</h1>
            <p className="text-center">
              Feels like: <span className="text-lg md:text-xl ml-2 font-bold">{Math.round(main.feels_like)}&#8451;</span>
            </p>
            <div className="flex xl:flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={sunraise} alt="sunrise" className="h-8 md:h-10 select-none" />
                <div className="text-center">
                  <h6>Sunrise</h6>
                  <p>{new Date(sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src={sunset} alt="sunset" className="h-8 md:h-10 select-none" />
                <div className="text-center">
                  <h6>Sunset</h6>
                  <p>{new Date(sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            {/* <img src={weatherIconUrl} alt="weather" className="w-20 h-20 md:w-40 md:h-40 select-none" /> */}
            <img src={weatherIconUrl} alt="weather" className="w-20 h-20 md:w-40 md:h-40 select-none" />
            <p className="font-bold text-xl md:text-3xl capitalize">{weather[0].description}</p>
          </div>

          <div className="md:grid md:grid-cols-2 flex flex-row justify-between gap-4 md:p-4">
            <div className="flex flex-col items-center gap-2">
              <img src={humidity} alt="humidity" className="h-8 md:h-10 select-none" />
              <p>{main.humidity}%</p>
              <h6>Humidity</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={wind} alt="windSpeed" className="h-8 md:h-10 select-none" />
              <p>{windData.speed} km/h</p>
              <h6>Wind Speed</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={pressure} alt="pressure" className="h-8 md:h-10 select-none" />
              <p>{main.pressure} hPa</p>
              <h6>Pressure</h6>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={UV} alt="uv" className="h-8 md:h-10 select-none" />
              <p>{uvIndex !== null ? Math.round(uvIndex) : 'N/A'}</p>
              <h6>UV</h6>
            </div>
          </div>
        </div>   
     </div>

     <ForeCast forecastData={list} />
    </>
  )
}

export default CityAndTime
