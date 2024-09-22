import express from "express";
import Multer from "multer";
import { 
  createCertificate,
  updateCertificate,
  getCertificates,
  getValidCertificates,
 } from "../controllers/CertificateController.js"; 


const router = express.Router()
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

router.post('/create-certificate', upload.single("certificate_template"), createCertificate);
router.put('/update-certificate', upload.single("certificate_template"), updateCertificate);
router.get('/get-valid-certificates', getValidCertificates);
router.get('/get-certificates', getCertificates);


export default router