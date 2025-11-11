"use strict";

//reset function////
let xPos = 62;
let yPos = 934;
let clickWidth = 52;
let clickHeight = 52;

//for the flies creation///
let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

////for health points
let colorGreen = "#00ff00";
let colorRed = "#ff0000";

let life = 100;
let lifeMoving = false;
let minLife = 0;
let maxLife = 100;
let gameOverY = -10;
let minLifeY = -500;
let maxLifeY = 550;
let tongueSecurity = 0;

//this is for the easing and the tongue moving
let tongueX = 1450;
let targetX = 1450;
let min;
let max;
let easing = 0.01;
let easing2 = 0.008;
let easing2Min = 0.001;
let easing2Max = 0.008;
let easing2Penality = 0;

/////////////////////the effects the tongue is subject to//////////////////////
/////////////////////the effects the tongue is subject to//////////////////////
/////////////////////the effects the tongue is subject to//////////////////////

let amplitudeTongueNumber = 40; //starts at 30 will go lower with stone transformation.

/////////////////////////////////frog///////////////////////////////
const frog = {
  // The frog's body has a position and size
  body: {
    x: 1450,
    y: 400,
    size: 1,
    minY: 100,
    maxY: 730,
  },
  // The frog's tongue has a position, size, speed, and state
  tongue: {
    x: undefined,
    y: 400,
    size: 70,
    speed: 10, //this might do nothing
    velocity: 10,
    tongueHitFly: false, // State can be: idle, outbound, inbound
    angle: 0, //for the sine wave
    fill: { r: 128, g: 72, b: 80 },
    maxR: 122,
    minR: 128,
    maxG: 122,
    minG: 72,
    maxB: 122,
    minB: 80,
  }
};

///////////////////////////////////images and sounds//////////////////////////////
///////////////////////////////////images and sounds//////////////////////////////
///////////////////////////////////images and sounds//////////////////////////////
let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let img7;
let img8;

let opacityImg1 = 0; //i will up the value so img1 will become visible
let opacityImg2 = 255; // i will lower the value so img1 will become transparent
let opacityImg5 = 255;
let opacitybackground = 0; //when game over the screen will blacken.
let maxBlacken = 175;
let minBlacken = 0;

function preload() {
  img1 = loadImage("./assets/images/frog.png");
  img2 = loadImage("./assets/images/frogidle.png");
  img3 = loadImage("./assets/images/floor.png");
  img4 = loadImage("./assets/images/mouche.png");
  img5 = loadImage("./assets/images/frogstone.png");
  img6 = loadImage("./assets/images/infobar.png");
  img7 = loadImage("./assets/images/moucheroche.png");
  img8 = loadImage("./assets/images/frogidlestone.png");
}

/////////////////////////////////////setup///////////////////////////////////////////
/////////////////////////////////////setup///////////////////////////////////////////
/////////////////////////////////////setup///////////////////////////////////////////
function setup() {
  createCanvas(1600, 1000);

  tongueX = 1450;
  targetX = 1450;
  min = 50;
  max = 1450;

  angleMode(DEGREES);

  //frameRate(50); // i think a lower framerate will be all around better does not matter actually

  fly1 = createFly();
  fly2 = createFly();
  fly3 = createFly();
  fly4 = createFly();
}

function createFly() {
  let fly = {
    x: random(150, 800),
    y: random(150, 700),
    size: 100,
    speedX: 6,
    speedY: 6,
    velocity: { x: 0, y: 0 },
    squareRight: "#7fe97fff",
    squareCenter: "#7fe97fff",
    squareLeft: "#7fe97fff",
    opacityFly: 255,
    flyHit: 0,
  };
  return fly;
}

//////////////////////////////////////draw///////////////////////////////////////////
//////////////////////////////////////draw///////////////////////////////////////////
//////////////////////////////////////draw///////////////////////////////////////////
function draw() {
  background("#272727ff");
  push();
  image(img3, 0, 0); //the floor
  pop();

  moveFly(fly1);
  moveFly(fly2);
  moveFly(fly3);
  moveFly(fly4);

  //draw the frog
  drawFrog(); //frog is behind the tongue since it will come out of mouth
  drawFrogStoned(); //this stone frog is behind the not stone looking frog pngs
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

  checkOverlap(frog, fly1);
  checkOverlap(frog, fly2);
  checkOverlap(frog, fly3);
  checkOverlap(frog, fly4);

  push();
  fill(0, 0, 0, opacitybackground);
  rect(800, 400, 1600, 1000);
  pop();

  push();
  image(img6, 0, 853);
  pop();

  push();
  fill("red");
  ellipse(xPos, yPos, clickWidth, clickHeight);
  pop();

  textSize(50);
  textStyle(BOLD);
  textFont("Courier New");
  text("R", 47, 949);

  checkLife();
}

function moveFly(fly) {
  if (frameCount % 50 === 0) {
    fly.velocity.x = random(-fly.speedX, fly.speedX);
    fly.velocity.y = random(-fly.speedY, fly.speedY);
  }
  //here i do not want flies to get too close to frog
  if (fly.x > 1300) {
    fly.velocity.x = fly.velocity.x * -1;
  }
  if (fly.x < 100) {
    fly.velocity.x = fly.velocity.x * -1;
  }

  if (fly.y > 800 || fly.y < 100) {
    fly.velocity.y = fly.velocity.y * -1;
  }

  fly.x += fly.velocity.x;
  fly.y += fly.velocity.y;
}

function drawFly(fly) {
  //push();
  noStroke();
  fill(255);
  rectMode(CENTER);
  ellipse(fly.x, fly.y, fly.size); //the collision is with the ellipse not the png of the flies

  image(img7, fly.x - 90, fly.y - 100);

  push();
  tint(255, fly.opacityFly);
  //the normal fly png sits on top. if they turn to stone the
  // opacity goes to 0 and shows the png behind
  image(img4, fly.x - 90, fly.y - 100);
  pop();

  textSize(24);
  text(fly.flyHit, fly.x + 110, fly.y + 130);

  push();
  fill(fly.squareRight);
  rect(fly.x + 20, fly.y - 110, 15);
  pop();

  push();
  fill(fly.squareCenter);
  rect(fly.x, fly.y - 110, 15);
  pop();

  push();
  fill(fly.squareLeft);
  rect(fly.x - 20, fly.y - 110, 15);
  pop();
}

function moveTongue() {
  // Tongue matches the frog's y
  frog.tongue.y = frog.body.y;

  //targetX = mouseX;  ////for moving faster with mouse

  if (life <= 0) {
    targetX;
    tongueX;
  } else {
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

}

function checkLife() {
  push();
  textSize(42);
  textStyle(BOLD);
  textFont("Courier New");
  fill(colorGreen);
  text(life.toFixed(0), 1498, 948); ///life=100,will be its hp 0 means the tongue will break. GAME OVER
  fill(colorRed);
  textSize(275);
  stroke(0);
  strokeWeight(8);
  textStyle(ITALIC);
  text("GAME OVER", 20, gameOverY);
  pop();

  life = constrain(life, minLife, maxLife);

  if (lifeMoving === true) {
    life -= tongueSecurity;
  }
  tongueSecurity = (1590 - tongueX) / 15000;
  easing2Penality = (100 - life) / 10000000;

  textSize(32);
  text(tongueX, 200, 100);
  text(tongueSecurity, 200, 200);
  text(easing2Penality, 200, 300);
  text(easing2, 200, 400);


  //tongueX = tongueSecurity;

  if (life <= 0) {
    gameOverY += 1;
    opacitybackground += 0.5;
  } else {
    gameOverY;
    opacitybackground;
  }
  opacitybackground = constrain(opacitybackground, minBlacken, maxBlacken);
  gameOverY = constrain(gameOverY, minLifeY, maxLifeY);
}

function wobbleTongue() {
  //trigger an event when the tongue is extended too far
  if (tongueX <= 1300) {
    life -= 0.0008; //this make somwehat of a second (minus one second)
    lifeMoving = true;
  } else {
    lifeMoving = false;
  }

  if (tongueX >= 1400) {
    life += 0.05;
  }
  //trigger a new image when the tongue is resting at the base position.(x=1500px)
  if (tongueX <= 1440) {
    //close to rest position,0 tongue extension (1500px) && img1 is showing(true)
    opacityImg2 -= 25;
    opacityImg1 = 255;
  } else {
    opacityImg2 = 255;
    opacityImg1 = 0;
  }

  if (life <= 0) {
    opacityImg2 = 0;
    opacityImg1 = 0;
  }

  ///////////////////////////////sine wave ///////////////////////////////////
  ///////////////////////////////sine wave ///////////////////////////////////
  // How fast it wobble.
  // 10 degrees per frame at the centre
  // 30 degrees per frame at the limit
  let frequency = map(tongueX, width / 2, 200, 10, 30, true);
  frog.tongue.angle += frequency;

  // Calculate the sine, this will be a number between -1 and 1
  const sine = sin(frog.tongue.angle);

  // Calculate how big the motion is
  // 0 wobble at the centre
  // 10 pixels up and down at the limit
  let amplitude = map(tongueX, width / 2, 200, 0, amplitudeTongueNumber, true);

  // How much to change y this frame
  const offset = sine * amplitude;

  /////////////////end of sine wave ///////////////////////////////////////////
  /////////////////end of sine wave ///////////////////////////////////////////

  // Draw the tongue tip
  push();
  fill(frog.tongue.fill.r, frog.tongue.fill.g, frog.tongue.fill.b);
  noStroke();
  ellipse(tongueX, frog.tongue.y + offset, frog.tongue.size);
  pop();

  // Draw the rest of the tongue
  push();
  stroke(frog.tongue.fill.r, frog.tongue.fill.g, frog.tongue.fill.b);
  strokeWeight(frog.tongue.size);
  line(tongueX, frog.tongue.y + offset, frog.body.x, frog.body.y);
  pop();
}

function moveFrog() {
  //frog.body.y = mouseY;

  if (life <= 0) {
    frog.body.y;
    frog.tongue.fill.r = 122;
    frog.tongue.fill.g = 122;
    frog.tongue.fill.b = 122;
  } else {
    let targetY = mouseY;
    let dx = targetY - frog.body.y;

    easing2 -= easing2Penality;
    easing2 = constrain(easing2, easing2Min, easing2Max);

    frog.body.y += dx * easing2;

    frog.body.y = constrain(frog.body.y, frog.body.minY, frog.body.maxY);
    frog.tongue.fill.r;
    frog.tongue.fill.g;
    frog.tongue.fill.b;
  }
  if (life >= 95) {
    easing2 += 0.0002;
  }
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
  tint(255, opacityImg1);
  image(img1, frog.body.x - 155, frog.body.y - 120);
  pop(); //not even sure i need to push and pop
}

function drawFrogIdle() {
  push();
  tint(255, opacityImg2);
  image(img2, frog.body.x - 155, frog.body.y - 120);
  pop(); //not even sure i need to push and pop
}

function drawFrogStoned() {
  push();
  tint(255, opacityImg5);
  image(img5, frog.body.x - 155, frog.body.y - 120);
  pop(); //not even sure i need to push and pop
}

/**
 * Handles the tongue overlapping the fly
 */
function checkOverlap(frog, fly) {
  // Get distance from tongue to fly
  const d = dist(tongueX, frog.tongue.y, fly.x, fly.y);
  // Check if it's an overlap
  const hit = d < frog.tongue.size / 2 + fly.size / 2;
  if (hit) {
    fly.squareRight = "#d13c3cff";
    fly.flyHit += 0.05; //for me to see if collision works and it's value
    //frog.tongue.tongueHitFly = true;
    fly.velocity.x = -3; //it goes opposite from the tongue
    fly.opacityFly = 150;
    fly.speedX = 3;
    fly.speedY = 3;
    fly.state = "inbound";
    targetX += 10;
  } else {
    frog.tongue.tongueHitFly = false;
    targetX = targetX;
    //fly.flyTouch = false;
  }

  if (hit && fly.flyHit > 2.5) {
    fly.squareCenter = "#d13c3cff";
    //frog.tongue.tongueHitFly = true; //the tongue is hitting the fly
    fly.velocity.x = -3; //it goes opposite from the tongue
    fly.opacityFly = 50; //turns the fly more into stone
    fly.speedX = 2; //since it turned into stone it is slower
    fly.speedY = 2; //since it turned into stone it is slower
    targetX += 10;
  } else {
    frog.tongue.tongueHitFly = false; //the tongue is not in collision with any flies
    targetX = targetX;
  }

  if (hit && fly.flyHit > 3.5) {
    fly.squareLeft = "#d13c3cff";
    //frog.tongue.tongueHitFly = true; //the tongue is hitting the fly
    fly.velocity.x = -0.25; //it goes opposite from the tongue
    fly.opacityFly = 0; //turns the fly more into stone
    fly.speedX = 0; //fully turned to stone so does not move
    fly.speedY = 0; //fully turned to stone so does not move
    targetX += 10;
  } else {
    frog.tongue.tongueHitFly = false; //the tongue is not in collision with any flies
    targetX = targetX;
  }
}

function keyPressed() {
  if (keyIsPressed) {
    if (keyCode === 82) {
      location.reload();
    }
  }
}
