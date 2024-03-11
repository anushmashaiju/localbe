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
 res.status(201).json({ success: true, message: 'User created successfully', user });
} catch (err) {
 console.error("Error during user registration:", err);
 res.status(500).json({ error: "Internal Server Error" });
}
});

//LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'No record exists for the given email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ email: user.email, _id: user._id }, "your-secret-key", { expiresIn: "1d" });
        
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.status(200).json({ success: true, message: 'Login successful', token, _id: user._id, userName: user.userName });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;