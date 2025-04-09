var express = require("express")
var app = express()

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