import mongoose, { Schema } from 'mongoose';

const auditTrailSchema = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "trainers" },
    action: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const AuditTrailModel = mongoose.model("audittrails", auditTrailSchema);

export default AuditTrailModel;