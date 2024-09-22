import express from "express";

import { 
  requestAgain,
  getNotifications,
  readNotification,
  getTraineeNotification
 } from "../controllers/NotificationController.js"; 

const router = express.Router()


router.post('/request-again',  requestAgain);
router.get('/get-notifications',  getNotifications);
router.put('/read-notification',  readNotification);
router.get('/get-requests-download/:traineeId',  getTraineeNotification);

export default router