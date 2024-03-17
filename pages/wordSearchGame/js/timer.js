let countdownInterval = null;

function countdownTimer(seconds, callback) {
  let currentSeconds = seconds;
  stopCountdownTimer();
  countdownInterval = setInterval(function () {
    document.querySelector("#timer").innerText = `0:${currentSeconds}`;
    if (currentSeconds === 0) {
      stopCountdownTimer(); // Stop the timer when it reaches 0
      if (typeof callback === "function") {
        callback();
      }
    } else {
      currentSeconds--;
    }
  }, 1000);
}

function stopCountdownTimer() {
  if (countdownInterval) {
    // console.log(
    //   `Your time is: ${
    //     config.timer.duration -
    //     Number(document.querySelector("#timer").innerText)
    //   }`
    // );
    clearInterval(countdownInterval);
    countdownInterval = null; // Reset the interval variable
  }
}
