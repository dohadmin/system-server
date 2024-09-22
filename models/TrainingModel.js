import mongoose, { Schema } from 'mongoose';

const TrainingSchema = mongoose.Schema(
  {
    trainerId: { type: Schema.Types.ObjectId, required: true, ref: "trainers" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    trainees: [
      {
        id: { type: Schema.Types.ObjectId, required: true, refPath: 'trainees.status' }, // Reference model based on status
        score: { type: Number, required: true },
        status: { type: String, required: true, enum: ['trainees', 'requests'] },
      },
    ],
    status: { type: String, required: true, default: "on hold" },
    certificates: [
      {
        id: { type: Schema.Types.ObjectId, required: true, ref: 'certificates' },
      }
    ],
  },
  { timestamps: true }
);

const TrainingModel = mongoose.model("trainings", TrainingSchema);

export default TrainingModel;
