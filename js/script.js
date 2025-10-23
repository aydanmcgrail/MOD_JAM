"use strict";

let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;

let timer = 500;

function setup() {
  createCanvas(1600, 900);

  //frameRate(60);

  fly1 = createFly();
  fly2 = createFly();
  fly3 = createFly();
}

function createFly() {
  let fly = {
    x: random(50, 600),
    y: random(200, 500),
    size: 20,
    speedX: 10,
    speedY: 10,
  };
  return fly;
}

function draw() {
  background("#87ceeb");

  let s = millis() / 1000;
  moveFly(fly1);
  moveFly(fly2);
  moveFly(fly3);

  //draw the flies
  drawFly(fly1);
  drawFly(fly2);
  drawFly(fly3);
}

function moveFly(fly) {
  fly.x += random(-fly.speedX, fly.speedX);
  fly.y += random(-fly.speedY, fly.speedY);
}

function drawFly(fly) {
  push();
  noStroke();
  fill(255);
  rect(fly.x, fly.y, fly.size);
  pop();
}
