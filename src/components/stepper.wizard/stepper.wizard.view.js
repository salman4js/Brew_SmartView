import React, { useState } from 'react';
import './stepper.wizard.view.css';

function StepperWizard() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="stepper-wizard">
      <button onClick={openModal}>Open Modal</button>
      {modalOpen && (
        <div className="overlay">
          <div className="stepper-wizard-content">
            <span className="close">&times;</span>
            <h2>Modal Content</h2>
            <p>This is the content of the modal.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StepperWizard;
