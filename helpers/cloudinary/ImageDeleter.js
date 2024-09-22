import cloudinary from "../../clients/CloudinaryClient.js";

export const imageDeleter = async (
  folder, 
  fileName,
) => {
  const cloudinaryResponse = await cloudinary.api.delete_resources([`${folder}/${fileName}`]);
  return cloudinaryResponse;
}

