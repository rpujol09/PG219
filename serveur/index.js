const express = require("express")
const mongose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/User")
const Geocache = require("./models/Geocache")
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

        res.status(200).json({ message: "Utilisateur créé !" });
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
            return res.status(401).json({ message: "Cette utilisateur n'existe pas" });
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

//Accés à l'app
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur Geocaching !");
});

// 1. Ajouter un géocache 
// à améliorer : ajouter un commentaire pour le cache ajouté qui s'affichera quand il sera trouvé et un commentaire pour aider à le trouver
app.post("/geocaches", authenticateToken, async (req, res) => {
    try {
        const { name, latitude, longitude, description } = req.body ;

        const geocache = new Geocache({
            name,
            latitude,
            longitude,
            description,
            createdBy : req.user.id
        }) ;
        await geocache.save();
        res.status(201).json(geocache) ;
    }
    catch(error) {
        console.error("Erreur ajout géocache :", error) ;
        res.status(500).json({message: "Erreur lors de l'ajout du géocache"}) ;
    }
}) ;

// 2. Récupérer tous les géocaches (GET /geocaches)
// à améliorer : ajouter un filtre par localisation et distance
app.get("/geocaches", async (req, res) => {
    try {
        const geocaches = await Geocache.find();
        res.json(geocaches) ;
    }
    catch (error) {
        console.error("Erreur récupération géocaches :", error) ;
        res.status(500).json({message: "Erreur de récupération des géocaches"}) ;
    }
});


// 3. Récupérer un geocache par ID (GET /geocaches/:id)
app.get("/geocaches/:id", async (req, res) => {
    try {
        const geocache = await Geocache.findById(req.params.id);
        if (!geocache) return res.status(404).json({ message: "Géocache introuvable" });
        res.json(geocache);
    } 
    catch (error) {
        console.error("Erreur récupération géocache :", error) ;
        res.status(500).json({ message: "Erreur de récupération du géocache" });
    }
});
  
// 4. Mettre à jour un geocache (PATCH /geocaches/:id)
// à améliorer : autoriser la mise à jour que si on l'a créé

app.patch("/geocaches/:id", authenticateToken, async (req, res) => {
    try {
        const updates = req.body ;
        const updated = await Geocache.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
        if (!updated) return res.status(404).json({ error: "Non trouvé" });
        res.json(updated);
    }
    catch (error) {
        console.error("Erreur modification géocache :", error) ;
        res.status(500).json({ message: "Erreur de modification du géocache" });
    }
}) ;

// 5. Supprimer un produit (DELETE /products/:id)
// à améliorer : autoriser la suppression que si on l'a créé

app.delete("/geocaches/:id", async (req, res) => {
    try {
        const deleted = await Geocache.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Non trouvé" });
        res.json({ success: true });
    }
    catch (error) {
        console.error("Erreur supression géocache :", error) ;
        res.status(500).json({ message: "Erreur de suppression du géocache" });
    }
});

// lance le serveur
app.listen(3000, '0.0.0.0', () => {
    console.log("En attente de requêtes...");
});