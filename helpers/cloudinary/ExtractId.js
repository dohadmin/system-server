
export const extractCloudinaryID = (url) => {
  const regex = /avatars\/([a-zA-Z0-9-]+)\.jpg/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null; 
}

export const extractCloudinaryIDForCertificates = (url) => {
  const regex = /certificates\/([a-zA-Z0-9-]+)\.jpg/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null; 
}