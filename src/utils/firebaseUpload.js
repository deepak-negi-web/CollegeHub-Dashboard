import { storage } from "../firebase";

export const firebaseUpload = async (file, path) => {
  if (file) {
    const storagePath = `${path}/${file.name}` || `/${file.name}`;
    const uploadTask = await storage.ref(storagePath).put(file);
    const url = await uploadTask.ref.getDownloadURL();
    return url;
  }
};
