import { v4 as uuidv4 } from 'uuid';
import { imageDeleter } from "../helpers/cloudinary/imageDeleter.js";
import { imageUploader } from "../helpers/cloudinary/ImageUploader.js";
import { generateRandomPassword } from "../utils/generators/PasswordGenerator.js";
import { nodemailerClient } from "../clients/NodeMailerClient.js";
import { changeTrainerEmailTemplate, declineTraineeMailTemplate, newTraineeMailTemplate, newTrainerMailTemplate, resetPasswordTemplate } from "../templates/EmailTemplates.js";
import { extractCloudinaryID } from '../helpers/cloudinary/ExtractId.js';
import TrainerModel from "../models/TrainerModel.js";
import TraineeModel from "../models/TraineeModel.js";
import TrainingModel from "../models/TrainingModel.js";
import CredentialModel from "../models/CredentialModel.js";
import RequestModel from "../models/RequestModel.js";
import AdminModel from "../models/AdminModel.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const createAdmin= async (req, res) => { 
  try {

    const EmailExist = await AdminModel.findOne({ email: req.body.email });
    if (EmailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }


    let cloudinaryResponse = null
    if (req.file) {
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }

    const password = generateRandomPassword(16)

    const newAccountResult = await CredentialModel.create({
      email: req.body.email,
      password: await bcrypt.hash(password, saltRounds),
      role: "admin",
    })

    const newAdmin = await AdminModel.create({
      ...(cloudinaryResponse && { avatar: cloudinaryResponse.secure_url }),
      firstName: req.body.firstName,
      middleInitial: req.body.middleInitial,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      civilStatus: req.body.civilStatus,
      gender: req.body.gender,
      street: req.body.street,
      municipality: req.body.municipality,
      city: req.body.city,
      province: req.body.province,
      zipCode: req.body.zipCode,
      agency: req.body.agency,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      credentialId: newAccountResult._id,
    })
        
    res.status(200).json({message: `Your pasword is: ${password} `});
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const createTrainer = async (req, res) => { 
  try {

    const EmailExist = await CredentialModel.findOne({ email: req.body.email });
    if (EmailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }


    let cloudinaryResponse = null
    if (req.file) {
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }

    const password = generateRandomPassword(16)

    const newAccountResult = await CredentialModel.create({
      email: req.body.email,
      password: await bcrypt.hash(password, saltRounds),
      role: "trainer",
    })

    const newTrainer = await TrainerModel.create({
      ...(cloudinaryResponse && { avatar: cloudinaryResponse.secure_url }),
      firstName: req.body.firstName,
      middleInitial: req.body.middleInitial,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      civilStatus: req.body.civilStatus,
      gender: req.body.gender,
      street: req.body.street,
      municipality: req.body.municipality,
      city: req.body.city,
      province: req.body.province,
      zipCode: req.body.zipCode,
      agency: req.body.agency,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      credentialId: newAccountResult._id,
    })
    
    nodemailerClient.sendMail(newTrainerMailTemplate(req.body.firstName, req.body.email, password))
    
    res.status(200).json({message: `${newTrainer.firstName + " " + newTrainer.lastName + " "}created successfully.`});
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}


export const updateTrainer = async (req, res) => {

  try {
    const emailExist = await CredentialModel.findOne({
      email: req.body.email,
      _id: { $ne: req.body._id } // Exclude the current owner
    });    
    if (emailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    console.log(1)
    let cloudinaryResponse = null
    const oldTrainer = await TrainerModel.findOne({ credentialId: req.body._id });

    console.log(oldTrainer)
    console.log(2)

    if (req.file) {
      if (oldTrainer.avatar) {
        const imageId = extractCloudinaryID(oldTrainer.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(4)

    if (oldTrainer.avatar) {
      console.log("xd")  
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldTrainer.avatar)
        const res = await imageDeleter("avatars", imageId)
      }
    }
    console.log(1)

    console.log(req.body._id)

    const password = generateRandomPassword(16)
    console.log("2")

 
    const oldCredential = await CredentialModel.findById(req.body._id);
    if (!oldCredential) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (oldCredential.email !== req.body.email) {
      await CredentialModel.findByIdAndUpdate(
        req.body._id,
        {
          email: req.body.email,
          password: await bcrypt.hash(password, saltRounds),
        },
        { new: true }
      )
      nodemailerClient.sendMail(changeTrainerEmailTemplate(req.body.firstName, oldCredential.email, req.body.email, password))

    }
    console.log("3")


    const newTrainer = await TrainerModel.findOneAndUpdate(
      { credentialId: req.body._id }, // Query object
      {
        ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: req.body.avatar }),
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        civilStatus: req.body.civilStatus,
        gender: req.body.gender,
        street: req.body.street,
        municipality: req.body.municipality,
        city: req.body.city,
        province: req.body.province,
        zipCode: req.body.zipCode,
        agency: req.body.agency,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
      }, 
      { new: true}
    )
    console.log("4")


  
    res.status(200).json({
      message: `${newTrainer.firstName + " " + newTrainer.lastName + " "}updated successfully.`,
      user: newTrainer,
    });
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const requestTrainee = async (req, res) => {
  try {
    const EmailExist = await CredentialModel.findOne({ email: req.body.email });
    if (EmailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }
 
    let cloudinaryResponse = null
    if (req.file) {
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }


    const newTrainer = await RequestModel.create({
      ...(cloudinaryResponse && { avatar: cloudinaryResponse.secure_url }),
      firstName: req.body.firstName,
      middleInitial: req.body.middleInitial,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      civilStatus: req.body.civilStatus,
      gender: req.body.gender,
      street: req.body.street,
      municipality: req.body.municipality,
      city: req.body.city,
      province: req.body.province,
      zipCode: req.body.zipCode,
      agency: req.body.agency,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      role: "trainee",
      trainerId: req.body.trainerId,
    })
        
    res.status(200).json({message: `${newTrainer.firstName + " " + newTrainer.lastName + " "}requested successfully.`});
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const fetchTrainers = async (req, res) => {
  try {
    const accounts = await TrainerModel.find();
    res.status(200).json(accounts);
  }
  catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const fetchTrainees = async (req, res) => {
  try {
    const accounts = await TraineeModel.find().populate('trainerId');
    res.status(200).json(accounts);
  }
  catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const fetchTraineesByTrainerId = async (req, res) => {
  try {
    const accounts = await TraineeModel.find({ trainerId: req.params.id }).populate('trainerId');
    res.status(200).json(accounts);
  }
  catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const fetchTraineeRequestsById = async (req, res) => {
  try {
    const accounts = await RequestModel.find({
      trainerId: req.params.id
    }).populate('trainerId');
    res.status(200).json(accounts);
  }
  catch (error) {
    res.status(404).json({message: error.message});
  }
}
export const fetchTraineeRequests = async (req, res) => {
  try {
    const accounts = await RequestModel.find().populate('trainerId');
    res.status(200).json(accounts);
  }
  catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const fetchTraineeRequestCount = async (req, res) => {
  try {
    const requestCount = await RequestModel.countDocuments();
    res.status(200).json({ count: requestCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const approveTraineeRequest = async (req, res) => {

  try {

    const EmailExist = await CredentialModel.findOne({ email: req.body.email });
    if (EmailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    const oldTrainee = await RequestModel.findByIdAndDelete(req.body._id, { returnDocument: 'before' });





    if (!oldTrainee) {
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log(2)

    let cloudinaryResponse = null

    // if may picture tapos nilagayan ulit ng pciture then gagana tong animal na to
    if (req.file) {
      if (oldTrainee.avatar) {
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(3)
    // gagi dedelete niya kapag wala kang linagay kasi null yun eh hahaha gets bets na bas
    if (oldTrainee.avatar) {
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
    }
    console.log(4)


    const password = generateRandomPassword(16)


    console.log("-")

    const accountResult = await CredentialModel.create({
      email: req.body.email,
      password: await bcrypt.hash(password, saltRounds),
      role: "trainee",
    })

    console.log(5)
    

    nodemailerClient.sendMail(newTraineeMailTemplate(req.body.firstName, req.body.email, password))

    console.log(6)
    const newTrainee = await TraineeModel.create({ 
      ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: req.body.avatar }),
      firstName: req.body.firstName,
      middleInitial: req.body.middleInitial,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      civilStatus: req.body.civilStatus,
      gender: req.body.gender,
      street: req.body.street,
      municipality: req.body.municipality,
      city: req.body.city,
      province: req.body.province,
      zipCode: req.body.zipCode,
      controlNumber: req.body.controlNumber,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      trainerId: req.body.trainerId,
      credentialId: accountResult._id,
    })

    console.log(7)

    await TrainingModel.updateMany(
      { "trainees.id": oldTrainee._id, "trainees.status": "requests" },
      { 
        $push: { trainees: { id: newTrainee._id, status: "trainees", score: oldTrainee.score } }
      }
    );
    
    await TrainingModel.updateMany(
      { "trainees.id": oldTrainee._id, "trainees.status": "requests" },
      { 
        $pull: { trainees: { id: oldTrainee._id, status: "requests" } }
      }
    );



    res.status(200).json({ message: `${newTrainee.firstName + " " + newTrainee.lastName + " "}approved successfully.` });

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const updateTraineeRequest = async (req, res) => {

  try {


    const oldTrainee = await RequestModel.findByIdAndUpdate(req.body._id, req.body, { new: true });


    if (!oldTrainee) {
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log(2)

    let cloudinaryResponse = null

    // if may picture tapos nilagayan ulit ng pciture then gagana tong animal na to
    if (req.file) {
      if (oldTrainee.avatar) {
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(3)
    // gagi dedelete niya kapag wala kang linagay kasi null yun eh hahaha gets bets na bas
    if (oldTrainee.avatar) {
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
    }


    res.status(200).json({ message: `${oldTrainee.firstName + " " + oldTrainee.lastName + " "}updated successfully.` });

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const approveAllTraineeRequests = async (req, res) => {
  const { ids } = req.body; 
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No request IDs provided' });
    }

    const approvedTrainees = [];
    const failedApprovals = [];

    for (const id of ids) {
      try {
        
        // Find and delete the request

        const oldTrainee = await RequestModel.findById(id);

        if (!oldTrainee) {
          failedApprovals.push({ id, error: 'Request not found' });
          continue;
        }

        // Check if email exists
        const EmailExist = await CredentialModel.findOne({ email: oldTrainee.email });
        if (EmailExist) {
          failedApprovals.push({ id, error: 'Email already exists' });
          continue;
        }

        // Handle image if provided
        let cloudinaryResponse = null;
        if (req.file) {
          if (oldTrainee.avatar) {
            const imageId = extractCloudinaryID(oldTrainee.avatar);
            await imageDeleter("avatars", imageId);
          }
          cloudinaryResponse = await imageUploader(
            req.file.buffer, 
            req.file.mimetype, 
            'avatars', 
            uuidv4(), 
            300, 300
          );
        } else if (oldTrainee.avatar) {
          const imageId = extractCloudinaryID(oldTrainee.avatar);
          await imageDeleter("avatars", imageId);
        }

        // Generate a random password
        const password = generateRandomPassword(16);


        nodemailerClient.sendMail(newTraineeMailTemplate(oldTrainee.firstName, oldTrainee.email, password));

        const newCredential = await CredentialModel.create({
          email: oldTrainee.email,
          password: await bcrypt.hash(password, saltRounds),
          role: "trainee",
        })

        // Create the new trainee record
        const newTrainee = await TraineeModel.create({ 
          ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: oldTrainee.avatar }),
          firstName: oldTrainee.firstName,
          middleInitial: oldTrainee.middleInitial,
          lastName: oldTrainee.lastName,
          dateOfBirth: oldTrainee.dateOfBirth,
          civilStatus: oldTrainee.civilStatus,
          gender: oldTrainee.gender,
          street: oldTrainee.street,
          municipality: oldTrainee.municipality,
          city: oldTrainee.city,
          province: oldTrainee.province,
          zipCode: oldTrainee.zipCode,
          controlNumber: oldTrainee.controlNumber,
          phoneNumber: oldTrainee.phoneNumber,
          trainerId: oldTrainee.trainerId,
          credentialId: newCredential._id,
        });

        approvedTrainees.push({ id, trainee: newTrainee });
        await RequestModel.findByIdAndDelete(id, { returnDocument: 'before' });

      } catch (error) {
        failedApprovals.push({ id, error: error.message });
      }
    }

    res.status(200).json({
      message: 'All requests have been processed',
      approvedTrainees,
      failedApprovals,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const declineTraineeRequest = async (req, res ) => {
  try {
    const oldTrainee = await RequestModel.findByIdAndDelete(req.body._id, { returnDocument: 'before' });
    if (!oldTrainee) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    nodemailerClient.sendMail(declineTraineeMailTemplate(req.body.firstName, req.body.email))

    res.status(200).json({ message: `${oldTrainee.firstName + " " + oldTrainee.lastName + " "}declined successfully.` });
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const updateTrainee = async (req, res) => {

  console.log(req.body._id)


  try {
    const emailExist = await CredentialModel.findOne({
      email: req.body.email,
      _id: { $ne: req.body._id } // Exclude the current owner
    });    

    console.log(emailExist)
    if (emailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    console.log(1)
    let cloudinaryResponse = null
    const oldTrainee = await TraineeModel.findOne({ credentialId: req.body._id });
    console.log(2)

    if (req.file) {
      if (oldTrainee.avatar) {
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(4)

    if (oldTrainee.avatar) {
      console.log("xd")  
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        const res = await imageDeleter("avatars", imageId)
      }
    }
    console.log(1)

    console.log(req.body._id)

    const password = generateRandomPassword(16)
    console.log("2")

 
    const oldCredential = await CredentialModel.findById(req.body._id);
    if (!oldCredential) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (oldCredential.email !== req.body.email) {
      await CredentialModel.findByIdAndUpdate(
        req.body._id,
        {
          email: req.body.email,
          password: await bcrypt.hash(password, saltRounds),
        },
        { new: true }
      )
      nodemailerClient.sendMail(changeTrainerEmailTemplate(req.body.firstName, oldCredential.email, req.body.email, password))

    }
    console.log("3")


    await TraineeModel.findOneAndUpdate(
      { credentialId: req.body._id }, // Query object
      {
        ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: req.body.avatar }),
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        civilStatus: req.body.civilStatus,
        gender: req.body.gender,
        street: req.body.street,
        municipality: req.body.municipality,
        city: req.body.city,
        province: req.body.province,
        zipCode: req.body.zipCode,
        controlNumber: req.body.controlNumber,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
      }, 
      { new: true}
    )
    console.log("4")

    const newTrainee = await TraineeModel.findOne({
      credentialId: req.body._id
    }).populate('trainerId');

  
    res.status(200).json({ 
      message: `${newTrainee.firstName + " " + newTrainee.lastName + " "}updated successfully.`,
      user: newTrainee,
     });
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const updateAdminProfile = async (req, res) => {
  try {
    const emailExist = await CredentialModel.findOne({
      email: req.body.email,
      _id: { $ne: req.body._id } 
    });
    if (emailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    let cloudinaryResponse = null
    const oldAdmin= await AdminModel.findOne({ credentialId: req.body._id });
    
    console.log(oldAdmin)
    console.log(2)

    if (req.file) {
      if (oldAdmin.avatar) {
        const imageId = extractCloudinaryID(oldAdmin.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(4)

    if (oldAdmin.avatar) {
      console.log("xd")  
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldAdmin.avatar)
        await imageDeleter("avatars", imageId)
      }
    }
    console.log(1)


    const newAdmin = await AdminModel.findOneAndUpdate(
      { credentialId: req.body._id }, // Query object
      {
        ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: req.body.avatar }),
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        civilStatus: req.body.civilStatus,
        gender: req.body.gender,
        street: req.body.street,
        municipality: req.body.municipality,
        city: req.body.city,
        province: req.body.province,
        zipCode: req.body.zipCode,
        agency: req.body.agency,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,

      }, 
      { new: true}
    )
    console.log("4")

  
    res.status(200).json({ 
      message: `Your profile has been updated successfully.`,
      user: newAdmin,
     });

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}
export const updateTraineeProfile = async (req, res) => {
  try {
    const emailExist = await CredentialModel.findOne({
      email: req.body.email,
      _id: { $ne: req.body._id } 
    });
    if (emailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    let cloudinaryResponse = null
    const oldTrainee= await TraineeModel.findOne({ credentialId: req.body._id });
    
    console.log(oldTrainee)

    if (req.file) {
      if (oldTrainee.avatar) {
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(4)

    if (oldTrainee.avatar) {
      console.log("xd")  
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldTrainee.avatar)
        await imageDeleter("avatars", imageId)
      }
    }
    console.log(1)


    const newTrainee = await TraineeModel.findOneAndUpdate(
      { credentialId: req.body._id }, // Query object
      {
        ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: req.body.avatar }),
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        civilStatus: req.body.civilStatus,
        gender: req.body.gender,
        street: req.body.street,
        municipality: req.body.municipality,
        city: req.body.city,
        province: req.body.province,
        zipCode: req.body.zipCode,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,

      }, 
      { new: true}
    )
    console.log("4")

  
    res.status(200).json({ 
      message: `Your profile has been updated successfully.`,
      user: newTrainee,
     });

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}
export const updateTrainerProfile = async (req, res) => {
  try {
    console.log(req.body)
    const emailExist = await CredentialModel.findOne({
      email: req.body.email,
      _id: { $ne: req.body._id } 
    });
    if (emailExist) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    let cloudinaryResponse = null
    const oldTrainer = await TrainerModel.findOne({ credentialId: req.body._id });
    
    console.log(oldTrainer)
    console.log(2)

    if (req.file) {
      if (oldTrainer.avatar) {
        const imageId = extractCloudinaryID(oldTrainer.avatar)
        await imageDeleter("avatars", imageId)
      }
      cloudinaryResponse = await imageUploader(
        req.file.buffer, 
        req.file.mimetype, 
        'avatars', 
        uuidv4(), 
        300, 300
      );
    }
    console.log(4)

    if (oldTrainer.avatar) {
      console.log("xd")  
      if (!req.file) {
        console.log("x2")  
        const imageId = extractCloudinaryID(oldTrainer.avatar)
        await imageDeleter("avatars", imageId)
      }
    }
    console.log(1)


    const newTrainer = await TrainerModel.findOneAndUpdate(
      { credentialId: req.body._id }, // Query object
      {
        ...(cloudinaryResponse ? { avatar: cloudinaryResponse.secure_url } : { avatar: req.body.avatar }),
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        civilStatus: req.body.civilStatus,
        gender: req.body.gender,
        street: req.body.street,
        municipality: req.body.municipality,
        city: req.body.city,
        province: req.body.province,
        zipCode: req.body.zipCode,
        agency: req.body.agency,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
      }, 
      { new: true}
    )
    console.log("4")

  
    res.status(200).json({ 
      message: `Your profile has been updated successfully.`,
      user: newTrainer,
     });

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const updateAdminSecurity = async (req, res) => {
  try {
    const accountExist = await CredentialModel.findById(req.body._id);
    if (!accountExist) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const oldPassword = accountExist.password;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;


    const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, oldPassword);
    if (!isPasswordMatch) {
      return res.status(404).json({ message: 'Old password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(409).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await CredentialModel.findByIdAndUpdate(
      req.body._id,
      {
        password: hashedPassword,
      },
      { new: true }
    )

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}


export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await CredentialModel.findById(id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    let name = "";

    // If the account role is 'trainer', delete associated trainer and trainings
    if (account.role === 'trainer') {
      const trainer = await TrainerModel.findOne({ credentialId: id });
      if (trainer.avatar) {
        const imageId = extractCloudinaryID(trainer.avatar);
        await imageDeleter("avatars", imageId);
      }
      await TrainerModel.findOneAndDelete({ credentialId: id });
      await CredentialModel.findByIdAndDelete(id);
      await TrainingModel.deleteMany({ trainerId: trainer._id });
      name = `${trainer.firstName} ${trainer.lastName}`;
    }

    // If the account role is 'trainee', delete associated trainee and remove from trainings
    if (account.role === 'trainee') {
      const trainee = await TraineeModel.findOne({ credentialId: id });
      if (trainee.avatar) {
        const imageId = extractCloudinaryID(trainee.avatar);
        await imageDeleter("avatars", imageId);
      }
      await TraineeModel.findOneAndDelete({ credentialId: id });
      await CredentialModel.findByIdAndDelete(id);

      // Remove the trainee from all training sessions
      await TrainingModel.updateMany(
        { "trainees.id": trainee._id },  // Find trainings with this trainee
        { $pull: { trainees: { id: trainee._id } } }  // Remove the trainee from the trainees array
      );

      name = `${trainee.firstName} ${trainee.lastName}`;
    }

    res.status(200).json({ message: `${name} account deleted successfully` });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};



export const searchTrainees = async (req, res) => {

  console.log(req.query.search)
  if (!req.query.search) {
    console.log("NON")
    return res.status(200).json([]);
  }
  try {

    const accounts = await TraineeModel.find({
      $or: [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { middleInitial: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
      ]
    }).populate('trainerId');
    const requests = await RequestModel.find({
      $or: [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { middleInitial: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
      ]
    }).populate('trainerId');

    const accountsWithStatus = accounts.map(account => ({
      ...account.toObject(),
      status: 'verified'
    }));
    
    const requestsWithStatus = requests.map(request => ({
      ...request.toObject(),
      status: 'pending'
    }));
    
    // Combine the results if needed
    const combinedResults = [...accountsWithStatus, ...requestsWithStatus];
    
    res.status(200).json(combinedResults);

  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const resetPassword = async (req, res) => {
  try {
    const password = generateRandomPassword(16)
    await CredentialModel.findByIdAndUpdate(
      req.body._id,
      {
        email: req.body.email,
        password: await bcrypt.hash(password, saltRounds),
      },
      { new: true }
    )
    nodemailerClient.sendMail(resetPasswordTemplate(req.body.firstName, req.body.email, password))
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}