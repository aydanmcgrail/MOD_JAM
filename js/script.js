"use strict";

let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

let FrogDelayY = 0;
let easing = 0.008;

const frog = {
  // The frog's body has a position and size
  body: {
    x: 1600,
    y: 400,
    size: 200,
  },
  // The frog's tongue has a position, size, speed, and state
  tongue: {
    x: 1600,
    y: undefined,
    size: 60,
    speed: 5,
    // Determines how the tongue moves each frame
    state: "idle", // State can be: idle, outbound, inbound
  },
};

function setup() {
  createCanvas(1600, 900);

  fly1 = createFly();
  fly2 = createFly();
  fly3 = createFly();
  fly4 = createFly();
}

function createFly() {
  let fly = {
    x: random(150, 800),
    y: random(150, 700),
    size: 20,
    speedX: 20,
    speedY: 10,
  };
  return fly;
}

function draw() {
  background("#87ceeb");

  moveFly(fly1);
  moveFly(fly2);
  moveFly(fly3);
  moveFly(fly4);

  //move the tongue
  moveTongue();
  moveFrog();
  keyReleased();
  //     pressingMouse();

  //draw the flies
  drawFly(fly1);
  drawFly(fly2);
  drawFly(fly3);
  drawFly(fly4);

  //draw the frog
  drawFrog();

  flyLimits(fly1);
  flyLimits(fly2);
  flyLimits(fly3);
  flyLimits(fly4);
}

function moveFly(fly) {
  fly.x += random(-fly.speedX, fly.speedX);
  fly.y += random(-fly.speedY, fly.speedY);
}

function flyLimits(fly) {
  if (fly.x > 1590) {
    fly.x -= 22;
  }

  if (fly.x < 10) {
    fly.x += 22;
  }
  if (fly.y > 790) {
    fly.y -= 22;
  }
  if (fly.x < 10) {
    fly.y += 22;
  }
}

function drawFly(fly) {
  push();
  noStroke();
  fill(255);
  rect(fly.x, fly.y, fly.size);
  pop();
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    frog.tongue.x += frog.tongue.speed;
  }
}

function moveTongue() {
  // Tongue matches the frog's x
  frog.tongue.y = frog.body.y;
  //if user presses the space key the tongue moves left
  if (keyIsDown(LEFT_ARROW)) {
    frog.tongue.x += -frog.tongue.speed;
  }
  /**  If the tongue is idle, it doesn't do anything
  if (frog.tongue.state === "idle") {
    // Do nothing
  }
  // If the tongue is outbound, it moves left
  else if (frog.tongue.state === "outbound") {
    //it starts at 1600 so substracting makes it go left.
    frog.tongue.x += -frog.tongue.speed;
    // The tongue bounces back if it hits the left(value=0)
    if (mouseReleased()) {
      frog.tongue.state = "inbound";
    }
  }
  // If the tongue is inbound, it moves back to the right origin (1600px)
  else if (frog.tongue.state === "inbound") {
    frog.tongue.x += frog.tongue.speed;
    // The tongue stops if it hits the bottom
    if (frog.tongue.x >= width) {
      frog.tongue.state = "idle";
    }
  }
  */
}

function moveFrog() {
  //frog.body.y = mouseY;
  let targetY = mouseY;
  let dx = targetY - frog.body.y;
  frog.body.y += dx * easing;
}

function drawFrog() {
  // Draw the tongue tip
  push();
  fill("#693e3eff");
  noStroke();
  ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
  pop();

  // Draw the rest of the tongue
  push();
  stroke("#693e3eff");
  strokeWeight(frog.tongue.size);
  line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
  pop();

  // Draw the frog's body
  push();
  fill("#00ff00");
  noStroke();
  ellipse(frog.body.x, frog.body.y, frog.body.size);
  pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
  // Get distance from tongue to fly
  const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
  // Check if it's an overlap
  const eaten = d < frog.tongue.size / 2 + fly.size / 2;
  if (eaten) {
    // Reset the fly
    resetFly();
    // Bring back the tongue
    frog.tongue.state = "inbound";
  }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 
function pressingMouse() {
  if (mouseIsPressed) {
    frog.tongue.state = "outbound";
  } else {
    frog.tongue.state === "inbound";
  }
}
*/
