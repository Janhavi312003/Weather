import { useState } from "react"
import CityAndTime from "./components/CityAndTime"
import Navbar from "./components/Navbar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";




const App = () => {

  const [cityName, setCityName] = useState('')
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)

  const handleCitySearch = (city) => {
    setCityName(city)
    setLat(null)
    setLon(null)
  }

  const handleLocationFetch = (latitude, logitude) => {
    setLat(latitude)
    setLon(logitude)
    setCityName('')
  }

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <div className="w-full h-full">
        <Navbar onCitySearch={handleCitySearch} onLocationFetch={handleLocationFetch} />
      </div>
      <div className="">
        <CityAndTime cityName={cityName} lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
      </div>
      
      
   </div>

  )
}

export default App
