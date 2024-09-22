import mongoose, { Schema } from 'mongoose';

const notificationsSchema = mongoose.Schema(
  {
    traineeId: { type: Schema.Types.ObjectId, required: true, ref: "trainees" },
    message: { type: String, required: true },
    didRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("notifications", notificationsSchema);

export default NotificationModel;