const bcrypt = require('bcryptjs')
const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} =  require('../validation')
const jwt = require('jsonwebtoken')
router.post('/register',async (req, res)=>
{
    // validate data
    const validation = registerValidation(req.body);
   if (validation.error!= null){
        return res.status(400).send(validation.error.details[0].message)
   }
   // check if user already exists
   const emailExist = await User.findOne({email: req.body.email});
   if(emailExist) return res.status(400).send("User Alraedy Exists")
   //Hash passwords
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(req.body.password, salt)
   // new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        const saveUser = await user.save();
        res.send({"user": user._id});
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
})
//router.post('/login')
router.post('/login', async(req, res)=>{
     // validate data
     const validation = loginValidation(req.body);
     if (validation.error!= null){
          return res.status(400).send(validation.error.details[0].message)
     };
     // Check email exists
     const user = await User.findOne({email: req.body.email});
     if(!user) return res.status(400).send("Email or Password is wrong")
    // check password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword)  return res.status(400).send("Password is wrong")
    const token = jwt.sign({_id: user._id},process.env.tokenSecret)
    res.header('Authorization', token).send(token)
    res.send("Logged in")
}
)
module.exports = router;