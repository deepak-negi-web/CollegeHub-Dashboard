import { storage } from "../firebase";

export const firebaseUpload = async (file) => {
  if (file) {
    const uploadTask = await storage.ref(`/${file.name}`).put(file);
    const url = await uploadTask.ref.getDownloadURL();
    return url;
  }
};
