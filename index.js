import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AuthenticationRoute from './routes/AuthenticationRoute.js';
import AccountsRoute from './routes/AccountsRoute.js';
import TrainingRoute from './routes/TrainingRoute.js';
import CertificateRoute from './routes/CertificateRoute.js';
import AuditTrailRoute from './routes/AuditTrailRoute.js';
import DownloadRoute from './routes/DownloadRoute.js';
import NotificationRoute from './routes/NotificationRoute.js';



const app = express();


dotenv.config()

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors())



mongoose
  .connect( process.env.MONGO_DB_SECRET + '/doh',)
  .then(()=> app.listen(process.env.PORT, () => console.log(`Successfully connected to port: ${process.env.PORT}`)))
  .catch((error)=>console.log(error)
);



app.use('/account', AccountsRoute);
app.use('/auth', AuthenticationRoute);
app.use('/training', TrainingRoute);
app.use('/certificate', CertificateRoute);
app.use('/audit', AuditTrailRoute);
app.use('/download', DownloadRoute);
app.use('/notification', NotificationRoute);