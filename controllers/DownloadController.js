import DownloadModel from "../models/DownloadModel.js";

export const updateDownloads = async (req, res) => {
  try {
    const { userId, trainingId, certificateId } = req.body;


    const filter = { userId, trainingId, certificateId };

    // Check if the document exists
    let downloadEntry = await DownloadModel.findOne(filter);

    if (!downloadEntry) {
      // Create a new document with initial remaining value
      downloadEntry = new DownloadModel({
        userId,
        trainingId,
        certificateId,
        remaining: 1// Set initial remaining value to 1
      });
    } else {
      // Increment the remaining value by 1
      downloadEntry.remaining += 1;
    }

    await downloadEntry.save();

    res.status(200).json({ message: 'Downloads have been updated' });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getDownloads = async (req, res) => {
  try {
    const { userId, trainingId, certificateId } = req.query;

    const downloadEntry = await DownloadModel.findOne({ 
      userId: userId,
      trainingId: trainingId,
      certificateId: certificateId
     });

    if (!downloadEntry) {
      return res.status(200).json([]); // Return an empty array if the download entry is not found
    }

    res.status(200).json(downloadEntry); // Return the exact download entry
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const resetDownloads = async (req, res) => {
  const { certificateId, userId, trainingId } = req.body;

  console.log(certificateId);
  console.log(userId);
  console.log(trainingId);

  try {
    const response = await DownloadModel.findOneAndUpdate(
      { certificateId, userId, trainingId },
      { remaining: 0 },
    )
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}