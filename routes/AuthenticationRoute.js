import express from "express";

import { 
  login,
  verifyOtp,
  resendOtp,
  validateRole,
 } from "../controllers/AuthenticationController.js"; 

const router = express.Router()


router.post('/login',  login);
router.put('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/validate-role', validateRole);


export default router