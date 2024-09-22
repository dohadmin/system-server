import mongoose from 'mongoose';

const CertificateSchema = mongoose.Schema(
  {
    template: { type: String, required: false, default: null },
    name: { type: String, required: true },
    description: { type: String, required: true },
    expiry: {
      time: { type: Number, required: true },
      timeUnit: { type: String, required: true },
    },
    status: { type: String, required: true },
    course: { type: String, required: true },
    layers: [
      {
        size: { type: Number, required: true },
        status: { type: String, required: true },
        text: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        visible: { type: Boolean, required: true}
      },
    ],
    size: { type: String, required: true },
  },
  { timestamps: true }
);

const CertificateModel = mongoose.model("certificates", CertificateSchema);

export default CertificateModel;
