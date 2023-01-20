import { storage } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject, listAll } from "firebase/storage";

const getFileUrlStorage = async (path, fileName) => {
  const imageRef = ref(storage, `${path}/${fileName}`);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    throw error;
  }
};

const deleteFilesInDirStorage = async (dir) => {
  const listRef = ref(storage, dir);
  listAll(listRef)
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach(async (itemRef) => {
        // All the items under listRef.
        // console.log(itemRef._location.path_)
        const fileRef = ref(storage, itemRef._location.path_);
        await deleteObject(fileRef);
      });
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });

  // const fileRef = ref(storage, `${path}/${fileName}`);
  // try {
  //   const res = await deleteObject(imageRef);
  //   return res;
  // } catch (error) {
  //   throw error;
  // }
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

export { getFileUrlStorage, deleteFilesInDirStorage, uploadFileToStorage };
