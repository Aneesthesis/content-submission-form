import axios from "axios";
import React, { useEffect, useState, lazy, Suspense } from "react";
import usePagination from "../utils/usePgination";

const ContentCard = lazy(() => import("./ContentCard"));

function PreviewSubmissions() {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchContentList = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/content");
        setContentList(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentList();
  }, []);

  const deleteContentHandler = async (contentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/content/${contentId}`);
      setContentList((prevContentList) =>
        prevContentList.filter((content) => content._id !== contentId)
      );
    } catch (error) {
      console.error("Error deleting content:", error.message);
    }
  };

  const { currentPage, paginate, getPageItems } = usePagination(itemsPerPage);

  const renderLoading = () => (
    <div className="min-h-screen mx-auto my-auto">Loading...</div>
  );

  const renderError = () => (
    <div className="min-h-screen text-red-500">
      Error loading content: {error.message}
    </div>
  );

  const renderContentList = () => (
    <div className="min-h-screen mx-3 my-auto">
      <h1 className="text-3xl font-bold mt-4 mb-8">Preview Submissions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getPageItems(contentList).map((content) => (
          <Suspense key={content._id} fallback={<div>Loading...</div>}>
            <ContentCard
              content={content}
              onDelete={() => deleteContentHandler(content._id)}
            />
          </Suspense>
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="my-4 flex items-center justify-center">
        <div className="mt-4 flex">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mr-2 px-4 py-2 ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-tr from-blue-100 to-green-400"
            } text-white rounded-md w-32`}
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= contentList.length}
            className={`px-4 py-2 ${
              currentPage * itemsPerPage >= contentList.length
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-tr from-blue-100 to-green-400"
            } text-white rounded-md w-32`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return loading
    ? renderLoading()
    : error
    ? renderError()
    : renderContentList();
}

export default PreviewSubmissions;
