import NotificationModel from "../models/NotificationModel.js";


export const requestAgain = async (req, res) => {
  try {
    const { traineeId, message } = req.body;
    const notificationResult = await NotificationModel.create({
      traineeId,
      message,
      didRead: false,
    });
    res.status(200).json(notificationResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find().populate("traineeId");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const readNotification = async (req, res) => {
  try {
    // Update all notifications to mark them as read
    const notification = await NotificationModel.updateMany({}, { didRead: true });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTraineeNotification = async (req, res) => {
  const { traineeId } = req.params;
  try {
    const notifications = await NotificationModel.find({ traineeId })
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}