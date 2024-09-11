import React from 'react';
import Swal from 'sweetalert2';

const SweetAlert: React.FC = () => {
  const showAlert = () => {
    Swal.fire({
      title: 'Sweet Alert',
      text: 'Sweet Alert',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  };

  return (
    <div
      className="alert-container"
      style={{ padding: '20px', textAlign: 'center', color: 'blueviolet' }}
    >
      <button onClick={showAlert}>Sweet Alert</button>
    </div>
  );
};
export default SweetAlert;
