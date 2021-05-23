const router = require('express').Router();
const jwt = require('jsonwebtoken')
const images = require('../model/UploadedImages');

const auth = require('./verify_token')
const multer = require('multer')
const User = require('../model/User');
var storage = multer.diskStorage(
    {
        destination: './uploads',
        filename: function ( req, file, cb ) {
            cb( null,  Date.now()+file.originalname);
        }
    }
);

const upload = multer({storage: storage})

router.post('/uploadImage',auth.auth,upload.single("image"),async (req, res)=>
{
    console.log(req.user._id)
    const user =await User.findOne({_id: req.user._id});
    const image = new images({
        user_email: user.email,
        user_id: user._id,
        image_path: req.file.path
    });
    try{
        const saveUser = await image.save();
        res.send({"image": image._id});
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
});

router.get('/images',auth.auth,async (req, res)=>
{
    const output = [];
    const images_data =await images.find({user_id: req.user._id});
    images_data.forEach(element => {
        output.push({
            "image_url": process.env.env_url + element.image_path,
            "user_email": element.user_email
        })});
   
    try{
        res.send(output);
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
});
module.exports = router;