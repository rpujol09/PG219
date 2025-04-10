const map = L.map('map').setView([45.75, 4.85], 13); // Exemple : Lyon

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Ajout d'un marker pour tester
L.marker([45.75, 4.85]).addTo(map).bindPopup("Cache test !").openPopup();

// Fonction pour valider le format de l'email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour valider les emails
  return emailRegex.test(email);
}

// FOnction pour s'inscrire
async function registerUser(email, password) {

  // Définir l'élément pour afficher les erreurs
  const errorElement = document.getElementById("registerError");
  
  // Valider le format de l'email avant d'envoyer la requête
  if (!isValidEmail(email)) {
    errorElement.textContent = "Adresse e-mail invalide !";
    errorElement.style.display = "block"; // Afficher le message d'erreur
    return;
  }

  // Masquer le message d'erreur si l'email est valide
  errorElement.style.display = "none";

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Inscription réussie !");
      //vider les champs du formulaire
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
    } else {
      errorElement.textContent = `Erreur : ${data.message}`;
      errorElement.style.display = "block"; // Afficher le message d'erreur
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    errorElement.textContent = "Une erreur est survenue lors de l'inscription.";
    errorElement.style.display = "block"; // Afficher le message d'erreur
  }
}

// Fonction pour se connecter
async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Connexion réussie !");
      localStorage.setItem("token", data.token); // Stocker le token JWT

      //vider les champs du formulaire
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";

      //afficher l'email de l'utilisateur connecté
      const userEmail = document.getElementById("userEmail");
      userEmail.textContent = `Connecté en tant que : ${email}`;
      userEmail.style.display = "block"; // Afficher l'email de l'utilisateur
      //Masquer les formulaire de connexion et d'inscription
      document.getElementById("formsContainer").style.display = "none";

      //afficher le bouton de déconnexion
      document.getElementById("logoutButton").style.display = "block";
    } else {
      alert(`Erreur : ${data.message}`);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
  }
}

// Fonction pour afficher/masquer le mot de passe
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

// Fonction pour se déconnecter
function logout() {
  localStorage.removeItem("token"); // Supprimer le token JWT
  alert("Déconnexion réussie !");

  //Masquer l'email de l'utilisateur
  const userEmailElement = document.getElementById("userEmail");
  userEmailElement.textContent = "";
  //Réafficher les formulaires de connexion et d'inscription
  document.getElementById("formsContainer").style.display = "block";
  //Masquer le bouton de déconnexion
  document.getElementById("logoutButton").style.display = "none";
}

//fonction pour vérifier si le token est expir
function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split(".")[1])); // Décoder le token
  const now = Math.floor(Date.now() / 1000); 
  return payload.exp < now; // Vérifier si le token est expiré
}

// Fonction pour récupérer les géocaches protégées
async function fetchProtectedGeocaches() {
  const token = localStorage.getItem("token"); // Récupérer le token JWT
  if (!token) {
    alert("Vous devez être connecté pour accéder à cette fonctionnalité.");
    return;
  }
  if (isTokenExpired(token)) {
    alert("Votre session a expiré. Veuillez vous reconnecter.");
    logout();
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/geocaches", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Géocaches :", data);
      // Exemple : Ajouter les géocaches sur la carte
      data.forEach((geocache) => {
        L.marker([geocache.latitude, geocache.longitude])
          .addTo(map)
          .bindPopup(geocache.description || "Géocache");
      });
    } else {
      alert(`Erreur : ${data.message}`);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des géocaches :", error);
  }
}

// Gestion des formulaires
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  registerUser(email, password);
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  loginUser(email, password);
});