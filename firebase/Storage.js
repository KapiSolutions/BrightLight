import { storage } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const getFileUrlStorage = async (path, fileName) => {
  const imageRef = ref(storage, `${path}/${fileName}`);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    throw error;
  }
};

const uploadFileToStorage = async (file, path) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //! progress bar
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // console.log(progress);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export { getFileUrlStorage, uploadFileToStorage };
