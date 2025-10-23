"use strict";

let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

let interval = 60;

function setup() {
  createCanvas(1600, 900);

  //frameRate(60);

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
