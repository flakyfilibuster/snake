class Snack {
  constructor(cfg) {
    assignConfig(cfg, this);
    this.color = '#ffffff';
  }

  draw() {
    this.boardCtx.beginPath();
    this.boardCtx.rect(this.x, this.y, this.pixels, this.pixels);
    this.boardCtx.fillStyle = this.color ;
    this.boardCtx.fill();
    this.boardCtx.closePath();
  }

  isColliding(snake) {
    if (this.x >= snake.x && this.x <= (snake.x + this.pixels) && this.y >= snake.y && this.y <= (snake.y + this.pixels)) {
      return true;
    }

    snake.children.forEach(function(child) {
      if (this.x >= child.x && this.x <= (child.x + this.pixels) && this.y >= child.y && this.y <= (child.y + this.pixels)) {
        return true;
      }
    }, this);
  }

  spawn(snake) {
    while (!this.x || this.isColliding(snake)) {
      this.x = rand(49)*this.pixels;
      this.y = rand(49)*this.pixels;
    }
  }

  nom(snake) {
    if (snake.x == this.x && snake.y == this.y) return true;
  }
}
