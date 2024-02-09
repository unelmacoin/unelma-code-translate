import React, { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";

interface HistoryButtonProps {
  onSelect: (value: string) => void;
  isDark: boolean;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onSelect, isDark }) => {
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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
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
      <button className="flex items-center text-md cursor-pointer" onClick={handleToggleExpand} title="See your code translated history">
        <FaHistory size={32}/>
        History
        {isExpanded ? "" : ""}
      </button>
      {isExpanded && (
        <ul className={`absolute top-24 right-0 w-72 p-1 overflow-y-auto ${isDark ? 'bg-slate-700' : 'bg-white'}`} style={{maxHeight:'80vh'}}>
          <h3 className="text-3xl bold">History</h3>
          <hr/>
          <button type="reset" onClick={handleClearHistory}>Clear history</button>
          <hr className="mb-5"/>
          {historyList && historyList.slice(0, itemsToShow).map((item, index) => (
            <li key={index} onClick={() => onSelect(item)} className="my-2 cursor-pointer">
              {item}
            </li>
          ))}
          {historyList.length > itemsToShow && (
          <>
          <hr className="mt-6"/>
          <button type="submit" onClick={handleMore} className="mb-3" >See more history</button>
          </>
          )}
        </ul>
      )}
    </div>
  );
};

export default HistoryButton;
