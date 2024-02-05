const input = document.querySelector(".input");
const iP = document.querySelector(".IP-address");
const isp = document.querySelector(".ISP");
const locate = document.querySelector(".location");
const timezone = document.querySelector(".timezone");
const apiKey = "at_I7NMutP4Sk4ZiXx7vI2al0lXAAXmc";

let map;
const loadMap = function (lat, lng) {
  map = L.map("map").setView([lat, lng], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  var marker = L.marker([lat, lng]).addTo(map);
};

function panToNewLocation(latitude, longitude) {
  if (!map) {
    console.error("Map not initialized.");
    return;
  }

  const newCenter = [latitude, longitude];
  var marker = L.marker([latitude, longitude]).addTo(map);
  map.panTo(newCenter);
}

async function getGeoIPInfo() {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    const { ip, isp, location } = data;

    // Now you can use 'data' to access the information provided by the GeoIPify API
    const apiData = { ip, isp, location };

    return apiData;
  } catch (error) {
    console.error("Error fetching GeoIP information:", error.message);
  }
}

getGeoIPInfo().then((apiData) => {
  input.value = apiData.ip;
  iP.querySelector(".bold").textContent = apiData.ip;
  isp.querySelector(".bold").textContent = apiData.isp;
  locate.querySelector(".bold").textContent = apiData.location.region;
  timezone.querySelector(".bold").textContent = apiData.location.timezone;

  loadMap(apiData.location.lat, apiData.location.lng);
});

async function SearchGeoIPInfo(query) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${query}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    const { ip, isp, location } = data;

    const apiData = { ip, isp, location };

    return apiData;
  } catch (error) {
    console.error("Error fetching GeoIP information:", error.message);
  }
}

const form = document.querySelector(".form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.querySelector(".input");

  console.log(input.value);
  const query = input.value;

  SearchGeoIPInfo(query).then((apiData) => {
    iP.querySelector(".bold").textContent = apiData.ip;
    isp.querySelector(".bold").textContent = apiData.isp;
    locate.querySelector(".bold").textContent = apiData.location.region;
    timezone.querySelector(".bold").textContent = apiData.location.timezone;

    panToNewLocation(apiData.location.lat, apiData.location.lng);
  });
});
