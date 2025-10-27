"use strict";

let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

let easing = 0.04;
let easing2 = 0.004;

let tongueX = 1570;
let targetX = 1570;
let min;
let max;
let click = 0;

let life = 100; ///will be its hp 0 means the tongue will break.
let wobbly = 100; //if wobbly= like over 100/extend too far then the tongue will go up and down.
let moving = false;
let wobble = 1;
let wobbleTimer = 0; //each amount of set seconds will trigger opposite direction
let wobbleLoop;

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
    y: 400,
    size: 80,
    speed: 10,
    velocity: 10,
    // Determines how the tongue moves each frame
    state: "idle", // State can be: idle, outbound, inbound
  },
};

function setup() {
  createCanvas(1600, 900);

  frameRate(50); // i think a lower framerate will be all around better

  tongueX = 1570;
  targetX = 1570;
  min = 50;
  max = 1580;

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
  text(life, width / 4, height / 4);
  text(wobbleTimer, width / 4.5, height / 4.5);
  text(wobbleLoop, width / 4.75, height / 4.75);

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
  //frog.tongue.y = frog.body.y;

  if (keyIsPressed) {
    if (keyCode === 65) {
      targetX -= 5;
    } else if (keyCode === 68) {
      targetX += 5;
    }
  }
  targetX = targetX + 2;
  targetX = constrain(targetX, min, max);

  tongueX += (targetX - tongueX) * easing;
}

function wobbleTongue() {
  //do not know how but this works. this can be a another to solve my problem
  // of wanting the tongue to move up and down past a certain widht
  //frog.tongue.y = mouseY;
  //but that is not the way i wanted it to be. i want it to move by istelf out
  //of the sheer weight of the longue stone tongue.

  /*let cycleLength = 100;
  let rawValue = frameCount % cycleLength;

  loopValue = rawValue / (cycleLength - 1);
*/

  //frog.tongue.y = frog.body.y;
  //trigger an event when the tongue is extended too far
  if (tongueX <= 1300) {
    life -= 0.025; //this make somwehat of a second (minus one second)
    moving = !moving;
    wobbleTimer += 0.025;
  } else {
    frog.tongue.y = frog.body.y;
    wobbleTimer = 0;
  }
  if (moving) {
    frog.tongue.y += wobbleTimer;
  }

  //if(frog.tongue.y )
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
