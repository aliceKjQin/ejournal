
export default function Pagination({ prevDate, nextDate, onPageChange }) {
  return (
    <div className="flex justify-between mt-4">
      <button 
        onClick={() => onPageChange(prevDate)} 
        disabled={!prevDate}
        className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
      >
        Previous
      </button>
      <button 
        onClick={() => onPageChange(new Date().toISOString().split('T')[0])} 
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Today
      </button>
      <button 
        onClick={() => onPageChange(nextDate)} 
        disabled={!nextDate}
        className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
