// https://github.com/pothonprogramming/pothonprogramming.github.io/blob/master/content/touch-controller/touch-controller.js

let Button, controller, display, game;

Button = (x, y, width, height, color) => {
  this.active = false;
  this.color = color;
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y;
};

Button.prototype = {
  // returns true if the specified point lies within the rectangle:
  containsPoint: (x, y) => {
    // if the point is outside of the rectangle return false:
    if (
      x < this.x ||
      x > this.x + this.width ||
      y < this.y ||
      y > this.y + this.width
    ) {
      return false;
    } else {
      return true;
    }
  },
  // handles everything to do with user input:
};

controller = {
  buttons: [
    new Button(0, 160, 60, 60, "#f09000"),
    new Button(0, 160, 60, 60, "#f090f0"),
    new Button(0, 160, 60, 60, "#f090f0"),
    new Button(0, 160, 60, 60, "#f09000"),
  ],

  testButtons: (target_touches) => {
    let button, index00, index01, touch;

    for (index00 = this.buttons.length - 1; index00 > -1; index00--) {
      button = this.buttons[index00];
      button.active = false;

      for (index01 = target_touches.length - 1; index01 > -1; index01--) {
        touch = target_touches[index01];

        // make sure the touch coordinates are adjusted for both the canvas offset
        // and the scale ratio of the buffer and output canvases:
        if (
          button.containsPoint(
            (touch.clientX - display.bounding_rectangle.left) *
              display.buffer_output_ratio,
            (touch.clientY - display.bounding_rectangle.top) *
              display.buffer_output_ratio
          )
        ) {
          button.active = true;
          // once the button is active, there's no need to check if any other points are inside, so continue
          break;
        }
      }
    }
  },
  touchEnd: (e) => {
    e.preventDefault();
    controller.testButtons(e.targetTouches);
  },
  touchMove: (e) => {
    e.preventDefault();
    controller.testButtons(e.targetTouches);
  },
  touchStart: (e) => {
    e.preventDefault();
    controller.testButtons(e.targetTouches);
  },
};

display = {
  buffer: document.createElement("canvas").getContext("2d"),
  output: document.querySelector("canvas").getContext("2d"),
  message: document.querySelector("p"),

  buffer_output_ratio: 1,
  bounding_rectangle: undefined,

  clear: (color) => {
    this.buffer.fillStyle = color || "#00000";
    this.buffer.fillRect(
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height
    );
  },
};
