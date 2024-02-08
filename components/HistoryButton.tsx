import React, { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";

interface HistoryButtonProps {
  onSave: () => void;
  history: string[];
  onSelect: (value: string) => void;
  isDark: boolean;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onSave, history, onSelect, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyList, setHistoryList] = useState<string[]>(history);
  const [historyCleared, setHistoryCleared] = useState<boolean>(false);

  useEffect(() => {
    if (!historyCleared) {
      setHistoryList(history);
    }
  }, [history, historyCleared]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    onSave();
  };

  const handleClearHistory = () => {
    setHistoryList([]);
    setHistoryCleared(true);
  };

  return (
    <div>
      <button className="flex items-center text-md cursor-pointer" onClick={handleToggleExpand}>
        <FaHistory size={32} />
        History
        {isExpanded ? "" : ""}
      </button>
      {isExpanded && (
        <ul className={`absolute top-24 right-0 w-72 p-1 h-fit max-h-4/5 overflow-y-auto ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
          <h3 className="text-3xl bold">History</h3>
          <hr/>
          <button type="reset" onClick={handleClearHistory}>Clear history</button>
          <hr className="mb-5"/>
          {historyList.slice().reverse().map((item, index) => (
            <li key={index} onClick={() => onSelect(item)} className="my-2 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryButton;
