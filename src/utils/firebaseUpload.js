import { storage } from "../firebase";
export const firebaseUpload = async (file) => {
  let uploadedUrl = "";
  if (file) {
    const uploadTask = storage.ref(`/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            uploadedUrl = url;
          });
      }
    );
  }
  return uploadedUrl;
};
