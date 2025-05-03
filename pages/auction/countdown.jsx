// Countdown.jsx
import { useState, useEffect } from "react";

export default function Countdown({ endTime, serverTime }) {
  const [timeLeft, setTimeLeft] = useState(0);

  // Use serverTime for the initial calculation
  useEffect(() => {
    const initialDiff =
      new Date(endTime).getTime() - new Date(serverTime).getTime();
    setTimeLeft(initialDiff > 0 ? initialDiff : 0);
  }, [endTime, serverTime]);

  useEffect(() => {
    const endTimestamp = new Date(endTime).getTime();

    // Function to recalc remaining time using absolute current time
    const updateTimer = () => {
      const now = Date.now();
      const newDiff = endTimestamp - now;
      setTimeLeft(newDiff > 0 ? newDiff : 0);
    };

    // Run immediately to sync
    updateTimer();

    // Set up the interval to update every second
    const intervalId = setInterval(() => {
      updateTimer();
    }, 1000);

    // When window gains focus, immediately recalc time
    const handleFocus = () => {
      updateTimer();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [endTime]);

  // Convert timeLeft (ms) to HH:MM:SS
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const formattedTime =
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;

  return <p>Time left: {formattedTime}</p>;
}
