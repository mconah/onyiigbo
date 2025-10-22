import React from 'react';

const InitiateChatModal = ({ isOpen, onClose, onInitiate }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Initiate Chat</h2>
        <p>Are you sure you want to start a new chat?</p>
        <button onClick={onInitiate}>Yes, start chat</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default InitiateChatModal;
