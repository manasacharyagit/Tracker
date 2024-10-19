const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error); // Log geolocation errors
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0, // No saved data, no caching
    }
  );
}

// Initialize the map with a default view
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Manas' Project",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Center the map on the new location
  map.setView([latitude, longitude], 16); // Optional: You can comment this out if you want to keep the map fixed

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Update existing marker
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    // Add new marker
  }
  console.log(`Number of active users: ${Object.keys(markers).length}`);
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); // Remove marker for disconnected user
    delete markers[id]; // Delete marker reference
  }
});
