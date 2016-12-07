var Snake = class {
  constructor(cfg) {
    assignConfig(cfg, this);

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

  draw(board) {
    this.path.push({x: this.x, y: this.y});

    board.drawSnake(this);

    this.children.forEach(function(child, i) {
      var pos = this.childPosition(i);
      child.x = pos.x;
      child.y = pos.y
      board.drawSnake(child)
    }, this);
  }

  collides(board) {
    var collides = false;

    // board boundaries
    if (this.x < 0 || this.x > board.columns - this.pixels || this.y < 0 || this.y > board.rows - this.pixels) {
      collides = true;
    }

    // own tail
    this.children.forEach(function(child, idx) {
      if (idx > 1) {
        if (this.x > child.x && this.x < (child.x + this.pixels) && this.y > child.y && this.y < (child.y + this.pixels)) {
          collides = true;
        }
      }
    }, this);

    return collides;
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
