import React, { useReducer, useState } from "react";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOADING":
      return { ...state, uploading: action.payload };
    case "SUCCESS":
      return { ...state, success: action.payload };
    case "FAILED":
      return { ...state, error: action.payload };
  }
};

function SubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: "",
    fileLink: "",
  });

  const [state, dispatch] = useReducer(reducer, {
    uploading: false,
    success: null,
    error: null,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setErrors({});
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0], fileLink: "" });
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

  const uploadHandler = async (e) => {
    const url = `https://api.cloudinary.com/v1_1/dbenvvfuy/upload`;
    try {
      const {
        data: { signature, timestamp, api_key },
      } = await axios(`http://localhost:8000/api/cloudinary-sign`);

      const file = formData.file;
      const linkFormData = new FormData();
      linkFormData.append("file", file);
      linkFormData.append("signature", signature);
      linkFormData.append("api_key", api_key);
      linkFormData.append("timestamp", timestamp);
      const { data } = await axios.post(url, linkFormData);

      setFormData((prevData) => {
        return { ...prevData, file: data.secure_url };
      });
      console.log("File uploaded!", formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // const formDataToSend = new FormData();
      // formDataToSend.append("title", formData.title);
      // formDataToSend.append("description", formData.description);
      // formDataToSend.append("fileLink", formData.fileLink);
      // formDataToSend.append("file", formData.file);

      console.log("Form data:", formData);

      try {
        dispatch({ type: "UPLOADING", payload: true });
        if (formData.file) {
          await uploadHandler();
        }

        console.log("sending.." + formData.file);
        const { data, status } = await axios.post(
          "http://localhost:8000/api/submit-content",
          formData
        );
        if (status === 201)
          dispatch({ type: "SUCCESS", payload: data.message });
      } catch (error) {
        console.error(error);
        dispatch({ type: "FAILED", payload: error.message });
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
        className="shadow-md rounded-md mx-4 px-4 sm:px-8 pt-6 pb-8 mb-4 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-white bg-gradient-to-t from-green-800 to-blue-300 opacity-95"
      >
        <h1 className="text-2xl font-bold mb-6">Content Submission</h1>

        <div className="mb-4">
          <label
            className="block text-gray-300 text-base font-bold mb-2"
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
            placeholder="Give your content a catchy title"
          />
          {errors.title && (
            <p className="text-red-500 text-base italic">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-300 text-base font-bold mb-2"
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
            name="description"
            placeholder="Describe it here"
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
            className="block text-gray-300 text-base font-bold mb-2"
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
              accept=".pdf, .doc, .docx, .xls, .xlsx, .txt, .jpg, .png, .gif, .ppt, .pptx, .zip, .rar, .tex"
            />
            <span className="ml-2 text-base">(or)</span>
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
            type="text"
            name="fileLink"
            placeholder="Provide a link to the file"
          />
          {errors.fileLink && (
            <p className="text-red-500 text-base italic">{errors.fileLink}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {state.uploading ? "uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmissionForm;
