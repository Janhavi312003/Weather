import { FiSearch } from "react-icons/fi";
import logo from "../assets/logo.png";
import location from "../assets/current location.png"
import { useState } from "react";
import { toast } from "react-toastify";

const Navbar = ({onCitySearch, onLocationFetch}) => {

  // Fixed: setSearchQuery (was setSerachQuery)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onCitySearch(searchQuery)
      setSearchQuery('') // Clear input after search
    } else {
      toast.error("Please enter a city name")
    }
  }

  const handleLocationClick = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // Fixed: pos.coords.latitude and pos.coords.longitude
        const { latitude, longitude } = pos.coords
        onLocationFetch(latitude, longitude)
        setSearchQuery('')
        toast.success("Location fetched successfully!")
      }, (error) => {
        console.log(error)
        toast.error("Unable to fetch location. Please enable location access.")
      })
    } else {
      toast.error("Geolocation is not supported by your browser")
    }
  }

  return (
    <div className="m-4">
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
         <img src={logo} alt="logo" className="w-10 h-10 select-none" />

         <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-md bg-white rounded-lg shadow-md">
           <FiSearch className="absolute left-3 text-gray-400 w-4 h-4 select-none" />
             <input
               type="text"
               value={searchQuery}
               onChange={handleSearchQuery}
               placeholder="Search for your preferred city..."
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 border-none rounded-lg outline-none"
             />
            <button type="submit" className="bg-[#050e1fde] text-white px-5 py-2 rounded-r-lg hover:bg-[#0a1a35] transition">
              Search
            </button>  
         </form>

           <div onClick={handleLocationClick} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded cursor-pointer hover:bg-green-600 transition">
             <img src={location} alt="location" className="w-5 h-5" />
             <p>Current Location</p>
           </div>
      </div>
    </div>
  )
}

export default Navbar
