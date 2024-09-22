import { extractCloudinaryIDForCertificates } from '../helpers/cloudinary/ExtractId.js';
import { imageDeleter } from '../helpers/cloudinary/imageDeleter.js';
import { imageUploader } from '../helpers/cloudinary/ImageUploader.js';
import CertificateModel from '../models/CertificateModel.js';
import { v4 as uuidv4 } from 'uuid';

export const createCertificate = async (req, res) => {
  try {
    const certificate = req.body;


    let cloudinaryResponse = null;

    if (req.file) {

      const sizes = {
        A4: { width: 1123, height: 794 },
        A5: { width: 794, height: 559 }
      };

      cloudinaryResponse = await imageUploader(
        req.file.buffer,
        req.file.mimetype,
        'certificates',
        uuidv4(),
        sizes[certificate.size].width,
        sizes[certificate.size].height
      );

      certificate.template = cloudinaryResponse.secure_url;
    }

    // Parse layers and expiry if they are strings
    if (typeof certificate.layers === 'string') {
      certificate.layers = JSON.parse(certificate.layers);
      console.log(certificate.layers);
    }

    if (typeof certificate.expiry === 'string') {
      certificate.expiry = JSON.parse(certificate.expiry);
      console.log(certificate.expiry);
    }


    const newCertificate = new CertificateModel(certificate);
    await newCertificate.save();

    res.status(200).json({ message: `${newCertificate.name} has been created` });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
}


export const getCertificates = async (req, res) => {
  try {
    const certificates = await CertificateModel.find()
    .sort({ createdAt: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const updateCertificate = async (req, res) => {
  try {

    const certificate = req.body;
    let cloudinaryResponse = null
    const oldCertificate = await CertificateModel.findById(certificate._id);



    if (req.file) {
      if (oldCertificate.template) {
        const imageId = extractCloudinaryIDForCertificates(oldCertificate.template)
        console.log(imageId)
        await imageDeleter("certificates", imageId)
      }
      const sizes = {
        A4: { width: 1123, height: 794 },
        A5: { width: 794, height: 559 }
      };

      cloudinaryResponse = await imageUploader(
        req.file.buffer,
        req.file.mimetype,
        'certificates',
        uuidv4(),
        sizes[certificate.size].width,
        sizes[certificate.size].height
      );
    }

    if (oldCertificate.template) {
      if (!req.file) {
        const imageId = extractCloudinaryIDForCertificates(oldCertificate.template)
        console.log(imageId)
        const res = await imageDeleter("certificates", imageId)
      }
    }

    if (typeof certificate.layers === 'string') {
      certificate.layers = JSON.parse(certificate.layers);
      console.log(certificate.layers);
    }

    if (typeof certificate.expiry === 'string') {
      certificate.expiry = JSON.parse(certificate.expiry);
      console.log(certificate.expiry);
    }

    const updatedCertificate = await CertificateModel.findByIdAndUpdate(
      certificate._id, 
      {
        template: cloudinaryResponse ? cloudinaryResponse.secure_url : oldCertificate.template,
        name: certificate.name,
        description: certificate.description,
        course: certificate.course,
        status: certificate.status,
        expiry: {
          time: certificate.expiry.time,
          timeUnit: certificate.expiry.timeUnit,
        },
        layers: certificate.layers,
        size: certificate.size,
      }, 
      { new: true }
    );

    console.log(updatedCertificate);
    res.status(201).json({message: `${updatedCertificate.name} has been updated`});
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
}

export const getValidCertificates = async (req, res) => {
  try {
    const certificates = await CertificateModel.find({ status: 'Active' });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}