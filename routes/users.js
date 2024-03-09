const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

//UPDATE USER

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("account has been updated")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can update only your account!");
    }
})

//DELETE USER

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
           // const user = await User.deleteOne(req.params.id);
           await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can delete only your account!");
    }
})

//GET A USER

router.get("/:id", async (req, res) => {
    try {
        const user =await User.findById(req.params.id);
        const {password,updatedAt,...other}=user._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports = router
