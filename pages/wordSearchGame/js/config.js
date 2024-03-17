const config = {
  //function to run before game runs return boolean
  validateGamePlay: () => {
    const userDetails = JSON.parse(localStorage.getItem("ws-userDetails"));
    if (userDetails.attemptsBalance === 0) {
      const winLose = document.querySelector("#win-lose");
      const overlay = document.querySelector("#overlay");
      const attemptBalanceDisplay = document.querySelector(".attempts-balance");
      const walletBalanceDisplay = document.querySelector(".wallet-balance");
      const newGameButton = document.querySelector("#newGame");
      overlay.style.display = "block";
      winLose.innerText = `You have no attempts left `;
      attemptBalanceDisplay.innerText = `You have ${userDetails.attemptsBalance} attempts left`;
      walletBalanceDisplay.innerText = `Your wallet balance is ₦${userDetails.walletBalance}`;
      newGameButton.style.display = "none";
      return false;
    }
    return true;
  },
  board: {
    boardSize: 9,
    rows: 8,
    columns: 10, //this value has to be greater than or equal to the number of rows
    initGridStyling: function (gridContainerId) {
      const gridContainer = document.querySelector(gridContainerId);
      gridContainer.style.setProperty("--gridColumnSize", `${this.columns}`);
      gridContainer.style.setProperty("--gridRowSize", `${this.rows}`);
    },
  },
  gameContainerId: "#grid-container",
  listOfWords: {
    containerId: "#found-words",
    wordLength: 4,
    rowOfWords: 1,
  },
  numberOfWordsToFind: 3,
  showSolution: {
    show: false,
    solveButtonId: "#solveButton",
  },
  newGameButtonId: "#newGame",
  newGameCallback: function () {
    const userDetails = JSON.parse(localStorage.getItem("ws-userDetails"));
    const attemptBalanceDisplay = document.querySelector("#attempts-balance");
    const walletBalanceDisplay = document.querySelector("#wallet-balance");
    attemptBalanceDisplay.innerText = `${userDetails.attemptsBalance}`;
    walletBalanceDisplay.innerText = `₦${userDetails.walletBalance}`;
    const overlay = document.querySelector("#overlay");
    overlay.style.display = "none";
  },
  instructionsId: "instructions",
  themeId: "#wordTheme",
  timer: {
    duration: 15,
    containerId: "#timer",
    timerCallback: function () {
      const winLose = document.querySelector("#win-lose");
      const overlay = document.querySelector("#overlay");
      const attemptBalanceDisplay = document.querySelector(".attempts-balance");
      const walletBalanceDisplay = document.querySelector(".wallet-balance");
      const newGameButton = document.querySelector("#newGame");
      const userDetails = JSON.parse(localStorage.getItem("ws-userDetails"));
      if (
        userDetails.attemptsBalance === 0 ||
        userDetails.attemptsBalance - 1 === 0
      ) {
        if (userDetails.attemptsBalance - 1 === 0) {
          localStorage.setItem(
            "ws-userDetails",
            JSON.stringify({
              ...userDetails,
              attemptsBalance: userDetails.attemptsBalance - 1,
            })
          );
        }
        overlay.style.display = "block";
        winLose.innerText = `You Lose 😢`;
        attemptBalanceDisplay.innerText = "You have used up all your attempts";
        walletBalanceDisplay.innerText = `Your wallet balance is ₦${userDetails.walletBalance}`;
        newGameButton.style.display = "none";
        return;
      }
      localStorage.setItem(
        "ws-userDetails",
        JSON.stringify({
          ...userDetails,
          attemptsBalance: userDetails.attemptsBalance - 1,
        })
      );
      overlay.style.display = "block";
      winLose.innerText = `You Lose 😢`;
      attemptBalanceDisplay.innerText = `You have ${
        userDetails.attemptsBalance - 1
      } attempts left`;
      walletBalanceDisplay.innerText = `Your wallet balance is ₦${userDetails.walletBalance}`;
      newGameButton.innerText = "Try Again";
    },
  },
  onSuccess: function () {
    const winLose = document.querySelector("#win-lose");
    const overlay = document.querySelector("#overlay");
    const attemptBalanceDisplay = document.querySelector(".attempts-balance");
    const walletBalanceDisplay = document.querySelector(".wallet-balance");
    const newGameButton = document.querySelector("#newGame");
    const userDetails = JSON.parse(localStorage.getItem("ws-userDetails"));
    const reward = JSON.parse(localStorage.getItem("ws-reward"));
    stopCountdownTimer();
    if (
      userDetails.attemptsBalance === 0 ||
      userDetails.attemptsBalance - 1 === 0
    ) {
      if (userDetails.attemptsBalance - 1 === 0) {
        localStorage.setItem(
          "ws-userDetails",
          JSON.stringify({
            ...userDetails,
            attemptsBalance: userDetails.attemptsBalance - 1,
          })
        );
      }
      overlay.style.display = "block";
      winLose.innerText = `You Win 🎉`;
      attemptBalanceDisplay.innerText = "You have used up all your attempts";
      walletBalanceDisplay.innerText = `Your wallet balance is ₦${userDetails.walletBalance} + ₦${reward}`;
      newGameButton.style.display = "none";
      return;
    }
    overlay.style.display = "block";
    winLose.innerText = `You Win 🎉`;
    attemptBalanceDisplay.innerText = `You have ${
      userDetails.attemptsBalance - 1
    } attempts left`;
    walletBalanceDisplay.innerText = `Your wallet balance is ₦${userDetails.walletBalance} + ₦${reward}`;
    newGameButton.innerText = "Keep Playing";
    localStorage.setItem(
      "ws-userDetails",
      JSON.stringify({
        ...userDetails,
        walletBalance: userDetails.walletBalance + reward,
        attemptsBalance: userDetails.attemptsBalance - 1,
      })
    );
  },
};
