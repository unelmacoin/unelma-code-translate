import React, { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface HistoryButtonProps {
  onSelect: (value: string) => void;
  isDark: boolean;
  onExpand: () => void;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onSelect, isDark, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    const storedHistory = localStorage.getItem("userHistory");
    if (storedHistory) {
      setHistoryList(JSON.parse(storedHistory).reverse());
    } else {
      setHistoryList([]); 
    }
  }, []);

  const handleCloseWindow = () => {
    setIsExpanded(false)
    onExpand();
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpand();
  };

  const handleClearHistory = () => {
    setHistoryList([]);
    localStorage.removeItem("textInput");
  };

  const handleMore = () =>{
  setItemsToShow((prevItems) => prevItems +10)
  }

  return (
    <div>
      <button data-testid="history" className="flex items-center text-md cursor-pointer" onClick={handleToggleExpand} title="See your code translated history">
        <FaHistory size={32}/>
        History
      </button>
      {isExpanded && (
        <ul className={`absolute top-24 z-50 lg:mx-4 md:mx-2 right-0 w-full md:w-80 lg:w-96 p-2 overflow-y-auto overflow-x-hidden ${isDark ? 'bg-slate-700' : 'bg-white'}`} style={{maxHeight:'55rem'}}>
          <div className="flex justify-between items-center">
          <h3 className="text-3xl bold">History</h3>
          <button aria-label="close" onClick={handleCloseWindow}>
            <IoClose size={28} />
          </button>
          </div>
          <hr/>
          <div className="p-2 text-right">
          <button type="reset" onClick={handleClearHistory} title="Delete all items from your history list" className={`p-1 text-xl rounded ${isDark ? 'text-blue-100':'text-blue-800 hover:bg-gray-200' } `}>Clear history</button>
          </div>
          {historyList && historyList.slice(0, itemsToShow).map((item, index) => (
            <li key={index} onClick={() => onSelect(item)} className="my-2 cursor-pointer">
              {item}
              <hr />
            </li>
          ))}
          
          {historyList.length > itemsToShow && (
          <div className="p-2 text-center">
          <button type="submit" onClick={handleMore} title="View more items from your history list" className={`p-1 text-xl rounded ${isDark ? 'text-blue-100':'text-blue-800 hover:bg-gray-200' } `}>See more history</button>
          </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default HistoryButton;
