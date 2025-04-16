const mongoose = require("mongoose");

const geocacheSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: String,
    // pour savoir qui a créé le géocache
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt : { type: Date, default: Date.now },
});

module.exports = mongoose.model('Geocache', geocacheSchema);