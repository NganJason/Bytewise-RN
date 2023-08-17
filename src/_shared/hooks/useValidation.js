import { useState } from 'react';

const useValidation = () => {
  const [showValidation, setShowValidation] = useState(false);
  const [timerID, setTimerID] = useState(0);

  const validate = () => {
    clearTimeout(timerID);
    setShowValidation(true);

    let id = setTimeout(() => {
      setShowValidation(false);
    }, 3000);

    setTimerID(id);
  };

  return { validate, showValidation };
};

export default useValidation;
