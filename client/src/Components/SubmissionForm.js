import React, { useReducer, useState } from "react";
import axios from "axios";
import { getError } from "../utils/getError";
import { toast } from "react-toastify";
import { uploadFile } from "../utils/storageUtils";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../utils/firebase";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOADING":
      return { ...state, uploading: action.payload };
    case "SUCCESS":
      return { ...state, success: action.payload };
    case "FAILED":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

function SubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    fileLink: "",
  });

  const [state, dispatch] = useReducer(reducer, {
    uploading: false,
    success: null,
    error: null,
  });

  const [errors, setErrors] = useState({});
  const [uploadPerc, setUploadPerc] = useState(0);

  const handleInputChange = (e) => {
    setErrors({});
    if (e.target.name === "file") {
      const selectedFile = e.target.files[0];
      setFormData({ ...formData, file: selectedFile, fileLink: "" });

      handleFileUpload(selectedFile);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.file && !formData.fileLink.trim()) {
      newErrors.file = "Please upload a file or provide a file link";
    }

    setErrors(newErrors);
    console.log(errors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (file) => {
    uploadFile(file, setUploadPerc, formData, setFormData);
  };

  const removeFile = async () => {
    if (formData.file && formData.fileLink) {
      try {
        const fileRef = ref(storage, formData.fileLink);
        await deleteObject(fileRef);
        console.log("File deleted from Firebase");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file from storage");
      }
    }

    setFormData({ ...formData, file: null, fileLink: "" });
    document.getElementById("file").value = "";
    setUploadPerc(0);
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form data:", formData);

      try {
        dispatch({ type: "UPLOADING", payload: true });

        console.log(formData + "WAs logged");
        const { data, status } = await axios.post(
          "https://educraze-api.onrender.com/api/content",
          formData
        );
        if (status === 201) {
          console.log(formData);
          // Reset the form state
          setFormData((prevData) => ({
            ...prevData,
            title: "",
            description: "",
            file: null,
            fileLink: "",
          }));

          console.log(formData, uploadPerc);
          dispatch({ type: "SUCCESS", payload: data.message });
          toast.success("upload successful");
        }
      } catch (error) {
        console.error(getError(error));
        dispatch({ type: "FAILED", payload: error.message });
        toast.error("upload failed");
      } finally {
        dispatch({ type: "UPLOADING", payload: false });
      }
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/hero1.jpg')",
        backgroundSize: "100% 100%",
      }}
    >
      <form
        onSubmit={handleSubmission}
        className="shadow-md rounded-md mx-4 px-4 sm:px-8 pt-6 pb-8 mb-4 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-black bg-gradient-to-t from-blue-100 to-green-300 opacity-95"
      >
        <h1 className="text-2xl font-bold mb-6 text-white">
          Content Submission
        </h1>

        <div className="mb-4">
          <label
            className="block text-gray-600 text-base font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline ${
              errors.title ? "border-red-500" : ""
            }`}
            id="title"
            type="text"
            name="title"
            value={formData.title}
            placeholder="A suitable title..."
          />
          {errors.title && (
            <p className="text-red-500 text-base italic">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-600 text-base font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline resize-none ${
              errors.description ? "border-red-500" : ""
            }`}
            id="description"
            value={formData.description}
            name="description"
            placeholder="A brief description..."
            style={{ maxHeight: "150px" }}
          />
          {errors.description && (
            <p className="text-red-500 text-base italic">
              {errors.description}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-600 text-base font-bold mb-2"
            htmlFor="file"
          >
            Upload File or Provide File Link
          </label>

          <div className="flex items-center">
            <input
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline ${
                errors.file ? "border-red-500" : ""
              }`}
              id="file"
              type="file"
              name="file"
              accept=".pdf, .doc, .docx, .xls, .xlsx, .txt, .jpg, .png, .gif, .ppt, .pptx, .zip, .rar, .tex, video/*"
            />
            {formData.file && (
              <button
                type="button"
                onClick={removeFile}
                className="ml-2 text-base text-red-500 font-bold"
              >
                ✖️
              </button>
            )}
            {uploadPerc > 0 && (
              <span className="text-green-500 text-xm ml-2">
                ({uploadPerc}%)
              </span>
            )}
          </div>
          {errors.file && (
            <p className="text-red-500 text-base italic">{errors.file}</p>
          )}
          <input
            onChange={handleInputChange}
            className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline ${
              errors.fileLink ? "border-red-500" : ""
            }`}
            id="fileLink"
            value={formData.fileLink}
            type="text"
            name="fileLink"
            placeholder="provide a link, instead!"
          />
          {errors.fileLink && (
            <p className="text-red-500 text-base italic">{errors.fileLink}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            disabled={uploadPerc > 0}
            className={`${
              uploadPerc > 0 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            }  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
          >
            {`${state.uploading ? "Uploading..." : "Submit"}`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmissionForm;
