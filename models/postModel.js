const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: String,
    title: String,
    price: String,
    unidaddeprecio: String,
    oferta: String,
   
   
    features: {
        type: Array,
        
    },

    images: {
        type: Array,
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)