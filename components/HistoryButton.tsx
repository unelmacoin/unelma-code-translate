import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface HistoryButtonProps {
  onSelect: (value: string) => void;
  isDark: boolean;
  onExpand: (value: boolean) => void;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({
  onSelect,
  isDark,
  onExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    const storedHistory = localStorage.getItem('userHistory');
    if (storedHistory) {
      setHistoryList(JSON.parse(storedHistory).reverse());
    } else {
      setHistoryList([]);
    }
  }, []);

  const handleCloseWindow = () => {
    setIsExpanded(false);
    onExpand(isExpanded);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpand(isExpanded);
  };

  const handleClearHistory = () => {
    setHistoryList([]);
    localStorage.removeItem('userHistory');
  };

  const handleMore = () => {
    setItemsToShow((prevItems) => prevItems + 10);
  };
  const handleHistorySelect = (item: string) => {
    onSelect(item);

    setIsExpanded(false);
  };

  return (
    <div>
      <button
        data-testid="history"
        className="text-md flex cursor-pointer items-center space-x-1"
        onClick={handleToggleExpand}
        title="See your code translated history"
      >
        <FaHistory size={32} />
        <p>History</p>
      </button>
      {isExpanded && (
        <ul
          className={`absolute right-0 top-24 z-50 w-full overflow-y-auto overflow-x-hidden p-2 md:mx-2 md:w-80 lg:mx-4 lg:w-96 ${
            isDark ? 'bg-slate-700' : 'bg-white'
          }`}
          style={{ maxHeight: '55rem' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="bold text-3xl">History</h3>
            <button aria-label="close" onClick={handleCloseWindow}>
              <IoClose size={28} />
            </button>
          </div>
          <hr />
          <div className="p-2 text-right">
            <button
              type="reset"
              onClick={handleClearHistory}
              title="Delete all items from your history list"
              className={`rounded p-1 text-xl ${
                isDark ? 'text-blue-100' : 'text-blue-800 hover:bg-gray-200'
              } `}
            >
              Clear history
            </button>
          </div>
          {historyList &&
            historyList.slice(0, itemsToShow).map((item, index) => (
              <li
                key={index}
                onClick={() => handleHistorySelect(item)}
                className="my-2 cursor-pointer"
              >
                {item}
                <hr />
              </li>
            ))}

          {historyList.length > itemsToShow && (
            <div className="p-2 text-center">
              <button
                type="submit"
                onClick={handleMore}
                title="View more items from your history list"
                className={`rounded p-1 text-xl ${
                  isDark ? 'text-blue-100' : 'text-blue-800 hover:bg-gray-200'
                } `}
              >
                See more history
              </button>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default HistoryButton;
