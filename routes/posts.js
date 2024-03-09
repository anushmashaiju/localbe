const router = require("express").Router();
const Post = require("../models/Post")
const User =require ("../models/User")

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
      const { description, location, userId } = req.body;
      
      // Check if an image is provided
      const image = req.file ? req.file.buffer.toString('base64') : undefined;
  
      const newPost = new Post({
        description,
        location: location || "Default Location",
        userId,
        image,
      });
  
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json(err.message || "Internal Server Error");
    }
  });

// Assuming your Post model has a 'location' field
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log(req.files,req.file,"checking file")
      if (!post) {
        return res.status(404).json("Post not found");
      }
  
      if (post.userId !== req.body.userId) {
        return res.status(403).json("You can update only your post");
      }
  
      // Update the post fields
      post.description = req.body.description;
      post.location = req.body.location; // Assuming 'location' is a field in your Post model
  
      // Check if a new image is provided
      if (req.file) {
        // Update the image only if a new one is provided
        post.image = req.file.buffer.toString('base64'); // Convert the image to base64 string
      }
  
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (post.userId.toString() !== req.body.userId) {
            return res.status(403).json("You can delete only your post");
        }

        await post.deleteOne();
        return res.status(200).json("The post has been deleted");
    } catch (err) {
        console.error(err);
        return res.status(500).json(err.message || "Internal Server Error");
    }
});

//like a post and dislike post
router.put("/:id/like",async (req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("the post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("the post has been disliked");
        }
    }catch (err){
        res.status(500).json(err);
    }
})

//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch (err){
        res.status(500).json(err);
    }
});

//get posts of all users
router.get("/", (req, res) => {
    Post.find().then((response) => {
        res.status(200).json(response)
    })
        .catch((err) => {
            res.status(500).json(err)
        })
})
//grt post from a specific location
router.get("/location/:location", async (req, res) => {
    try {
        const location = req.params.location;
        const posts = await Post.find({ location: location });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//get user's post
router.get("/timeline/:userId", async (req, res) => {
    try {        
        const currentUser = await User.findById(req.params.userId);
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const userPosts = await Post.find({ userId: currentUser._id }); 
        res.status(200).json(userPosts);  // Send the user's posts in the response
    } catch (err) {        
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
