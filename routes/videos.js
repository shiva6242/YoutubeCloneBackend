const express=require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { addView, getByTag, getVideo, random, search, sub, trend }=require('../controllers/video.js') ;
const { verifyToken }=require('../verifyToken.js');
const Video=require('../models/Video.js')
const router = express.Router();


ffmpeg.setFfmpegPath('C:\\Users\\ROCKSTAR RAVITEJA\\OneDrive\\Desktop\\ffmpeg-7.0-essentials_build\\bin\\ffmpeg.exe');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
  

const convertVideo = (inputPath, outputPath, size) => {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([`-vf scale=${size}`])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
};
//create a video
router.post('/', upload.fields([{ name: 'video' }, { name: 'img' }]), async (req, res) => {
  try {
    const userId=req.body.Id
  
    const {title, desc, tags} = req.body;
    if (!title || !desc) {
      return res.status(400).json({ message: 'Title, description are required.' });
    }

    const videoFile = req.files.video ? req.files.video[0] : null;
    const imgFile = req.files.img ? req.files.img[0] : null;
    if (!videoFile || !imgFile) {
      return res.status(400).json({ message: 'Video and image files are required.' });
    }
  const qualities = [
    { quality: '360p', size: '640x360' },
    { quality: '480p', size: '854x480' },
    { quality: '720p', size: '1280x720' },
    { quality: '1080p', size: '1920x1080' },
  ];

  const videoPaths = [];

  for (const q of qualities) {
    const outputPath = `uploads/${Date.now()}-${q.quality}.mp4`;
    videoPaths.push({ quality: q.quality, url: `/${outputPath}` });

    try {
      await convertVideo(videoFile.path, outputPath, q.size);
    } catch (error) {
      console.error(`Error converting to ${q.quality}:`, error);
      return res.status(500).json({ message: `Error processing video for ${q.quality}` });
    }
  }

  fs.unlinkSync(videoFile.path);

  const video = new Video({
    title,
    desc,
    tags,
    userId: userId,
    imgUrl: `/${imgFile.path}`,
    videoUrl: videoPaths,
  });
  await video.save();
  res.json(video);
} catch (error) {
  res.status(500).json({ message: 'Internal Server Error' });
}
  });
router.put("/:id", verifyToken,(req,res)=>{

})
router.delete("/:id", verifyToken, (req,res)=>{

})
router.get("/find/:id", getVideo)
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub",verifyToken, sub)
router.get("/tags", getByTag)
router.get("/search", search)

module.exports= router;