import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const nodemailerClient = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});