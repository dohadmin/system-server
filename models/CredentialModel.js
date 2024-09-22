import mongoose from 'mongoose';

const credentialsSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String },
    emailOtp: { type: Number },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

const CredentialModel = mongoose.model("credentials", credentialsSchema);

export default CredentialModel;