import React from 'react';
import './ToggleBtn.css';

const ToggleBtn = ({ leftValue, RightValue, currentValue, handleToggle }) => {
  const handleToggleChange = () => {
    if (currentValue === leftValue) {
      handleToggle(RightValue);
    } else if (currentValue === RightValue) {
      handleToggle(leftValue);
    }
  };

  return (
    <div className="toggle-btn" onClick={handleToggleChange}>
      <div
        className="btn-circle"
        style={{
          transform: `translateX(${currentValue === leftValue ? '0.25rem' : '2.15rem'})`,
        }}
      />
    </div>
  );
};

export default ToggleBtn;
