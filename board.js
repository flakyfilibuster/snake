var instance = null;

class Board {
  constructor(cfg) {
    if(instance) return instance;
    instance = this;
    assignConfig(cfg, this);
    var SCOREBOARDHEIGHT = 50;

    this.GAMEBOARDWIDTH = 500;
    this.GAMEBOARDHEIGHT = 500;
    this.rows = 500;
    this.columns = 500;
    this.score = 0;
    this.scoreCanvas = createHiDPICanvas(this.GAMEBOARDWIDTH, SCOREBOARDHEIGHT);
    this.scoreCtx = this.scoreCanvas.getContext("2d");
    this.boardCanvas = createHiDPICanvas(this.GAMEBOARDWIDTH, this.GAMEBOARDHEIGHT);
    this.boardCtx = this.boardCanvas.getContext("2d");

    document.getElementById('scoreCanvas').appendChild(this.scoreCanvas);
    document.getElementById('boardCanvas').appendChild(this.boardCanvas);
  }

  increaseScore() {
    this.score++;
  }

  drawSnake(snake) {
    this.boardCtx.beginPath();
    this.boardCtx.rect(snake.x, snake.y, snake.pixels, snake.pixels);
    this.boardCtx.fillStyle = snake.color ;
    this.boardCtx.fill();
    this.boardCtx.closePath();
  }

  addSnack() {
    if (this.snack) this.snack = null;
    this.snack = new Snack({
      boardCtx: this.boardCtx,
      pixels: this.pixels,
      snake: this.snake
    });
    this.snack.spawn(this.snake);
  }

  draw() {
    // draw background
    this.boardCtx.beginPath();
    this.boardCtx.rect(0, 0, this.columns, this.rows);
    this.boardCtx.fillStyle = this.BOARDBGCOLOR;
    this.boardCtx.fill();
    this.boardCtx.closePath();

    // draw grid
    for (var i = 0; i <= this.columns; i += this.PIXELS) {
      this.boardCtx.strokeStyle = this.GRIDCOLOR;
      // columns
      this.boardCtx.beginPath();
      this.boardCtx.moveTo(i, 0);
      this.boardCtx.lineWidth = .1;
      this.boardCtx.lineTo(i, this.rows);
      this.boardCtx.stroke();

      // rows
      this.boardCtx.beginPath();
      this.boardCtx.moveTo(0, i);
      this.boardCtx.lineWidth = .1;
      this.boardCtx.lineTo(this.columns, i);
      this.boardCtx.stroke();
    }
  }

  drawScoreboard(gameOver) {
    var scoreText = 'SCORE:' + this.score;

    var gameOverTitle = "Congrats, you had a score of: " + this.score;
    var gameOverSubTitle = 'Press SPACE to try again';

    this.scoreCtx.font = '10px "press_start_2pregular"';
    this.scoreCtx.beginPath();
    this.scoreCtx.rect(0, 0, this.GAMEBOARDWIDTH, 50);
    this.scoreCtx.fillStyle = this.BOARDBGCOLOR ;
    this.scoreCtx.fill();
    this.scoreCtx.closePath();

    if (gameOver) {
      this.scoreCtx.fillStyle = '#232027';

      this.scoreCtx.font = '14px "press_start_2pregular"';
      this.scoreCtx.fillText(gameOverTitle, this.GAMEBOARDWIDTH/2 - this.scoreCtx.measureText(gameOverTitle).width/2, 25);
      this.scoreCtx.font = '10px "press_start_2pregular"';
      this.scoreCtx.fillText(gameOverSubTitle, this.GAMEBOARDWIDTH/2 - this.scoreCtx.measureText(gameOverSubTitle).width/2, 40);

      this.resetScore();
      return;
    }

    this.scoreCtx.fillStyle = '#232027';

    if (this.started) {
      this.scoreCtx.font = '14px "press_start_2pregular"';
      this.scoreCtx.fillText(scoreText, this.GAMEBOARDWIDTH/2 - this.scoreCtx.measureText(scoreText).width/2, 35);
    } else {
      this.scoreCtx.font = '14px "press_start_2pregular"';
      this.scoreCtx.fillText("Welcome!", this.GAMEBOARDWIDTH/2 - this.scoreCtx.measureText("Welcome!").width/2, 25);
      this.scoreCtx.font = '10px "press_start_2pregular"';
      this.scoreCtx.fillText("Press any directions key to start.", this.GAMEBOARDWIDTH/2 - this.scoreCtx.measureText("Press any directions key to start.").width/2, 40);
    }
  }

  resetScore() {
    this.score = 0;
  }

};
