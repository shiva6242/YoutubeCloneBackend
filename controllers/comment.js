
const {createError}=require('../error.js')

const Comment=require('../models/Comment.js')
const Video = require('../models/Video.js')
 const addComment = async (req, res, next) => {
  
 try {
  const comment=new Comment({
    videoId:req.body.videoId,
    desc:req.body.newComment,
    userId:req.body.currentUser._id
  })
  await comment.save();
 } catch (error) {
   console.log(error);
 }
};

 const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(res.params.id);
    const video = await Video.findById(res.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted.");
    } else {
      return next(createError(403, "You can delete ony your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

 const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

module.exports={addComment,getComments,deleteComment}