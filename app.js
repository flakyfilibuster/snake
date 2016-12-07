// TODO:
// * prevent snack from spawning in snake tail

window.onload = function() {

  var VELOCITY = 2;
  var PIXELS = 10;
  var BOARDBGCOLOR = '#313b3d';
  var GRIDCOLOR = '#ffffff';
  var SNAKECOLOR = '#33b2ce';
  var gameOver = false;
  var started = false;

  var Game = function() {
    this.setUp = function() {
      this.snake = new Snake({
        x: 250,
        y: 250,
        pixels: PIXELS,
        color: SNAKECOLOR,
        velocity: VELOCITY
      });

      this.board = new Board({
        GRIDCOLOR: GRIDCOLOR,
        PIXELS: PIXELS,
        BOARDBGCOLOR: BOARDBGCOLOR,
        pixels: PIXELS,
        gameOver: gameOver,
        started: started,
        snack: null
      });

      this.board.snake = this.snake;
      this.board.addSnack(this.snake);
      this.board.drawScoreboard();
      this.addListeners();
      this.draw();
    }

    this.draw = function() {
      if (this.snake.collides(this.board)) {
        this.board.drawScoreboard(true);
        this.board
        this.addRestartListener();
        return;
      }

      if (this.snake.direction) {
        this.snake[this.snake.direction]();
      }

      this.board.draw();
      this.board.snack.draw();
      this.snake.draw(this.board);

      this.snake.move();

      if (this.board.snack.nom(this.snake)) {
        this.board.addSnack();
        this.snake.tail++;
        this.snake.children.push(
          new Snake({
            x: 0,
            y: 0,
            pixels: PIXELS,
            color: SNAKECOLOR,
            velocity: VELOCITY
          })
        );
        this.board.increaseScore();
        this.board.drawScoreboard();
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
        if (!this.board.started && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 )) {
          this.board.started = true;
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
