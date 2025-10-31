"use strict";

let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

//this is for the easing
let tongueX = 1500;
let targetX = 1500;
let min;
let max;

let easing = 0.008;
let easing2 = 0.002;

let life = 100; ///will be its hp 0 means the tongue will break. GAME OVER

let wobble = 1;
let wobbleTimer = 0; //each amount of set seconds will trigger opposite direction
let wobbleLoop;

const frog = {
  // The frog's body has a position and size
  body: {
    x: 1500,
    y: 400,
    size: 1,
  },
  // The frog's tongue has a position, size, speed, and state
  tongue: {
    x: undefined,
    y: 400,
    size: 70,
    speed: 10,
    velocity: 10,
    // Determines how the tongue moves each frame
    state: "idle", // State can be: idle, outbound, inbound
    angle: 0,
  },
};

let img1;
let img2;
let opacity1 = 0; //i will up the value so img1 will become visible
let opacity2 = 255; // i will lower the value so img1 will become transparent

function preload() {
  img1 = loadImage("./assets/images/frog.png");
  img2 = loadImage("./assets/images/frogidle.png");
}

function setup() {
  createCanvas(1600, 900);

  tongueX = 1500;
  targetX = 1500;
  min = 50;
  max = 1500;

  angleMode(DEGREES);

  frameRate(50); // i think a lower framerate will be all around better does not matter actually

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
    speedX: 4,
    speedY: 4,
    velocity: { x: 0, y: 0 },
  };
  return fly;
}

function draw() {
  background("#87ceeb");

  //checkLife();
  text(life, width / 4, height / 4);
  text(wobbleTimer, width / 4.5, height / 4.5);
  text(wobbleLoop, width / 4.75, height / 4.75);
  text(opacity2, width / 2.75, height / 2.75);

  moveFly(fly1);
  moveFly(fly2);
  moveFly(fly3);
  moveFly(fly4);

  //draw the frog
  drawFrog(); //frog is behind the tongue since it will come out of mouth
  drawFrogOpen();

  //move the tongue
  moveTongue();
  moveFrog();
  wobbleTongue();

  drawFrogIdle(); //the idle image of the frog is hiding the tongue

  //draw the flies
  drawFly(fly1);
  drawFly(fly2);
  drawFly(fly3);
  drawFly(fly4);

  flyLimits(fly1);
  flyLimits(fly2);
  flyLimits(fly3);
  flyLimits(fly4);
}

function resetFly() {
  fly.x;
  fly.y;
}

function moveFly(fly) {
  if (frameCount % 50 === 0) {
    fly.velocity.x = random(-fly.speedX, fly.speedX);
    fly.velocity.y = random(-fly.speedY, fly.speedY);
    if (fly.x > width) {
      fly.x -= fly.speedX;
    }

    if (fly.x < 0) {
      fly.x += fly.speedX;
    }
    if (fly.y > height) {
      fly.y -= fly.speedY;
    }
    if (fly.y < 0) {
      fly.y += fly.speedY;
    }
  }
  fly.x += fly.velocity.x;
  fly.y += fly.velocity.y;
}
//**the moves seems to be triggered every frame instead of every
// seconds as stated above for the regular movements that do not.
//it jitters when the flies hit the limit of the function flylimits.
function flyLimits(fly) {
  if (fly.x > width) {
    fly.x -= fly.speedX;
  }

  if (fly.x < 0) {
    fly.x += fly.speedX;
  }
  if (fly.y > height) {
    fly.y -= fly.speedY;
  }
  if (fly.y < 0) {
    fly.y += fly.speedY;
  }
}

function drawFly(fly) {
  push();
  noStroke();
  fill(255);
  rectMode(CENTER);
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
  //but that is not the way i wanted it to be. i want it to move by istelf out
  //of the sheer weight of the long stone tongue.

  //trigger an event when the tongue is extended too far
  if (tongueX <= 1300) {
    life -= 0.025; //this make somwehat of a second (minus one second)
    wobbleTimer += 0.025;
  } else {
    frog.tongue.y = frog.body.y;
    wobbleTimer = 0;
  }

  //trigger a new image when the tongue is resting at the base position.(x=1500px)
  if (tongueX <= 1475) {
    //close to rest position,0 tongue extension (1500px) && img1 is showing(true)
    opacity2 -= 25;
    opacity1 = 255;
  } else {
    opacity2 = 255;
    opacity1 = 0;
    //img1.hide();
    // img2.show();
  }

  frog.tongue.y = frog.body.y;
  ///////////////////////////////sine wave ///////////////////////////////////
  ///////////////////////////////sine wave ///////////////////////////////////
  // How fast it wobble.
  // 10 degrees per frame at the centre
  // 30 degrees per frame at the limit
  const frequency = map(tongueX, width / 2, 100, 10, 30, true);
  frog.tongue.angle += frequency;

  // Calculate the sine, this will be a number between -1 and 1
  const sine = sin(frog.tongue.angle);

  // Calculate how big the motion is
  // 0 wobble at the centre
  // 10 pixels up and down at the limit
  const amplitude = map(tongueX, width / 2, 100, 0, 10, true);

  // How much to change y this frame
  const offset = sine * amplitude;

  /////////////////end of sine wave ///////////////////////////////////////////
  /////////////////end of sine wave ///////////////////////////////////////////

  // Draw the tongue tip
  push();
  fill("#7e4c4cff");
  noStroke();
  ellipse(tongueX, frog.tongue.y + offset, frog.tongue.size);
  pop();

  // Draw the rest of the tongue
  push();
  stroke("#7e4c4cff");
  strokeWeight(frog.tongue.size);
  line(tongueX, frog.tongue.y + offset, frog.body.x, frog.body.y);
  pop();
}

function moveFrog() {
  //frog.body.y = mouseY;
  let targetY = mouseY;
  let dx = targetY - frog.body.y;
  frog.body.y += dx * easing2;
}

function drawFrog() {
  // Draw the frog's body
  push();
  fill("#000000ff");
  noStroke();
  //i will keep the original round frog there so I  dont have to
  // change the other values related to it.
  ellipse(frog.body.x, frog.body.y, frog.body.size);
  pop();
}

function drawFrogOpen() {
  push();
  tint(255, opacity1);
  image(img1, frog.body.x - 170, frog.body.y - 130);
  pop(); //not even sure i need to push and pop
}

function drawFrogIdle() {
  push();
  tint(255, opacity2);
  image(img2, frog.body.x - 170, frog.body.y - 130);
  pop(); //not even sure i need to push and pop
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
