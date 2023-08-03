import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { modalControl } from '@/types/types';
import { Resend } from 'resend';

const FeedbackForm: React.FC<modalControl> = ({ modal, setModal }) => {
  emailjs.init('Y8Uhbou9I9l2yDoUh');
  const [message, setMessage] = useState('');

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

  const resend = new Resend('re_fW8PMU8C_LVzhiEmBDYEXGeJ2o7DBdztM');

  const handleSubmit = () => {
    if (message.trim() === '') {
      alert('Please fill out both the name and message fields.');
    } else {
      resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'dahal.dibya7@gmail.com',
        subject: 'Hello World',
        html: '<p>Congrats on sending  2nd your <strong>first email</strong>!</p>'
      }).then(
        (response) => {
          console.log('SUCCESS!');
          setModal(false);
        },
        (err) => {
          console.log('FAILED...', err);
        },
      );
      console.log(`Message: ${message}`);
      alert('Thank you for your feedback!');
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
          Send feedback to <a className=' text-blue-500' target="_blank" href="https://u16p.com/">U16P</a>
        </h1>
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
            className="mt-2 w-full rounded-md border text-s border-gray-300 px-4 py-2 text-black "
          />
        </div>
        <div className=' w-96 text-black'>We will use it to fix problems and improve our services, subject to our Privacy Policy and Terms of Service. We may email you for more information or updates.</div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-md bg-[#0E1117] px-4 py-2 text-lg font-semibold text-white hover:bg-gray-600 focus:outline-none"
        >
          Submit
        </button>

        <button> <a href="mailto:dahal.dibya7@gmail.com">Send Email</a>
</button>
      </div>
    </div>
  );
};

export default FeedbackForm;
