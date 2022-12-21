import { storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";

const getFileUrlStorage = async (path, fileName) => {
  const imageRef = ref(storage, `${path}/${fileName}`);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    throw error;
  }
};

export { getFileUrlStorage };
