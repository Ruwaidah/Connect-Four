const formSubmit = document.querySelector("#color-pick");

class Game {
  constructor(player1 = "red", player2 = "blue", h, w) {
    this.width = w;
    this.height = h;
    this.currPlayer = player1;
    this.playerOne = player1;
    this.playerTwo = player2;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.restartGame();
    this.gameOver = false;
  }
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  makeHtmlBoard() {
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.colorName;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    if (this.gameOver) return;
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    // console.log("yesyeyseysy",this.findSpotForCol(x))
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.colorName} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.playerOne ? this.playerTwo : this.playerOne;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  startNewGame() {
    this.gameOver = false;
    const tb = document.querySelector("#board");
    this.board = [];
    tb.innerHTML = "";
    formSubmit.style.display = "block";
    // this.makeBoard();
    // this.makeHtmlBoard();
  }

  restartGame() {
    const restart = document.querySelector("#restart");

    restart.addEventListener("click", this.startNewGame.bind(this));
  }
}

formSubmit.addEventListener("submit", function onSubmit(e) {
  e.preventDefault();
  let player1Color = document.querySelector("#player1").value;
  let player2Color = document.querySelector("#player2").value;
  const player1 = new Player(player1Color);
  const player2 = new Player(player2Color);
  document.querySelector("#player1").value = "";
  document.querySelector("#player2").value = "";
  formSubmit.style.display = "none";
  new Game(player1, player2, 6, 7);
});

class Player {
  constructor(color) {
    this.colorName = color;
  }
}

//const newGame = new Game(6, 7); // assuming constructor takes height, width
