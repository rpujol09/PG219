import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid,Platform,ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

const Map = ({ geocaches , myGeocaches, onMarkAsFound }) => {
  const [userLocation, setUserLocation] = useState(null);

  function getDistanceInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission de localisation requise',
          message: 'Cette application a besoin de votre localisation pour afficher les géocaches.',
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS gère les permissions différemment
  };

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Erreur', 'Permission de localisation non accordée.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          Alert.alert('Erreur', 'Impossible d\'obtenir la position de l\'utilisateur');
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocation();
  }
  , []);

  // Générer les marqueurs Leaflet à partir des différents géocaches
  const filteredMarkers = userLocation && Array.isArray(geocaches) ? geocaches
    .map((geocache) => {
      const { found, latitude, longitude, name, description } = geocache;

      // Calcul de la distance entre l'utilisateur et la géocache
      const distance = getDistanceInKm(
        userLocation.latitude,
        userLocation.longitude,
        geocache.latitude,
        geocache.longitude
      );

      geocaches.forEach(g => {
        console.log(`${g.name}: found = ${g.found}`);
      });
      
      

      // Affichage du bouton trouvé lorsque nécessaire
      let showFoundButton = true;

      // Skip si le geocache est exactement sur la position utilisateur
      const isSameAsUserLocation = 
        Math.abs(userLocation.latitude - latitude) < 0.0001 &&
        Math.abs(userLocation.longitude - longitude) < 0.0001;

      if (isSameAsUserLocation) {
        console.warn("Ignoré : geocache à la position utilisateur", name);
        return '';
      }

      
      // Déterminer la couleur du geocache
      let color = null ;
      if (found) {
        color = 'green';
        showFoundButton = false;
      } else if (myGeocaches.some((myGeocache) => myGeocache._id === geocache._id)) {
        color = 'blue';
        showFoundButton = false;
      } else if (distance <= 5) {
        color = 'red';
      }

      // On n'affiche pas les geocaches trop loin
      if (!color) return '';


      // URL de l'icône en fonction de la couleur
      const iconUrl = {
        red: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
        green: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
        blue: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
      }[color];  
      
      console.log(`marker ${geocache.name}: color=${color}, iconUrl=${iconUrl}`);


      // Pour éviter les problèmes d'échappement de caractères dans le HTML
      const safeName = (name || '').replace(/"/g, '\\"');
      const safeDescription = (description || '').replace(/"/g, '\\"');

      return `
        const marker${geocache._id} = L.marker([${latitude}, ${longitude}], {
          icon: L.icon({
            iconUrl: "${iconUrl}",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(map);

        marker${geocache._id}.bindPopup(\`
          <strong>${safeName}</strong><br>
          ${safeDescription}<br>
          ${showFoundButton ? `<button onclick="markAsFound('${geocache._id}')">✅ Trouvé</button>` : ""}
        \`);
      `;
    })
    .join('') : '';
 
    console.log("🧪 HTML markers généré :", filteredMarkers);

  // HTML et JavaScript pour afficher la carte Leaflet
  const leafletHTML = userLocation
    ? `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Carte Leaflet</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        try {
          // Initialisation de la carte centrée sur la position de l'utilisateur
          var map = L.map('map').setView([${userLocation.latitude}, ${userLocation.longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Ajout des marqueurs
          ${filteredMarkers}
          // Ajouter un marqueur pour la position de l'utilisateur
          L.marker([${userLocation.latitude}, ${userLocation.longitude}]).addTo(map).bindPopup("Vous êtes ici.");
        } catch (error) {
          console.log("filteredMarkers ➡️", filteredMarkers);
          console.error("Erreur dans le script de la carte :", error);
          document.body.innerHTML = "<h1>Erreur de chargement de la carte</h1>";
        }
      </script>
      <script>
        function markAsFound(id) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "FOUND", id }));
        }
      </script>
    </body>
  </html>
`:`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Carte Leaflet</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Position par défaut (Paris)
        var map = L.map('map').setView([48.8566, 2.3522], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      </script>
    </body>
  </html>
  `; // Paris est la position par défaut
return (
  <View style={styles.container}>
    {leafletHTML ? (
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={styles.map}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("📩 Message reçu dans WebView :", data);
        
            if (data.type === "FOUND") {
              Alert.alert("✅ Géocache trouvée !", `ID : ${data.id}`);
              if (onMarkAsFound) {
                onMarkAsFound(data.id);
              }
            }
          } catch (e) {
            console.error("Erreur de parsing du message WebView :", e);
          }
        }}
      />
    ) : (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )}
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;