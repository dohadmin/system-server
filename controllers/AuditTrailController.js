import AuditTrailModel from '../models/AuditTrailModel.js';

export const createAuditTrail = async (req, res) => {
  try {
    const { userId, action, description } = req.body;

    const newAuditTrail = new AuditTrailModel({
      userId,
      action,
      description,
    });

    await newAuditTrail.save();

    res.status(201).json({ message: "Audit trail created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
}

export const getAuditTrails = async (req, res) => {
  try {
    const auditTrails = await AuditTrailModel.find().populate('userId').sort({ createdAt: -1 });

    res.status(200).json(auditTrails);
  } catch (error) {
    res.status(500).json(error);
  }
}