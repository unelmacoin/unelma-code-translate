import React, { useState } from 'react';
import { modalControl } from '@/types/types';
import { Resend } from 'resend';
import axios  from "axios";


const FeedbackForm: React.FC<modalControl> = ({ modal, setModal }) => {
  const [message, setMessage] = useState('');
const url ='https://api.resend.io/v1/emails/send'
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

  const api= process.env.REACT_APP_RESEND;
  console.log(api);
  const resend = new Resend(api);

  console.log(resend)
 

  const handleSubmit = async () => {
try {
      if (message.trim() === '') {
        alert('Please fill out both the name and message fields.');
      } else 
      {
        const msg = {
          from: 'onboarding@resend.dev',
          to: 'dahal.dibya7@gmail.com',
          subject: 'Feedback for UnelmaCodeTranslate',
          html: `<p>${message}</p>`,
        }
        // resend.emails
        //   .send(msg)
        //   .then(
        //     (response) => {
        //       console.log('SUCCESS!');
        //       setModal(false);
        //     },
        //     (err) => {
        //       console.log('FAILED...', err);
        //     },
        //   );

          const response = await axios.post(
            url,
            msg,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${api}`, // Include the API key in the Authorization header
              },
            }
          );
          setModal(false);
        console.log('response', response);
        alert('Thank you for your feedback!');
        setMessage('');
      }
} catch (error:any) {
  console.log(error)
}
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className=" feedback-form absolute z-20 flex min-h-screen min-w-full items-center justify-center bg-[#0E1117] bg-opacity-50 p-4">
      <div className="fixed right-0 top-0 flex h-screen w-auto transform flex-col gap-6 bg-white p-8 text-neutral-200 shadow-lg">
        <button
          onClick={closeModal}
          className="self-end text-xl font-bold leading-none text-black shadow-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-none active:bg-gray-300 active:shadow-inner"
        >
          X
        </button>

        <h1 className="text-2xl font-bold text-[#0E1117]">
          Send feedback to{' '}
          <a
            className=" text-blue-500"
            target="_blank"
            href="https://u16p.com/"
          >
            U16P
          </a>
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
            className="text-s mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-black "
          />
        </div>
        <div className=" w-96 text-black">
          We will use it to fix problems and improve our services, subject to
          our{' '}
          <a
            className=" text-blue-500"
            target="_blank"
            href="https://unelma.io/pages/privacy-policy"
          >
            privacy policy
          </a>{' '}
          and{' '}
          <a
            className=" text-blue-500"
            target="_blank"
            href="https://unelma.io/pages/terms-of-service"
          >
            Terms and Services
          </a>
          . We may email you for more information or updates.
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-md bg-[#0E1117] px-4 py-2 text-lg font-semibold text-white hover:bg-gray-600 focus:outline-none"
        >
          Submit
        </button>

        <button>
          {' '}
          <a href="mailto:dahal.dibya7@gmail.com">Send Email</a>
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
