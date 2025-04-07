const map = L.map('map').setView([45.75, 4.85], 13); // Exemple : Lyon

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Ajout d'un marker pour tester
L.marker([45.75, 4.85]).addTo(map).bindPopup("Cache test !").openPopup();