import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { modalControl } from '@/types/types';


const FeedbackForm: React.FC<modalControl> = ({modal, setModal}) => {
emailjs.init("Y8Uhbou9I9l2yDoUh");
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const templateParams ={
    user:name,
    message:message,
    reply_to:"dahal.dibya7@gmail.com"

  }

  const handleSubmit = () => {
    if (name.trim() === '' || message.trim() === '') {
      alert('Please fill out both the name and message fields.');
    } else {
        emailjs.send('service_poz1s4s','template_ogcro9v', templateParams)
        .then((response) => {
           console.log('SUCCESS!', response.status, response.text);
           setModal(false);
        }, (err) => {
           console.log('FAILED...', err);
           
        });

      console.log(`Name: ${name}`);
      console.log(`Message: ${message}`);
      alert('Thank you for your feedback!');
      setName('');
      setMessage('');
    }
  };

 const closeModal= () => {
    setModal(false);
  };

  return (
    <div className=" z-20 feedback-form min-h-screen min-w-full flex items-center justify-center bg-[#0E1117] bg-opacity-50 absolute p-4">
    <div className="fixed top-0 right-0 transform h-screen w-auto flex flex-col gap-6 p-8 rounded-lg bg-white text-neutral-200 shadow-lg">
    <button
  onClick={closeModal}
  className="self-end text-black text-xl font-bold leading-none focus:outline-none shadow-lg hover:bg-gray-200 hover:text-gray-800 active:bg-gray-300 active:shadow-inner"
>
  X
</button>

      <h1 className="text-2xl text-[#0E1117] font-bold">Send feedback to Unelma Platforms</h1>
      <div>
        <label htmlFor="name" className="block text-[#0E1117] text-lg">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 mt-2 border text-black border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-[#0E1117] text-lg">
          Message
        </label>
        <textarea
          id="message"
          rows={12}
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter your message here"
          className="w-full px-4 py-2 mt-2 border text-black border-gray-300 rounded-md "
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 mt-4 text-lg font-semibold text-white bg-[#0E1117] rounded-md hover:bg-gray-600 focus:outline-none"
      >
        Submit
      </button>
    </div>
    </div>

  );
};

export default FeedbackForm;
