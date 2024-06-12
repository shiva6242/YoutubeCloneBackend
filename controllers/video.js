
const {createError}=require('../error.js')

const Video = require('../models/Video.js')
const User = require('../models/User.js')




//  const addVideo = async (req, res, next) => {
//   console.log(req.body)
//   console.log("klsjdfjsjfljdlkj"
//   )
//   const newVideo = new Video({ userId:req.body.Id, ...req.body });
//   try {
//     const savedVideo = await newVideo.save();
//     res.status(200).json(savedVideo);
//   } catch (err) {
//     next(err);
//   }
// };

 const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

 const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

 const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

 const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

 const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

 const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

const getByTag = async (req, res, next) => {
  const tags = req.query.tags ? req.query.tags.split(",") : [];
  console.log(tags);

  try {
    // Fetch all videos
    const videos = await Video.find().limit(100); // You may adjust the limit as needed

    // Filter videos that contain any of the tags
    const filteredVideos = videos.filter(video => {
      const videoTags = video.tags[0].split(','); // Split the single tag string into an array
      return tags.some(tag => videoTags.includes(tag));
    });

    res.status(200).json(filteredVideos);
    console.log(filteredVideos);
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  const query = req.query.q;
  console.log(query);

  try {
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { "tags.0": { $regex: query, $options: "i" } }
      ]
    }).limit(40);

    res.status(200).json(videos);
    console.log(videos);
  } catch (err) {
    next(err);
  }
};


module.exports={search,getByTag,sub,trend,random,updateVideo,getVideo,addView,deleteVideo}