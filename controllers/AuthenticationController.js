import CredentialModel from "../models/CredentialModel.js";
import TrainerModel from "../models/TrainerModel.js";
import TraineeModel from "../models/TraineeModel.js";
import AdminModel from "../models/AdminModel.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { verifyLoginEmailTemplate } from '../templates/EmailTemplates.js';
import { nodemailerClient } from '../clients/NodeMailerClient.js'
import { generateOtp } from "../utils/generators/OtpGenerator.js";

dotenv.config();


export const login = async (req, res) => {

  const devicetype = req.headers['devicetype'];

  console.log(devicetype);
  try {
    const { email, password } = req.body;
    const user = await CredentialModel.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const otp = generateOtp(6);

    const accountResult = await CredentialModel.findOneAndUpdate({
      email: user.email
    }, {
      emailOtp: otp,
    }, {
      new: true
    });

    nodemailerClient.sendMail(verifyLoginEmailTemplate(req.body.firstName, req.body.email,otp, devicetype))


    res.status(200).json({message: "Login successful"});
  } catch (error) {
    res.status(409).json({
      message: error.message
    });
  }
}

export const verifyOtp = async (req, res) => {

  const reqOtp = parseInt(req.body.otp);

  try {
    const account = await CredentialModel.findOne({ email: req.body.email });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }


    if (account.emailOtp !== reqOtp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    console.log(1)

    const information = await CredentialModel.findByIdAndUpdate(
      account._id,
      { emailOtp: null },
      { new: true }
    )
    console.log(2)


    const token = jwt.sign({
      id: account._id,
      role: information.role
    }, process.env.JWT_KEY, {
      expiresIn: "7d"
    });
    
    res.status(200).json({ token: token, role: information.role });
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}

export const resendOtp = async (req, res) => {
  try {
    const account = await CredentialModel.findOne({ email: req.body.email });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const otp = generateOtp(6);

    await CredentialModel.findByIdAndUpdate(
      account._id,
      { emailOtp: otp },
      { new: true }
    )

    nodemailerClient.sendMail(verifyLoginEmailTemplate(req.body.firstName, req.body.email,otp))

    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    res.status(409).json({message: error.message});
  }

}

export const validateRole = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const role = decoded.role;
    
    if (role === "admin" ) {
      const information = await AdminModel.findOne({ credentialId: decoded.id });
      return res.status(200).json({role: role, user: information })
    }
    if (role === "trainer") {
      const information = await TrainerModel.findOne({ credentialId: decoded.id });
      return res.status(200).json({role: role, user: information })
    }

    if (role === "trainee") {
      const information = await TraineeModel.findOne({ credentialId: decoded.id });
      return res.status(200).json({role: role, user: information })
    }


  } catch (error) {
    res.status(401).json({message: error.message});
  }
}