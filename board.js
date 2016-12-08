var Board = (function() {
  var instance = null;
  var SCOREBOARDHEIGHT = 50;
  var GAMEBOARDWIDTH = 500;
  var GAMEBOARDHEIGHT = 500;
  var BOARDBGCOLOR = '#313b3d';
  var GRIDCOLOR = '#ffffff';
  var PIXELS = 10;

  return class Board {
    constructor(cfg) {
      if(instance) return instance;
      instance = this;
      assignConfig(cfg, this);

      this.columns = 500;
      this.rows = 500;
      this.counter = 0;

      this.constructBoards();
    }

    constructBoards() {
      this.scoreCanvas = createHiDPICanvas(GAMEBOARDWIDTH, SCOREBOARDHEIGHT);
      this.scoreCtx = this.scoreCanvas.getContext("2d");

      this.boardCanvas = createHiDPICanvas(GAMEBOARDWIDTH, GAMEBOARDHEIGHT);
      this.boardCtx = this.boardCanvas.getContext("2d");

      document.getElementById('scoreCanvas').appendChild(this.scoreCanvas);
      document.getElementById('boardCanvas').appendChild(this.boardCanvas);
    }

    drawSnake(snake) {
      drawRect({
        canvas: this.boardCtx,
        x: snake.x,
        y: snake.y,
        width: snake.pixels,
        height: snake.pixels,
        color: snake.color,
      });
    }

    drawSnack(snack) {
      drawRect({
        canvas: this.boardCtx,
        x: snack.x,
        y: snack.y,
        width: snack.pixels,
        height: snack.pixels,
        color: snack.color,
      });
    }

    triggerExplosion(snack) {
      this.counter = 0;
      this.snack = snack;
    }

    drawSnackExplosion() {
      drawRect({
        canvas: this.boardCtx,
        color: `rgba(255, 255, 255, ${1/this.counter})`,
        x: this.snack.x -this.counter/2,
        y: this.snack.y - this.counter/2,
        width: 10+this.counter,
        height: 10+this.counter
      });
    }

    drawGrid() {
      for (var i = 0; i <= this.columns; i += PIXELS) {
        this.boardCtx.strokeStyle = GRIDCOLOR;

        // columns
        drawLine({
          canvas: this.boardCtx,
          start: {x: i, y: 0},
          end: {x: i, y: this.rows}
        });

        // rows
        drawLine({
          canvas: this.boardCtx,
          start: {x: 0, y: i},
          end: {x: this.columns, y: i}
        });
      }
    }

    drawBoard() {
      drawRect({
        canvas: this.boardCtx,
        width: this.columns,
        height: this.rows,
        color: BOARDBGCOLOR,
      });
    }

    draw() {
      this.drawBoard();
      this.drawGrid();
      if(this.snack && this.counter < 50) {
        this.drawSnackExplosion();
        this.counter += 0.5;
      }
    }

    drawScoreboard(game) {
      this.drawScoreboardBG();

      if(game.ended) {
        return this.drawPostGameText(game.score);
      }

      if(game.started) {
        return this.drawInGameText(game.score);
      } else {
        return this.drawPreGameText();
      }
    }

    drawScoreboardBG() {
      drawRect({
        canvas: this.scoreCtx,
        width: GAMEBOARDWIDTH,
        height: SCOREBOARDHEIGHT,
        color: BOARDBGCOLOR,
        font: '10px "press_start_2pregular"'
      });
    }

    drawPostGameText(score) {
      var gameOverTitle = "Congrats, you had a score of: " + score;
      var gameOverSubTitle = 'Press SPACE to try again';

      this.scoreCtx.fillStyle = '#232027';
      this.scoreCtx.font = '14px "press_start_2pregular"';
      this.scoreCtx.fillText(gameOverTitle, GAMEBOARDWIDTH/2 - this.scoreCtx.measureText(gameOverTitle).width/2, 25);
      this.scoreCtx.font = '10px "press_start_2pregular"';
      this.scoreCtx.fillText(gameOverSubTitle, GAMEBOARDWIDTH/2 - this.scoreCtx.measureText(gameOverSubTitle).width/2, 40);
    }

    drawInGameText(score) {
      var scoreText = 'SCORE:' + score;

      this.scoreCtx.fillStyle = '#232027';
      this.scoreCtx.font = '14px "press_start_2pregular"';
      this.scoreCtx.fillText(scoreText, GAMEBOARDWIDTH/2 - this.scoreCtx.measureText(scoreText).width/2, 35);
    }

    drawPreGameText() {
      this.scoreCtx.fillStyle = '#232027';
      this.scoreCtx.font = '14px "press_start_2pregular"';
      this.scoreCtx.fillText("Welcome!", GAMEBOARDWIDTH/2 - this.scoreCtx.measureText("Welcome!").width/2, 25);
      this.scoreCtx.font = '10px "press_start_2pregular"';
      this.scoreCtx.fillText("Press any directions key to start.", GAMEBOARDWIDTH/2 - this.scoreCtx.measureText("Press any directions key to start.").width/2, 40);
    }
  };
})();
