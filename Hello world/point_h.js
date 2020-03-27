"use strict";
let w, h;
let creator;
let fpsdisp;
let font;
function preload() {
  font = loadFont(
    "https://dl.dropbox.com/s/p2mlnifnfbcfvca/Livvic-Regular.ttf?dl=0"
  );
}

let points = [];
let bounds;
let tw;

class TextPoint {
  // x and y indicate the actual position of the points on the text
  // rx and ry indicate the random position where the point start
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rx = random(-width / 2 + (bounds.x * width) / bounds.w, width);
    this.ry = random(-height / 2 + (bounds.y * height) / bounds.h, height);
    this.radius;
    this.alpha = 255;
  }
  show() {
    noStroke();
    fill(random(255), random(255), random(255), this.alpha);
    ellipse(this.rx, this.ry, this.radius, this.radius);
  }
  // points fly in from a random position (rx/ry) to the actual position (x/y)
  update() {
    if (this.rx < this.x) {
      this.rx += (this.x - this.rx) * 0.025;
    }
    if (this.ry < this.y) {
      this.ry += (this.y - this.ry) * 0.025;
    }
    if (this.rx > this.x) {
      this.rx -= (this.rx - this.x) * 0.025;
    }
    if (this.ry > this.y) {
      this.ry -= (this.ry - this.y) * 0.025;
    }

    this.radius = random(4);
    if (this.alpha > 0) this.alpha -= 0.4;
  }
}
var index = 0;
var t = [
    "Hello World"
];

function setup() {
  w = windowWidth;
  h = windowHeight;

  createCanvas(w, h);
  fpsdisp = createSpan().id("fps");
  creator = createSpan().id("creator");
  creator.html("created by Tócsa");
  setText(t[0]); // start first text item
}

function draw() {
  background(50, 30);
  fpsdisp.html("fps: " + floor(frameRate()));
  // center on screen
  translate(width / 2 - bounds.w / 2, height / 2 + bounds.h / 2);
  for (let p of points) {
    p.show();
    p.update();
  }
  if (points[0].alpha <= 100) {
    // do not show next text item before opacity <= 100
    if (index + 1 < t.length) index += 1;
    // next text item
    else index = 0; // go back to first text item
    setText(t[index]);
  }
}

function setText(txt) {
  if (txt.length < 7) tw = 90;
  // shorter text can be a bit bigger
  else tw = 70;
  // calculate the points that form the text and store them in an array
  points = font.textToPoints(txt, 0, 0, tw, {
    sampleFactor: 0.25,
    simplifyThreshold: 0
  });
  // calculate the bounding box for the text, to be used to center it in screen
  bounds = font.textBounds(txt, 0, 0, tw);
  // make an array of the points
  for (let i = 0; i < points.length; i++) {
    points[i] = new TextPoint(points[i].x, points[i].y);
  }
}
