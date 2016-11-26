var Snake = class {
  constructor(cfg) {
    Object.keys(cfg).forEach(function(key) {
      this[key] = cfg[key];
    }, this);

    this.dx = 0;
    this.dy = 0;
    this.path = [];
    this.tail = 0;
    this.children = []
    this.direction = null;
  }

  childPosition(index) {
    return this.path[this.path.length -7 -index * 6];
  }

  draw() {
    this.path.push({x: this.x, y: this.y});

    this.boardCtx.beginPath();
    this.boardCtx.rect(this.x, this.y, this.pixels, this.pixels);
    this.boardCtx.fillStyle = this.color ;
    this.boardCtx.fill();
    this.boardCtx.closePath();

    this.children.forEach(function(child, i) {
      this.boardCtx.fillStyle = this.color ;
      var pos = this.childPosition(i);
      child.x = pos.x;
      child.y = pos.y
      this.boardCtx.beginPath();
      this.boardCtx.rect(pos.x, pos.y, this.pixels, this.pixels);
      this.boardCtx.fill();
      this.boardCtx.closePath();
    }, this);
  }

  collides(board) {
    // board boundaries
    if (this.x < 0 || this.x > board.columns - this.pixels || this.y < 0 || this.y > board.rows - this.pixels) {
      board.gameOver();
    }

    // own tail
    this.children.forEach(function(child, idx) {
      if (idx > 1) {
        if (this.x > child.x && this.x < (child.x + this.pixels) && this.y > child.y && this.y < (child.y + this.pixels)) {
          board.gameOver();
        }
      }
    }, this);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  processDirection(cb) {
    if (this.x%this.pixels == 0 && this.y%this.pixels == 0) {
      this.direction = null;
      cb();
    }
  }

  up() {
    this.processDirection(function() {
      if (!this.dy) {
        this.dx = 0;
        this.dy = -this.velocity;
      }
    }.bind(this));
  };

  right() {
    this.processDirection(function() {
      if (this.dx >= 0) {
        this.dx = this.velocity;
        this.dy = 0;
      }
    }.bind(this));
  };

  down() {
    this.processDirection(function() {
      if (this.dy >= 0) {
        this.dx = 0;
        this.dy = this.velocity;
      }
    }.bind(this));
  };

  left() {
    this.processDirection(function() {
      if (!this.dx) {
        this.dx = -this.velocity;
        this.dy = 0;
      }
    }.bind(this));
  };
};
