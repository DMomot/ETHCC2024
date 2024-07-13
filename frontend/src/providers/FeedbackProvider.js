import React, { createContext, useCallback, useEffect, useState } from "react";

export const FeedbackContext = createContext();

const FeedbackProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(null);
  const [successMessage, setSuccessMesage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  useEffect(() => {
    if (typeof showError === "boolean" && !showError) {
      setTimeout(() => setError(null), 500);
    }
  }, [showError]);

  useEffect(() => {
    if (!showSuccessMessage) {
      setTimeout(() => setSuccessMesage(null), 500);
    }
  }, [showSuccessMessage]);

  const handleSetError = useCallback((error) => {
    setError(error);
    setShowError(true);
  }, []);

  const handleSetSuccessMesage = useCallback((message) => {
    setSuccessMesage(message);
    setShowSuccessMessage(true);
  }, []);

  return (
    <FeedbackContext.Provider
      value={{
        error,
        setError: handleSetError,
        setShowError,
        showError,
        successMessage,
        showSuccessMessage,
        setShowSuccessMessage,
        setSuccessMesage: handleSetSuccessMesage,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;
