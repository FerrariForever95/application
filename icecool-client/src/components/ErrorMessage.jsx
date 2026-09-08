import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-message">
        <p>{message}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;