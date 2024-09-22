import mongoose, { Schema } from 'mongoose';

const RequestSchema = mongoose.Schema(
  {
    avatar: { type: String, required: false },
    firstName: { type: String, required: true },
    middleInitial: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    civilStatus: { type: String, required: true},
    gender: { type: String, required: true },
    street: { type: String, required: true },
    municipality: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    credentialId: { type: Schema.Types.ObjectId, required: false, ref: "credentials" },
    trainerId: { type: Schema.Types.ObjectId, required: false, ref: "trainers" },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("requests", RequestSchema);

export default RequestModel;