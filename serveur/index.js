const express = require("express")
const app = express()

const products = []

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(3000, () => {
  console.log("En attente de requêtes...")
})

console.log("Hello World!")