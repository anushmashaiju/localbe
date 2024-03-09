const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt= require ('jsonwebtoken')

//SIGN UP
router.post("/SignUp", async (req, res) => {  
try{
    //generate password
    const salt =await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);

    //create new user
    const newUser = new User({
        userName:req.body.username,
        email:req.body.email,
         password:hashedPassword,
 });
const user = await newUser.save();
res.status(200).json(user);
} catch (err) {
console.error("Error during user registration:", err);
res.status(500).json({ error: "Internal Server Error" });
}
});

//LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const response = await bcrypt.compare(password, user.password);
            if (response) {
                const token = jwt.sign({email:user.email},"localconnectsecretkey",{expiresIn:"1d"})
                res.cookie("token",token);
                res.status(200).json({ success: true, message: 'Login successful', token ,_id:user._id,userName:user.userName});
            } else {
                res.json("incorrect password");
            }
        } else {
            res.json("no record existed");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;