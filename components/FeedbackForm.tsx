import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { modalControl } from '@/types/types';

const FeedbackForm: React.FC<modalControl> = ({ modal, setModal }) => {
  emailjs.init('Y8Uhbou9I9l2yDoUh');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

  const templateParams = {
    user: name,
    message: message,
    reply_to: 'dahal.dibya7@gmail.com',
  };

  const handleSubmit = () => {
    if (name.trim() === '' || message.trim() === '') {
      alert('Please fill out both the name and message fields.');
    } else {
      emailjs.send('service_poz1s4s', 'template_ogcro9v', templateParams).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setModal(false);
        },
        (err) => {
          console.log('FAILED...', err);
        },
      );

      console.log(`Name: ${name}`);
      console.log(`Message: ${message}`);
      alert('Thank you for your feedback!');
      setName('');
      setMessage('');
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className=" feedback-form absolute z-20 flex min-h-screen min-w-full items-center justify-center bg-[#0E1117] bg-opacity-50 p-4">
      <div className="fixed right-0 top-0 flex h-screen w-auto transform flex-col gap-6 rounded-lg bg-white p-8 text-neutral-200 shadow-lg">
        <button
          onClick={closeModal}
          className="self-end text-xl font-bold leading-none text-black shadow-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-none active:bg-gray-300 active:shadow-inner"
        >
          X
        </button>

        <h1 className="text-2xl font-bold text-[#0E1117]">
          Send feedback to Unelma Platforms
        </h1>
        <div>
          <label htmlFor="name" className="block text-lg text-[#0E1117]">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-black"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-lg text-[#0E1117]">
          Tell us what prompted this feedback
          </label>
          <textarea
            id="message"
            rows={12}
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message here"
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-black "
          />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-md bg-[#0E1117] px-4 py-2 text-lg font-semibold text-white hover:bg-gray-600 focus:outline-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
