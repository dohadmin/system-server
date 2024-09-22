import cloudinary from "../../clients/CloudinaryClient.js";

export const imageUploader = async (
  buffer, 
  mimetype, 
  folder, 
  fileName,
  width, 
  height
) => {

  const b64 = Buffer.from(buffer).toString("base64");
  let dataURL = "data:" + mimetype + ";base64," + b64;
  const cloudinaryResponse = await cloudinary.uploader
  .upload(dataURL, {
    folder: folder,
    resource_type: 'image',
    public_id: fileName,
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' },
      { width: width, height: height, crop: 'fill'},
    ],
  })

  return cloudinaryResponse;
}

