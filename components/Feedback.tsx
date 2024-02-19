import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";

export const Feedback:React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const toggleFeedback = () => {
    setExpanded(!expanded)
  }

  const cancelFeedback = () => {
    setExpanded(false);
  }

  return (
    <div>
      {expanded && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50"></div>
          <div className="fixed top-20 right-0 flex justify-end items-start p-4 z-50">
            <div className="w-80 bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">Send feedback to Unelma Platforms</h3>
                <IoClose onClick={cancelFeedback} size={24} />
              </div>
              <textarea
                placeholder="Tell us what prompted this feedback…"
                maxLength={2500}
                className="w-full h-64 p-2 border border-gray-300 rounded resize-none"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className=" flex justify-end hover:underline italic">
        <button onClick={toggleFeedback}>
          Send Feedback
        </button>
      </div>
    </div>
  )
}
