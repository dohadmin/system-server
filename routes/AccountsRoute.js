import express from "express";
import Multer from "multer";
import { 
  createAdmin,
  createTrainer,
  updateTrainer,
  fetchTrainers,
  fetchTrainees,
  requestTrainee,
  fetchTraineeRequests,
  fetchTraineeRequestCount,
  approveTraineeRequest,
  updateTraineeRequest,
  updateTraineeProfile,
  fetchTraineeRequestsById,
  approveAllTraineeRequests,
  declineTraineeRequest,
  updateTrainee,
  updateAdminProfile,
  updateTrainerProfile,
  fetchTraineesByTrainerId,
  updateAdminSecurity,
  deleteUser,
  searchTrainees,
  resetPassword,
 } from "../controllers/AccountController.js"; 

const router = express.Router()
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

router.post ('/create-admin', upload.single("admin_avatar"), createAdmin);
router.post('/create-trainer', upload.single("trainer_avatar"), createTrainer);
router.put('/update-trainer', upload.single("trainer_avatar"), updateTrainer);
router.put('/update-trainee', upload.single("trainee_avatar"), updateTrainee);
router.post('/request-trainee', upload.single("trainee_avatar"), requestTrainee);
router.put('/update-trainee-profile', upload.single("trainee_avatar"), updateTraineeProfile);
router.get('/get-trainers', fetchTrainers);
router.get('/get-trainees', fetchTrainees);
router.get('/get-trainee-requests', fetchTraineeRequests);
router.get('/get-trainee-requests-count', fetchTraineeRequestCount);
router.post('/approve-trainee-request', approveTraineeRequest);
router.post('/update-trainee-request', updateTraineeRequest);
router.post('/approve-all-trainee-requests', approveAllTraineeRequests);
router.get('/get-trainee-requests-by-id/:id', fetchTraineeRequestsById);
router.post('/decline-trainee-request', declineTraineeRequest);
router.put('/update-admin-profile', upload.single("admin_avatar"), updateAdminProfile);
router.put('/update-trainer-profile', upload.single("trainer_avatar"), updateTrainerProfile);
router.put('/update-admin-security', updateAdminSecurity);
router.delete('/delete-user/:id', deleteUser);
router.get('/search-trainees', searchTrainees);
router.get('/get-trainees-by-trainer-id/:id', fetchTraineesByTrainerId);
router.post('/reset-password', resetPassword);


export default router