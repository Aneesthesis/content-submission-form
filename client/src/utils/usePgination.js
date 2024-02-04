import { useState } from "react";

const usePagination = (itemsPerPage, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginate = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPageItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  return { currentPage, paginate, getPageItems };
};

export default usePagination;
