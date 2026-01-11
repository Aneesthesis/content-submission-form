import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../utils/firebase";

export const uploadFile = async (
  file,
  setUploadPerc,
  formData,
  setFormData
) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, "content-submissions/" + fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadPerc(Math.round(progress));
      console.log("Upload is " + progress + "% done");

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          break;
      }
    },
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        setFormData((prevData) => ({
          ...prevData,
          file: downloadURL,
        }));
        setUploadPerc(0);
        console.log("File uploaded!", formData);
      });
    }
  );
};
