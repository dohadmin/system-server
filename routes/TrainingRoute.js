import express from "express";
import { 
  createTraining,
  getTrainings,
  deleteTraining,
  releaseTraining,
  updateTraining,
  getTrainingsByTrainer,
  getTrainingsByTrainee,
 } from "../controllers/TrainingController.js"; 

const router = express.Router()

router.post('/create-training', createTraining);
router.put('/release-training', releaseTraining);
router.put('/update-training', updateTraining);
router.delete('/delete-training/:id', deleteTraining);
router.get('/get-trainings', getTrainings);
router.get('/get-trainings-by-trainer/:trainerId', getTrainingsByTrainer);
router.get('/get-trainings-by-trainee/:traineeId', getTrainingsByTrainee);
export default router