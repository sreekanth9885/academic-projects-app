interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const MAX_VISIBLE = 5;

  const getPages = () => {
    const pages: (number | "...")[] = [];

    const half = Math.floor(MAX_VISIBLE / 2);
    let start = Math.max(2, page - half);
    let end = Math.min(totalPages - 1, page + half);

    // Adjust window if near edges
    if (page <= half + 2) {
      start = 2;
      end = Math.min(totalPages - 1, MAX_VISIBLE + 1);
    }

    if (page >= totalPages - (half + 1)) {
      end = totalPages - 1;
      start = Math.max(2, totalPages - MAX_VISIBLE);
    }

    // First page
    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    // Last page (only if different)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };


  const pages = getPages();

  return (
    <div className="px-6 py-4 bg-gray-50 border-t">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* First */}
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer"
          >
            «
          </button>

          {/* Previous */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer"
          >
            ‹
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p)}
                className={`px-3 py-2 border rounded transition cursor-pointer ${p === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            )
          )}


          {/* Next */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer"
          >
            ›
          </button>

          {/* Last */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
