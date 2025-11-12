import React from "react";
import styled from "styled-components";

const RadioOption = ({ opciones, selectedOption, onChange }) => {
    return (
        <StyledWrapper>
            <div
                className=" p-[5px] z-10 radio-inputs shadow-lg bg-gradient-to-t from-[#ffffff] to-[#f1f1f181]  "
            >
                {opciones?.map((option) => (
                    <label key={option} className="radio">
                        <input
                            type="radio"
                            name="radio"
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => onChange(option)}
                        />
                        <span className="name">{option}</span>
                    </label>
                ))}
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    min-width: 600px;
    font-size: 18px;
    font-weight: 600;
  }

  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
  }

  .radio-inputs .radio input {
    display: none;
  }

  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 1rem;
    color: rgba(51, 65, 85, 1);
    transition: all 0.15s ease-in-out;
  }

  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    animation: select 0.3s ease;
  }

  @keyframes select {
    0% {
      transform: scale(0.95);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  .radio-inputs .radio:hover .name {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .radio-inputs .radio input:checked + .name::before,
  .radio-inputs .radio input:checked + .name::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #3b82f6;
    opacity: 0;
    animation: particles 0.5s ease forwards;
  }

  .radio-inputs .radio input:checked + .name::before {
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    --direction: -10px;
  }

  .radio-inputs .radio input:checked + .name::after {
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    --direction: 10px;
  }

  @keyframes particles {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(var(--direction));
    }
  }
`;

export default RadioOption;
