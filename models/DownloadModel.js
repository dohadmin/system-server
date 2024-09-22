import mongoose, { Schema } from 'mongoose';

const DownloadSchema = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    trainingId: { type: Schema.Types.ObjectId, required: true, ref: 'trainings' },
    certificateId: { type: Schema.Types.ObjectId, required: true, ref: 'certificates' },
    remaining: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DownloadModel = mongoose.model("downloads", DownloadSchema);

export default DownloadModel;
