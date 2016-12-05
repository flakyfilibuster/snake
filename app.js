// TODO:
// * prevent snack from spawning in snake tail

window.onload = function() {

  var VELOCITY = 2;
  var PIXELS = 10;
  var GAMEBOARDWIDTH = 500;
  var GAMEBOARDHEIGHT = 500;
  var SCOREBOARDHEIGHT = 50;
  var BOARDBGCOLOR = '#313b3d';
  var GRIDCOLOR = '#ffffff';
  var SNAKECOLOR = '#33b2ce';
  var gameOver = false;
  var started = false;
  var score = 0;

  var boardCanvas = createHiDPICanvas(GAMEBOARDWIDTH, GAMEBOARDHEIGHT);
  var boardCtx = boardCanvas.getContext("2d");

  var scoreCanvas = createHiDPICanvas(GAMEBOARDWIDTH, SCOREBOARDHEIGHT);
  var scoreCtx = scoreCanvas.getContext("2d");

  document.getElementById('scoreCanvas').appendChild(scoreCanvas);
  document.getElementById('boardCanvas').appendChild(boardCanvas);


  var Board = function() {
    this.columns = GAMEBOARDWIDTH;
    this.rows = GAMEBOARDHEIGHT;
    this.snack = null;
  };

  Board.prototype.addSnack = function(snake) {
    if (this.snack) this.snack = null;
    this.snack = new Snack({
      boardCtx: boardCtx,
      pixels: PIXELS,
      snake: snake
    });
    this.snack.spawn(this.snake);
  }

  Board.prototype.draw = function() {
    // draw background
    boardCtx.beginPath();
    boardCtx.rect(0, 0, this.columns, this.rows);
    boardCtx.fillStyle = BOARDBGCOLOR;
    boardCtx.fill();
    boardCtx.closePath();

    // draw grid
    for (var i = 0; i <= this.columns; i += PIXELS) {
      boardCtx.strokeStyle = GRIDCOLOR;
      // columns
      boardCtx.beginPath();
      boardCtx.moveTo(i, 0);
      boardCtx.lineWidth = .1;
      boardCtx.lineTo(i, this.rows);
      boardCtx.stroke();

      // rows
      boardCtx.beginPath();
      boardCtx.moveTo(0, i);
      boardCtx.lineWidth = .1;
      boardCtx.lineTo(this.columns, i);
      boardCtx.stroke();
    }
  }

  Board.prototype.drawScoreboard = function() {
    var scoreText = 'SCORE:' + score;

    var gameOverTitle = "Congrats, you had a score of: " + score;
    var gameOverSubTitle = 'Press SPACE to try again';

    scoreCtx.font = '10px "press_start_2pregular"';
    scoreCtx.beginPath();
    scoreCtx.rect(0, 0, GAMEBOARDWIDTH, 50);
    scoreCtx.fillStyle = BOARDBGCOLOR ;
    scoreCtx.fill();
    scoreCtx.closePath();

    if (gameOver) {
      scoreCtx.fillStyle = '#232027';

      scoreCtx.font = '14px "press_start_2pregular"';
      scoreCtx.fillText(gameOverTitle, GAMEBOARDWIDTH/2 - scoreCtx.measureText(gameOverTitle).width/2, 25);
      scoreCtx.font = '10px "press_start_2pregular"';
      scoreCtx.fillText(gameOverSubTitle, GAMEBOARDWIDTH/2 - scoreCtx.measureText(gameOverSubTitle).width/2, 40);

      return;
    }

    scoreCtx.fillStyle = '#232027';

    if (started) {
      scoreCtx.font = '14px "press_start_2pregular"';
      scoreCtx.fillText(scoreText, GAMEBOARDWIDTH/2 - scoreCtx.measureText(scoreText).width/2, 35);
    } else {
      scoreCtx.font = '14px "press_start_2pregular"';
      scoreCtx.fillText("Welcome!", GAMEBOARDWIDTH/2 - scoreCtx.measureText("Welcome!").width/2, 25);
      scoreCtx.font = '10px "press_start_2pregular"';
      scoreCtx.fillText("Press any directions key to start.", GAMEBOARDWIDTH/2 - scoreCtx.measureText("Press any directions key to start.").width/2, 40);
    }
  }

  Board.prototype.gameOver = function() {
    gameOver = true;

    this.drawScoreboard();
  }

  var Game = function() {
    this.setUp = function() {
      this.snake = new Snake({
        x: 250,
        y: 250,
        boardCtx: boardCtx,
        pixels: PIXELS,
        color: SNAKECOLOR,
        velocity: VELOCITY
      });
      this.board = new Board();
      this.board.snake = this.snake;
      score = 0;
      this.board.addSnack(this.snake);
      this.board.drawScoreboard();
      this.addListeners();
      this.draw();
    }

    this.draw = function() {
      if (gameOver) return;

      if (this.snake.direction) {
        this.snake[this.snake.direction]();
      }

      this.board.draw();
      this.board.snack.draw();
      this.snake.draw(boardCtx, PIXELS);

      this.snake.move();

      if (this.board.snack.nom(this.snake)) {
        this.board.addSnack();
        this.snake.tail++;
        this.snake.children.push(
          new Snake({
            x: 0,
            y: 0,
            boardCtx: boardCtx,
            pixels: PIXELS,
            color: SNAKECOLOR,
            velocity: VELOCITY
          })
        );
        score++;
        this.board.drawScoreboard();
      }

      this.snake.collides(this.board);

      requestAnimationFrame(this.draw);
    }.bind(this);

    this.addListeners = function() {
      var keyDownHandler = function(e) {
        if (gameOver) {
          if (e.keyCode == 32) {
            gameOver = false;
            this.setUp();
          }
        }

        if (!started && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 )) {
          started = true;
          this.board.drawScoreboard();
        }

        if (e.keyCode == 38) {
          this.snake.direction = 'up';
        } else if (e.keyCode == 37) {
          this.snake.direction = 'left';
        } else if (e.keyCode == 40) {
          this.snake.direction = 'down';
        } else if (e.keyCode == 39) {
          this.snake.direction = 'right';
        }
      }.bind(this)

      document.addEventListener("keydown", keyDownHandler, false);
    }.bind(this);
  }


  var game = new Game();
  game.setUp();
}
