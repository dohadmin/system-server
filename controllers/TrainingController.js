import TrainingModel from "../models/TrainingModel.js"
import { ObjectId } from "mongodb";

export const createTraining = async (req, res) => {
  try {
    const training = req.body;
    const newTraining = new TrainingModel(training);
    await newTraining.save();
    res.status(201).json({message: `${newTraining.title} has been created`});
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const releaseTraining = async (req, res) => {
  try {
    const { 
      trainerId,
      id,
      title,
      description,
      date,
      trainees,
      certificates
     } = req.body;
    const updatedTraining = await TrainingModel.findByIdAndUpdate(
      id, 
      {
        title,
        description,
        date,
        trainees,
        trainerId,
        certificates,
        status : "released",
      }, 
      { new: true }
    );
    res.status(200).json({message: `${updatedTraining.title} has been released`});
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const updateTraining = async (req, res) => {
  try {
    const { 
      trainerId,
      id,
      title,
      description,
      date,
      trainees,
      certificates
     } = req.body;
    const updatedTraining = await TrainingModel.findByIdAndUpdate(
      id, 
      {
        title,
        description,
        date,
        trainees,
        trainerId,
        certificates,
      }, 
      { new: true }
    );
    res.status(200).json({message: `${updatedTraining.title} has been updated`});
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    await TrainingModel.findByIdAndDelete(id);
    res.status(200).json({message: `Training has been deleted`});
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const getTrainings = async (req, res) => {
  try {
    const trainings = await TrainingModel.aggregate([
      // Lookup for trainer details based on trainerId
      {
        $lookup: {
          from: 'trainers', // Collection for trainers
          localField: 'trainerId',
          foreignField: '_id',
          as: 'trainerDetails',
        },
      },
      {
        $addFields: {
          trainerId: { $arrayElemAt: ['$trainerDetails', 0] }, // Replace trainerId with populated trainer details
        },
      },
      {
        $unwind: {
          path: '$trainees',
          preserveNullAndEmptyArrays: true, // Keep the document structure intact if trainees array is empty
        },
      },
      {
        $lookup: {
          from: 'trainees',
          let: { traineeId: '$trainees.id', status: '$trainees.status' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$traineeId'] },
                    { $eq: ['$$status', 'trainees'] }, // Match only if status is 'trainees'
                  ],
                },
              },
            },
          ],
          as: 'traineeDetails',
        },
      },
      {
        $lookup: {
          from: 'requests',
          let: { requestId: '$trainees.id', status: '$trainees.status' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$requestId'] },
                    { $eq: ['$$status', 'requests'] }, // Match only if status is 'requests'
                  ],
                },
              },
            },
          ],
          as: 'requestDetails',
        },
      },
      {
        $addFields: {
          'trainees.id': {
            $cond: {
              if: { $eq: ['$trainees.status', 'trainees'] },
              then: { $arrayElemAt: ['$traineeDetails', 0] }, // Use populated details from 'trainees'
              else: { $arrayElemAt: ['$requestDetails', 0] }, // Use populated details from 'requests'
            },
          },
        },
      },
      // Direct lookup for certificate details without unwinding
      {
        $lookup: {
          from: 'certificates', // Collection for certificates
          localField: 'certificates.id',
          foreignField: '_id',
          as: 'certificateDetails',
        },
      },
      {
        $addFields: {
          certificates: {
            $map: {
              input: '$certificates',
              as: 'certificate',
              in: {
                $mergeObjects: [
                  '$$certificate',
                  {
                    details: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$certificateDetails',
                            cond: { $eq: ['$$this._id', '$$certificate.id'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          trainerId: { $first: '$trainerId' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          date: { $first: '$date' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          trainees: { $push: '$trainees' },
          certificates: { $first: '$certificates' }, // Use $first to prevent duplication
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          trainerId: 1,
          title: 1,
          description: 1,
          date: 1,
          status: 1,
          trainees: 1,
          certificates: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTrainingsByTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params; // Assuming trainerId is passed as a URL parameter

    const trainings = await TrainingModel.aggregate([
      // Match trainings with the specified trainerId
      {
        $match: { trainerId: ObjectId.createFromHexString(trainerId) },
      },
      // Lookup for trainer details based on trainerId
      {
        $lookup: {
          from: 'trainers', // Collection for trainers
          localField: 'trainerId',
          foreignField: '_id',
          as: 'trainerDetails',
        },
      },
      {
        $addFields: {
          trainerId: { $arrayElemAt: ['$trainerDetails', 0] }, // Replace trainerId with populated trainer details
        },
      },
      {
        $unwind: {
          path: '$trainees',
          preserveNullAndEmptyArrays: true, // Keep the document structure intact if trainees array is empty
        },
      },
      {
        $lookup: {
          from: 'trainees',
          let: { traineeId: '$trainees.id', status: '$trainees.status' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$traineeId'] },
                    { $eq: ['$$status', 'trainees'] }, // Match only if status is 'trainees'
                  ],
                },
              },
            },
          ],
          as: 'traineeDetails',
        },
      },
      {
        $lookup: {
          from: 'requests',
          let: { requestId: '$trainees.id', status: '$trainees.status' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$requestId'] },
                    { $eq: ['$$status', 'requests'] }, // Match only if status is 'requests'
                  ],
                },
              },
            },
          ],
          as: 'requestDetails',
        },
      },
      {
        $addFields: {
          'trainees.id': {
            $cond: {
              if: { $eq: ['$trainees.status', 'trainees'] },
              then: { $arrayElemAt: ['$traineeDetails', 0] }, // Use populated details from 'trainees'
              else: { $arrayElemAt: ['$requestDetails', 0] }, // Use populated details from 'requests'
            },
          },
        },
      },
      // Direct lookup for certificate details without unwinding
      {
        $lookup: {
          from: 'certificates', // Collection for certificates
          localField: 'certificates.id',
          foreignField: '_id',
          as: 'certificateDetails',
        },
      },
      {
        $addFields: {
          certificates: {
            $map: {
              input: '$certificates',
              as: 'certificate',
              in: {
                $mergeObjects: [
                  '$$certificate',
                  {
                    details: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$certificateDetails',
                            cond: { $eq: ['$$this._id', '$$certificate.id'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          trainerId: { $first: '$trainerId' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          date: { $first: '$date' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          trainees: { $push: '$trainees' },
          certificates: { $first: '$certificates' }, // Use $first to prevent duplication
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          trainerId: 1,
          title: 1,
          description: 1,
          date: 1,
          status: 1,
          trainees: 1,
          certificates: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTrainingsByTrainee = async (req, res) => {
  try {
    const { traineeId } = req.params; // Assuming traineeId is passed as a URL parameter

    const trainings = await TrainingModel.aggregate([
      // Match trainings that include the specified trainee in the trainees array
      {
        $match: {
          'trainees.id': ObjectId.createFromHexString(traineeId),
        },
      },
      // Lookup for trainer details based on trainerId
      {
        $lookup: {
          from: 'trainers', // Collection for trainers
          localField: 'trainerId',
          foreignField: '_id',
          as: 'trainerDetails',
        },
      },
      {
        $addFields: {
          trainerId: { $arrayElemAt: ['$trainerDetails', 0] }, // Replace trainerId with populated trainer details
        },
      },
      {
        $unwind: {
          path: '$trainees',
          preserveNullAndEmptyArrays: true, // Keep the document structure intact if trainees array is empty
        },
      },
      // Filter the trainees array to include only the specific trainee
      {
        $match: {
          'trainees.id': ObjectId.createFromHexString(traineeId),
        },
      },
      {
        $lookup: {
          from: 'trainees',
          let: { traineeId: '$trainees.id', status: '$trainees.status' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$traineeId'] },
                    { $eq: ['$$status', 'trainees'] }, // Match only if status is 'trainees'
                  ],
                },
              },
            },
          ],
          as: 'traineeDetails',
        },
      },
      {
        $lookup: {
          from: 'requests',
          let: { requestId: '$trainees.id', status: '$trainees.status' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$requestId'] },
                    { $eq: ['$$status', 'requests'] }, // Match only if status is 'requests'
                  ],
                },
              },
            },
          ],
          as: 'requestDetails',
        },
      },
      {
        $addFields: {
          'trainees.id': {
            $cond: {
              if: { $eq: ['$trainees.status', 'trainees'] },
              then: { $arrayElemAt: ['$traineeDetails', 0] }, // Use populated details from 'trainees'
              else: { $arrayElemAt: ['$requestDetails', 0] }, // Use populated details from 'requests'
            },
          },
        },
      },
      // Direct lookup for certificate details without unwinding
      {
        $lookup: {
          from: 'certificates', // Collection for certificates
          localField: 'certificates.id',
          foreignField: '_id',
          as: 'certificateDetails',
        },
      },
      {
        $addFields: {
          certificates: {
            $map: {
              input: '$certificates',
              as: 'certificate',
              in: {
                $mergeObjects: [
                  '$$certificate',
                  {
                    details: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$certificateDetails',
                            cond: { $eq: ['$$this._id', '$$certificate.id'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          trainerId: { $first: '$trainerId' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          date: { $first: '$date' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          trainees: { $push: '$trainees' }, // Only includes the specific trainee
          certificates: { $first: '$certificates' }, // Use $first to prevent duplication
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          trainerId: 1,
          title: 1,
          description: 1,
          date: 1,
          status: 1,
          trainees: 1,
          certificates: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
