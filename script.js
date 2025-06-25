console.log("Welcome to MyTicTacToe");
let music = new Audio("mineMusic.mp3");
let audioTurnX = new Audio("tingX.mp3");
let audioTurnO = new Audio("tingO.mp3");
let gameover = new Audio("mineGameOver.mp3");
let turn = "X";
let isgameover = false;

// Function to change the turn
const changeTurn = () => {
  return turn === "X" ? "O" : "X";
};

// Function to check for a win
const checkWin = () => {
  let boxtext = document.getElementsByClassName("boxText");
  let wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  wins.forEach((e) => {
    if (
      boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[1]].innerText === boxtext[e[2]].innerText &&
      boxtext[e[0]].innerText !== ""
    ) {
      document.querySelector(".info").innerText =
        boxtext[e[0]].innerText + " Won!";
      isgameover = true;
      document.querySelector(".container").style.pointerEvents = "none";

      // Display a random GIF for the winner
      const gifs = ["mineWin.gif", "mineWin2.gif", "mineWin3.gif"];
      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
      console.log("Selected GIF:", randomGif);

      const imgBox = document.querySelector(".imgBox img");
      imgBox.src = randomGif + "?t=" + new Date().getTime();

      const imgContainer = document.querySelector(".imgBox");
      imgContainer.style.width = "150px";
      imgContainer.style.height = "auto";
    }
  });

  // Check for a tie if no winner is found
  if (!isgameover && checkTie()) {
    document.querySelector(".info").innerText = "It's a Tie!";
    isgameover = true;
    document.querySelector(".container").style.pointerEvents = "none";
  }
};

// Function to check for a tie
const checkTie = () => {
  let boxtext = document.getElementsByClassName("boxText");
  // Check if all boxes are filled and there is no winner
  return [...boxtext].every((box) => box.innerText !== "") && !isgameover;
};

// Simple AI that tries to win or block the user
const aiMove = () => {
  if (isgameover) return;
  let boxtext = document.getElementsByClassName("boxText");

  const getEmptyIndices = () => {
    return [...boxtext]
      .map((box, i) => (box.innerText === "" ? i : null))
      .filter((i) => i !== null);
  };

  const findWinningMove = (player) => {
    for (let combo of [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]) {
      let [a, b, c] = combo;
      let texts = [boxtext[a].innerText, boxtext[b].innerText, boxtext[c].innerText];
      if (
        texts.filter((t) => t === player).length === 2 &&
        texts.includes("")
      ) {
        return [a, b, c].find((i) => boxtext[i].innerText === "");
      }
    }
    return null;
  };

  // Priority: Win > Block > Random
  let move =
    findWinningMove("O") ||
    findWinningMove("X") ||
    getEmptyIndices()[Math.floor(Math.random() * getEmptyIndices().length)];

  if (move != null && boxtext[move].innerText === "") {
    boxtext[move].innerText = "O";
    audioTurnO.play();
    turn = changeTurn();
    checkWin();
    if (!isgameover) {
      document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    }
  }
};

// Game Logic
//music.play();
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element) => {
  let boxtext = element.querySelector(".boxText");
  element.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch((e) => console.log("Music play blocked:", e));
    }
    if (boxtext.innerText === "" && !isgameover && turn === "X") {
      boxtext.innerText = "X";
      audioTurnX.play();
      turn = changeTurn();
      checkWin();
      if (!isgameover) {
        document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
        setTimeout(aiMove, 300); // Give slight delay for AI to act
      }
    }
  });
});

// Reset
reset.addEventListener("click", () => {
  let boxes = document.querySelectorAll(".boxText");
  Array.from(boxes).forEach((element) => {
    element.innerText = "";
  });
  gameover.play();
  turn = "X";
  isgameover = false;
  document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
  document.querySelector(".container").style.pointerEvents = "auto";

  const imgContainer = document.querySelector(".imgBox");
  imgContainer.style.width = "0px";
  imgContainer.style.height = "auto";
});

// Dark mode toggle
const navb = document.querySelector(".navb");
let isDark = false;

navb.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark-mode", isDark);

  if (isDark) {
    navb.innerText = "Light";
    navb.style.backgroundColor = "white";
    navb.style.color = "black";
  } else {
    navb.innerText = "Dark";
    navb.style.backgroundColor = "black";
    navb.style.color = "white";
  }
});