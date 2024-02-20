import React, { useState, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import emailjs from 'emailjs-com';


export const Feedback:React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [feedbackText, setFeedbackText] = useState<string>("");
  const form = useRef<HTMLFormElement>(null);


  const toggleFeedback = () => {
    setExpanded(!expanded)
  }

  const cancelFeedback = () => {
    setExpanded(false);
  }

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(event.target.value);
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.current) return;

    emailjs
      .sendForm('service_mai5ktn', 'template_lqoosbe', form.current as HTMLFormElement, "0ycIWwkNnjNTE7IhX")
      .then(
        () => {
          alert('Your feedback sent successfully!'); 
          setFeedbackText(" ")
        },
        () => {
          alert('Feedback sending failed:');
        },
      );
  };



  return (
    <div>
      {expanded && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50"></div>
          <div className="absolute top-20 right-0 flex justify-end items-start p-4 z-50">
            <div className="w-80 bg-white p-4 rounded shadow">
              <form ref={form} onSubmit={sendEmail}>
              <div className="flex justify-between text-black">
                <h3 className="text-lg font-semibold">Send feedback to Unelma Platforms</h3>
                <IoClose onClick={cancelFeedback} size={24} />
              </div>
              <textarea
                placeholder="Tell us what prompted this feedback…"
                maxLength={2500}
                value={feedbackText}
                name="message"
                onChange={handleFeedbackChange}
                className="w-full h-64 p-2 border border-gray-300 rounded resize-none text-black"
              required
              />
              <div className="flex justify-end mt-2">
                <button type='submit' className="px-4 py-2 bg-black text-white rounded hover:bg-blue-600">
                  Send
                </button>
              </div>
              </form>
            </div>
          </div>
        </>
      )}
      <div className="flex justify-end hover:underline">
        <button onClick={toggleFeedback} className='italic text-sm'>
          Send Feedback
        </button>
      </div>
    </div>
  )
}
