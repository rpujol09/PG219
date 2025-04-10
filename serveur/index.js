const express = require("express")
const mongose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/User")
const bcrypt = require("bcrypt")    
const jwt = require("jsonwebtoken")
const cors = require("cors")
const app = express()


//Utilisation du middlewre 
app.use(cors())
app.use(bodyParser.json())  

//Connexion à la base de donées
mongose.connect("mongodb://localhost:27017/geocaching")
.then(() => {
    console.log("Connexion à la base de données réussie")
}).catch((err) => {
    console.log("Erreur de connexion à la base de données", err)
});

// Fonction pour valider le format de l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour valider les emails
    return emailRegex.test(email);
}

//Inscription des users
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    //les utilisateurs doivent remplir tous les champs
    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }

    // Vérifier si l'email est valide
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Adresse e-mail invalide" });
    }
    
    try {
        //verifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur utilise déjà cette adresse mail" });
        }

        //Création d'un nouvel utilisateur
        const newUser = new User({ email, password });
        await newUser.save();   

        res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
});



//Connexion des utilisateurs
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    //les utilisateurs doivent remplir tous les champs
    if (!email || !password) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }
    try{
        //Vérifie si l'utilisateur existe
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({ message: "Cette utilisateur n'éxiste pas" });
        }

        //Vérifie le mdp
        const isPasswordValid= await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        //Création token JWT
        const token = jwt.sign({id: user._id}, "clé_secrète", {expiresIn: "24h"});

        res.status(200).json({ message: "Connexion réussie", token });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur lors de la connexion" });

    }
}
);

//Verification du token
function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, "clé_secrète", (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}


// tableau de produit vide
var geocaches = []
// à améliorer : stocker les geocaches dans une base de données

// 1. Ajouter un géocache 
// à améliorer : ajouter un commentaire pour le cache ajouté qui s'affichera quand il sera trouvé et un commentaire pour aider à le trouver

app.post("/geocaches", function (req, res) {
    geocache = {
        name: req.query.name,
        coord: req.query.coord
    }

    geocaches[geocaches.length] = geocache

    res.status(201).json(geocache)
})

// 2. Récupérer tous les géocaches (GET /geocaches)
// à améliorer : ajouter un filtre par localisation et distance

app.get("/geocaches", function (req, res) {
    res.json(geocaches)
})


// 3. Récupérer un geocache par ID (GET /geocaches/:id)

app.get("/geocaches/:id", function (req, res) {
    res.json(geocaches[req.params.id])
})


// 4. Mettre à jour un geocache (PATCH /geocaches/:id)
// à améliorer : autoriser la mise à jour que si on l'a créé

app.patch("/geocaches/:id", function (req, res) {
    if (req.query.name) {
        geocaches[req.params.id]["nom"] = req.query.name
    }

    if (req.query.price) {
        geocaches[req.params.id]["coordonnées"] = req.query.coord
    }

    res.json(geocaches[req.params.id])
})

// 5. Supprimer un produit (DELETE /products/:id)
// à améliorer : autoriser la suppression que si on l'a créé

app.delete("/geocaches/:id", function (req, res) {
    geocaches.splice(req.params.id, 1);  // supprime l'espace mémoire qui été réservé à cet élément
    res.json(req.params.id)
})

// lance le serveur
app.listen(3000, () => {
    console.log("En attente de requêtes...")
})