const mongoose = require('mongoose')

const uploadedImagesSchema = new mongoose.Schema({
    user_email:{
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    user_id:{
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    image_path: {
        type: String,
        required: true,
        min:6,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('UploadedImages', uploadedImagesSchema)
