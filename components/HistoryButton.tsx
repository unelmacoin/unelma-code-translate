import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";

interface HistoryButtonProps {
  onSave: () => void;
  history: string[];
  onSelect: (value: string) => void;
  isDark: boolean;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onSave, history, onSelect, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    onSave()
  };

  return (
    <div>
      <button className="flex items-center text-md cursor-pointer" onClick={handleToggleExpand}>
        <FaHistory size={32} />
        History
        {isExpanded ? "" : ""}
      </button>
      {isExpanded && (
        <ul className={`absolute top-24 right-0 w-72 p-1 h-fit max-h-4/5 overflow-y-auto cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
          {history.slice().reverse().map((item, index) => (
            <li key={index} onClick={() => onSelect(item)} className="my-1">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryButton;
