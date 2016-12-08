window.onload = function() {

  var Game = function() {
    this.setUp = function() {
      this.board = new Board({snack: null});
      this.snake = new Snake({x: 250, y: 250});
      this.snack = new Snack({snake: this.snake});

      this.started = false;
      this.ended = false;
      this.score = 0;

      this.board.drawScoreboard(this);
      this.addListeners();
      this.draw();
    };

    this.gameOver = function() {
      this.ended = true;
      this.board.drawScoreboard(this);
      this.addRestartListener();
      return;
    };

    this.snackEaten = function() {
      this.score++;
      this.snack = new Snack({snake: this.snake});
      this.snake.nom();
      this.board.drawScoreboard(this);
    };

    this.draw = function() {
      if (this.snake.collides(this.board)) {
        return this.gameOver();
      }

      if (this.snake.direction) {
        this.snake[this.snake.direction]();
      }

      this.board.draw();

      this.snack.draw(this.board);

      this.snake.draw(this.board);

      this.snake.move();

      if (this.snack.nom(this.snake, this.board)) {
        this.snackEaten();
      }

      this.snake.collides(this.board, this);

      requestAnimationFrame(this.draw);
    }.bind(this);

    this.addRestartListener = function() {
      var resetHandler = function(e) {
        if (e.keyCode == 32) {
          this.setUp();
          document.removeEventListener("keydown", resetHandler);
        }
      }.bind(this);

      document.addEventListener("keydown", resetHandler, false);
    }.bind(this);

    this.addListeners = function() {
      var keyDownHandler = function(e) {
        if (!this.started && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 )) {
          this.started = true;
          this.board.drawScoreboard(this);
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
      }.bind(this);

      document.addEventListener("keydown", keyDownHandler, false);
    }.bind(this);
  };

  var game = new Game();
  game.setUp();
};
