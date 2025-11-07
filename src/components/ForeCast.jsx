import { useEffect } from "react";

const ForeCast = ({ forecastData }) => {
  // Preload images for better performance
  useEffect(() => {
    if (forecastData && Array.isArray(forecastData)) {
      forecastData.slice(0, 10).forEach(item => {
        const img = new Image();
        img.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`;
      });
    }
  }, [forecastData]);

  if (!forecastData || !Array.isArray(forecastData)) {
    return (
      <div className="flex items-center justify-center text-white md:text-4xl text-2xl mt-10">
        Loading forecast...
      </div>
    );
  }

  // Process daily forecast - get one entry per day
  const dailyForecast = forecastData.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc.find((f) => f.date === date)) {
      acc.push({
        temperature: `${Math.round(item.main.temp)}°C`,
        day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        date: date,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
        description: item.weather[0].description,
      });
    }
    return acc;
  }, []).slice(0, 5);

  // Process hourly forecast - get next 5 entries
  const hourlyForecast = forecastData.slice(0, 5).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
    degrees: `${Math.round(item.main.temp)}°C`,
    windSpeed: `${item.wind.speed} km/h`,
    description: item.weather[0].description,
  }));

  return (
    <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-8 mt-10 px-6">
      {/* Left Section: 5-Day Forecast */}
      <div className="w-full lg:w-1/3 bg-[#050e1fde] text-white rounded-lg shadow-2xl shadow-black p-5">
        <h2 className="font-bold text-2xl mb-4 flex items-center justify-center">5 Days Forecast :</h2>
        {dailyForecast.map((cast, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-700 py-3"
          >
            <div className="flex items-center gap-3">
              <img 
                src={cast.icon} 
                alt={cast.description} 
                className="w-12 h-12 object-contain" 
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="32" font-size="32">☁️</text></svg>';
                }}
              />
            </div>
            <span className="font-bold text-lg">{cast.temperature}</span>
            <span className="font-medium text-sm">{cast.day}</span>
          </div>
        ))}
      </div>

      {/* Right Section: Hourly Forecast */}
      <div className="w-full lg:w-2/3 h-auto bg-[#050e1fde] text-white rounded-lg shadow-2xl shadow-black p-5">
        <h1 className="text-2xl font-bold text-center mb-6">
          Hourly Forecast
        </h1>
        <div className="flex justify-around items-center flex-wrap gap-5">
          {hourlyForecast.map((hourly, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#1c2938] p-4 rounded-lg w-28 shadow-md gap-2"
            >
              <p className="font-medium text-sm">{hourly.time}</p>
              <img 
                src={hourly.icon} 
                alt={hourly.description} 
                className="w-12 h-12 object-contain" 
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="32" font-size="32">☁️</text></svg>';
                }}
              />
              <p className="font-bold">{hourly.degrees}</p>
              <p className="text-xs text-gray-300">{hourly.windSpeed}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForeCast;
