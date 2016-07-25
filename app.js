// TODO:
// * prevent snack from spawning in snake tail
//
// * truncate snake path (we don't need that much)
//
// * Store fonts locally
//
// * Seperate into different files

window.onload = function() {
  var VELOCITY = 2;
  var PIXELS = 10;
  var GAMEBOARDWIDTH = 500;
  var GAMEBOARDHEIGHT = 500;
  var SCOREBOARDHEIGHT = 50;
  var BOARDBGCOLOR = '#81942b';
  var GRIDCOLOR = '#a8c334';
  var SNAKECOLOR = '#ec1f5e';
  var SNACKCOLOR = '#4591d8';
  var gameOver = false;
  var score = 0;

  var boardCanvas = createHiDPICanvas(GAMEBOARDWIDTH, GAMEBOARDHEIGHT);
  var boardCtx = boardCanvas.getContext("2d");

  var scoreCanvas = createHiDPICanvas(GAMEBOARDWIDTH, SCOREBOARDHEIGHT);
  var scoreCtx = scoreCanvas.getContext("2d");

  document.getElementById('scoreCanvas').appendChild(scoreCanvas);
  document.getElementById('boardCanvas').appendChild(boardCanvas);

  var Snake = function(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.path = [];
    this.tail = 0;
    this.children = []
    this.direction = null;
  };

  Snake.prototype.childPosition = function(index) {
    return this.path[this.path.length -7 -index * 6];
  }

  Snake.prototype.draw = function() {
    this.path.push(Object.assign({}, {x: this.x, y: this.y}));

    boardCtx.beginPath();
    boardCtx.rect(this.x, this.y, PIXELS, PIXELS);
    boardCtx.fillStyle = SNAKECOLOR ;
    boardCtx.fill();
    boardCtx.closePath();

    this.children.forEach(function(child, i) {
      boardCtx.fillStyle = SNAKECOLOR ;
      var pos = this.childPosition(i);
      child.x = pos.x;
      child.y = pos.y
      boardCtx.beginPath();
      boardCtx.rect(pos.x, pos.y, PIXELS, PIXELS);
      boardCtx.fill();
      boardCtx.closePath();
    }, this);
  }

  Snake.prototype.collides = function(board) {
    if (this.x < 0 || this.x > board.columns - PIXELS || this.y < 0 || this.y > board.rows - PIXELS) {
      board.gameOver();
    }

    this.children.forEach(function(child, idx) {
      if (idx > 1) {
        if (this.x > child.x && this.x < (child.x + PIXELS) && this.y > child.y && this.y < (child.y + PIXELS)) {
          board.gameOver();
        }
      }
    }, this);
  }

  Snake.prototype.move = function() {
    this.x += this.dx;
    this.y += this.dy;
  };

  Snake.prototype.processDirection = function(cb) {
    if (this.x%PIXELS == 0 && this.y%PIXELS == 0) {
      this.direction = null;
      cb();
    }
  };

  Snake.prototype.up = function() {
    this.processDirection(function() {
      if (!this.dy) {
        this.dx = 0;
        this.dy = -VELOCITY;
      }
    }.bind(this));
  };

  Snake.prototype.right = function() {
    this.processDirection(function() {
      if (this.dx >= 0) {
        this.dx = VELOCITY;
        this.dy = 0;
      }
    }.bind(this));
  };

  Snake.prototype.down = function() {
    this.processDirection(function() {
      if (this.dy >= 0) {
        this.dx = 0;
        this.dy = VELOCITY;
      }
    }.bind(this));
  };

  Snake.prototype.left = function() {
    this.processDirection(function() {
      if (!this.dx) {
        this.dx = -VELOCITY;
        this.dy = 0;
      }
    }.bind(this));
  };

  var Snack = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Snack.prototype.draw = function() {
    boardCtx.beginPath();
    boardCtx.rect(this.x, this.y, PIXELS, PIXELS);
    boardCtx.fillStyle = SNACKCOLOR ;
    boardCtx.fill();
    boardCtx.closePath();
  };

  Snack.prototype.nom = function(snake, board) {
    if (snake.x == this.x && snake.y == this.y) {
      board.addSnack();
      snake.tail++;
      snake.children.push(new Snake(0, 0));
      score++;
      board.drawScoreboard();
    }
  };

  var Board = function() {
    this.columns = GAMEBOARDWIDTH;
    this.rows = GAMEBOARDHEIGHT;
    this.snack = null;
  };

  Board.prototype.addSnack = function() {
    if (this.snack) this.snack = null;
    this.snack = new Snack(rand(49)*PIXELS, rand(49)*PIXELS);
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
    var titleText = 'flinc-Snake';
    var scoreText = 'score:' + score;

    var gameOverTitle = "Game Over"
    var gameOverSubTitle = 'Press SPACE to try again';

    scoreCtx.font = '10px "Press Start 2P"';
    scoreCtx.beginPath();
    scoreCtx.rect(0, 0, GAMEBOARDWIDTH, 50);
    scoreCtx.fillStyle = BOARDBGCOLOR ;
    scoreCtx.fill();
    scoreCtx.closePath();

    if (gameOver) {
      scoreCtx.fillStyle = '#232027';
      scoreCtx.fillText(scoreText, 0, 30);

      scoreCtx.font = '14px "Press Start 2P"';
      scoreCtx.fillText(gameOverTitle, GAMEBOARDWIDTH/2 - scoreCtx.measureText(gameOverTitle).width/2, 25);
      scoreCtx.font = '10px "Press Start 2P"';
      scoreCtx.fillText(gameOverSubTitle, GAMEBOARDWIDTH/2 - scoreCtx.measureText(gameOverSubTitle).width/2, 40);

      return;
    }

    scoreCtx.fillStyle = '#232027';
    scoreCtx.fillText(scoreText, 0, 30);

    scoreCtx.font = '14px "Press Start 2P"';
    scoreCtx.fillText(titleText, GAMEBOARDWIDTH/2 - scoreCtx.measureText(titleText).width/2, 35);
  }

  Board.prototype.gameOver = function() {
    gameOver = true;

    this.drawScoreboard();
  }

  var Game = function() {
    this.setUp = function() {
      this.snake = new Snake(250, 250);
      this.board = new Board();
      score = 0;
      this.board.addSnack();
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
      this.snake.draw();

      this.snake.move();

      this.board.snack.nom(this.snake, this.board);
      this.snake.collides(this.board);

      requestAnimationFrame(this.draw);
    }.bind(this);

    this.addListeners = function() {
      keyDownHandler = function(e) {
        if (gameOver) {
          if (e.keyCode == 32) {
            gameOver = false;
            this.setUp();
          }
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
