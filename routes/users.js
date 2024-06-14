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
router.put("/:id",verifyToken, update);

//delete user
router.delete("/:id",verifyToken, deleteUser);

//get a user
router.get("/find/:id",verifyToken, getUser);

//subscribe a user
router.put("/sub/:id",verifyToken, subscribe);

//unsubscribe a user
router.put("/unsub/:id",verifyToken, unsubscribe);

//like a video
router.put("/like/:videoId",verifyToken,  like);

//dislike a video
router.put("/dislike/:videoId",verifyToken,  dislike);

module.exports= router;
