import express from "express";
import { 
  updateDownloads,
  getDownloads,
  resetDownloads
 } from "../controllers/DownloadController.js"; 

const router = express.Router()

router.put('/update-downloads', updateDownloads);
router.get('/get-downloads', getDownloads);
router.put('/reset-downloads', resetDownloads);

export default router