import React, { useState, useRef } from 'react';
import { Button } from '@material-ui/core';

const LongPressButton = ({
  onLongPress,
  onLongPressEnd,
  children,
  onClick,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef(null);

  const handleMouseDown = () => {
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      onLongPress();
    }, 300); // Long press duration (500ms)
  };

  const handleMouseUp = () => {
    if (!isPressing) return
    clearTimeout(timerRef.current);
    setIsPressing(false);
    onLongPressEnd();
  };

  const handleMouseLeave = () => {
    if (!isPressing) return 
    clearTimeout(timerRef.current);
    setIsPressing(false);
    onLongPressEnd();
    if (isPressing) {
      clearTimeout(timerRef.current);
      setIsPressing(false);
      onLongPressEnd();
    }
  };

  return (
    <Button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      variant='text'
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default LongPressButton;

