const express=require('express')
const router = express.Router();

const {
  update,
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
}=require('../controllers/user.js');
const { verifyToken }=require('../verifyToken.js');


//update user
router.put("/:id", update);

//delete user
router.delete("/:id", verifyToken, deleteUser);

//get a user
router.get("/find/:id", getUser);

//subscribe a user
router.put("/sub/:id",  subscribe);

//unsubscribe a user
router.put("/unsub/:id",  unsubscribe);

//like a video
router.put("/like/:videoId",like);

//dislike a video
router.put("/dislike/:videoId", dislike);

module.exports= router;
