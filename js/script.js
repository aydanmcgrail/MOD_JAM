"use strict";

let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

let easing = 0.004;
let easing2 = 0.004;

let tongueX;
let targetX;
let min;
let max;
let click = 0;

let wobbly = 1; //if wobbly= like over 100/extend too far then the tongue will go up and down.

const frog = {
  // The frog's body has a position and size
  body: {
    x: 1600,
    y: 400,
    size: 200,
  },
  // The frog's tongue has a position, size, speed, and state
  tongue: {
    x: undefined,
    easeX: undefined,
    y: undefined,
    size: 60,
    speed: 10,
    // Determines how the tongue moves each frame
    state: "idle", // State can be: idle, outbound, inbound
    life: 100, ///will be its hp 0 means the tongue will break.
  },
};

function setup() {
  createCanvas(1600, 900);

  tongueX = 1580;
  targetX = 1580;
  min = 50;
  max = 15800;

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

  //checkLife();
  text(click, width / 4, height / 4);

  moveFly(fly1);
  moveFly(fly2);
  moveFly(fly3);
  moveFly(fly4);

  //move the tongue
  moveTongue();
  moveFrog();
  wobbleTongue();

  keyPressed();

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

function moveTongue() {
  // Tongue matches the frog's y
  frog.tongue.y = frog.body.y;

  if (keyIsPressed) {
    if (keyCode === 65) {
      targetX -= 4;
    } else if (keyCode === 68) {
      targetX += 4;
    }
  }
  targetX = targetX + 1;
  targetX = constrain(targetX, min, max);

  tongueX += (targetX - tongueX) * easing;
}

function wobbleTongue() {
  if (tongueX <= 1000) {
    wobbly += 2;
    if (wobbly >= 100) {
      frog.tongue.y += frog.tongue.speed;
    }
  }
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
  fill("#6e6666ff");
  noStroke();
  ellipse(tongueX, frog.tongue.y, frog.tongue.size);
  pop();

  // Draw the rest of the tongue
  push();
  stroke("#6e6666ff");
  strokeWeight(frog.tongue.size);
  line(tongueX, frog.tongue.y, frog.body.x, frog.body.y);
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

function keyPressed() {
  // Prevent default browser behavior for arrow keys
  if (keyCode === 65 || keyCode === 68) {
    return false;
  }
}
