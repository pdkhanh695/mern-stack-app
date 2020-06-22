import React from "react";

const PostPagination = ({ page, setPage, postCount }) => {
  let totalPages;
  const pagination = () => {
    const totalPages = Math.ceil(postCount && postCount.totalPosts / 3);
    if (totalPages > 10) totalPages = 10;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li>
          <a
            className={`page-link ${page === i && "activePagination"}`}
            onClick={() => setPage(i)}
          >
            {i}
          </a>
        </li>
      );
    }
    return pages;
  };
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li>
          <a
            className={`page-link ${
              page === 1 && "disabled"
            } && "activePagination"`}
            onClick={() => setPage(1)}
          >
            Prev
          </a>
        </li>
        {pagination()}
        <li>
          <a
            className={`page-link ${page === totalPages && "disabled"}`}
            onClick={() => setPage(totalPages)}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};
export default PostPagination;
