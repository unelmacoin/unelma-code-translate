import React from 'react';
import swal from 'sweetAlert';

const SweetAlert: React.FC = () => {
  const showAlert = () => {
    swal('Sweet Alert!');
  };

  return (
    <div>
      <button onClick={showAlert}>SweetAlert</button>
    </div>
  );
};

export default SweetAlert;
