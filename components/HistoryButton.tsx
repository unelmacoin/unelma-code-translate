import React, { useState } from "react";
import { FaHistory, FaAngleUp, FaAngleDown } from "react-icons/fa";

interface HistoryButtonProps {
  onSave: () => void;
  history: string[];
  onSelect: (value: string) => void;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onSave, history, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <button className="flex items-center text-md cursor-pointer" onClick={handleToggleExpand}>
        <FaHistory size={32} />
        History
        {isExpanded ? "" : ""}
      </button>
      {isExpanded && (
        <ul className="absolute top-24 right-12 w-72 h-4/5 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          {history.map((item, index) => (
            <li key={index} onClick={() => onSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryButton;
