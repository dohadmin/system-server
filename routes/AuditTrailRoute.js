import express from "express";
import { 
  createAuditTrail,
  getAuditTrails
 } from "../controllers/AuditTrailController.js"; 

const router = express.Router()


router.post('/create-audit-trail', createAuditTrail);
router.get('/get-audit-trails', getAuditTrails);

export default router