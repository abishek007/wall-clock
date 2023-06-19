// Library Imports
import React, { useState, useEffect } from "react";

// Constants Imports
import {
  TIME_INPUT_PLACEHOLDER,
  MINUTE_HAND_ID,
  SECOND_HAND_ID,
} from "../constants";

// Style Imports
import "./styles.css";

const Clock = () => {
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  const [isDraggingSecond, setIsDraggingSecond] = useState(false);
  const [timeInput, setTimeInput] = useState("");

  useEffect(() => {
    const interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setTimeInput(formatTime(minute, second));
  }, [minute, second]);

  const handleMouseDownMinute = () => {
    setIsDraggingMinute(true);
  };

  const handleMouseDownSecond = () => {
    setIsDraggingSecond(true);
  };

  const handleMouseUp = () => {
    setIsDraggingMinute(false);
    setIsDraggingSecond(false);
    setTimeInput(formatTime(minute, second));
  };

  const handleMouseMove = (event) => {
    if (isDraggingMinute) {
      const minutePosition = getMousePosition(event, MINUTE_HAND_ID);
      const newMinute = calculateTime(minutePosition, 60);
      setMinute(newMinute);
      setTimeInput(formatTime(newMinute, second));
    } else if (isDraggingSecond) {
      const secondPosition = getMousePosition(event, SECOND_HAND_ID);
      const newSecond = calculateTime(secondPosition, 60);
      setSecond(newSecond);
      setTimeInput(formatTime(minute, newSecond));
    }
  };

  const handleTimeInputChange = (event) => {
    setTimeInput(event.target.value);
  };

  const handleTimeInputEnter = (event) => {
    if (event.key === "Enter") {
      const [newMinute, newSecond] = parseTimeInput(timeInput);
      setMinute(newMinute);
      setSecond(newSecond);
    }
  };

  const getMousePosition = (event, handId) => {
    const handElement = document.getElementById(handId);
    const rect = handElement.getBoundingClientRect();
    const elementX = event.clientX - rect.left;
    const elementY = event.clientY - rect.top;
    return { x: elementX, y: elementY };
  };

  const calculateTime = (position, maxTime) => {
    const angle = Math.atan2(position.y, position.x);
    let time = Math.round((((angle * 180) / Math.PI + 180) * maxTime) / 360);
    time = time < 0 ? 0 : time > maxTime ? maxTime : time;
    return time;
  };

  const formatTime = (minutes, seconds) => {
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const parseTimeInput = (input) => {
    const [minutes, seconds] = input.split(":");
    return [parseInt(minutes), parseInt(seconds)];
  };

  const tick = () => {
    setSecond((prevSecond) => {
      let newSecond = prevSecond + 1;
      if (newSecond >= 60) {
        newSecond = 0;
        setMinute((prevMinute) => (prevMinute + 1) % 60);
      }
      return newSecond;
    });
  };

  return (
    <div className="clock-container">
      <div
        className="clock"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          id={MINUTE_HAND_ID}
          style={{
            transform: `rotate(${minute * 6}deg)`,
          }}
          onMouseDown={handleMouseDownMinute}
        ></div>
        <div
          id={SECOND_HAND_ID}
          style={{
            transform: `rotate(${second * 6}deg)`,
          }}
          onMouseDown={handleMouseDownSecond}
        ></div>
      </div>

      <div className="input-wrapper">
        <input
          className="field"
          type="text"
          value={timeInput}
          placeholder={TIME_INPUT_PLACEHOLDER}
          onChange={handleTimeInputChange}
          onKeyUp={handleTimeInputEnter}
        />
      </div>
    </div>
  );
};

export default Clock;
