//x trial, y time_item_selected

var w = 1300;
var h = 700;

var table;
var minTime;
var maxTime;
var spacing = 10;

var c1, c2, c3;

var btn;
var isNorm = false;


function preload() {
  table = loadTable("sub0.csv", "csv", "header");
}

function setup() {
  createCanvas(w, h);

  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total cols in table");

  app = table.getColumn("");
  time = table.getColumn("time_item_selected");


  c1 = color(0x60, 0xac, 0xfc);
  c2 = color(0x5b, 0xc4, 0x9f);
  c3 = color(0xfe, 0xb6, 0x4d);
}

function onCli() {
  isNorm = !isNorm;
}

function draw() {


  stroke('#fff');
  fill('#f7f7f7');
  rect(100, 300, 650, 200);
  rect(100, 0, 650, 200);
  if (isNorm === true) {
    drawGridNorm(subset(time, 0, 36), 100, 300);
    
  } else {
    drawGrid(subset(time, 0, 36), 100, 300);
    drawGrid(subset(time, 36, 12), 100, 310);
    drawGrid(subset(time, 48, 50), 100, 320);
  }
  
  drawSummary();

  if (mouseX < 750 && mouseX > 100) {
    if (mouseY < 310 && mouseY > 300) {
          
      fill('#f7f7f7');
      rect(100, 0, 650, 200);
      noStroke();
      rect(100, 300, 650, 200);

      drawLineChart(subset(time, 0, 36), 100, 0);
      drawGrid(subset(time, 36, 12), 100, 310);
      drawGrid(subset(time, 48, 50), 100, 320);
      // translate(0,-2);

      drawGrid(subset(time, 0, 36), 100, 300);


    }
    if (mouseY < 320 && mouseY > 310) {
          
      fill('#f7f7f7');
      rect(100, 0, 650, 200);
      drawLineChart(subset(time, 36, 12), 100, 0);
    }
    if (mouseY < 330 && mouseY > 320) {
          
      fill('#f7f7f7');
      rect(100, 0, 650, 200);
      drawLineChart(subset(time, 48, 50), 100, 0);
    }
  }
  
  
}

function drawGrid(data, x, y) {
  minTime = min(data);
  maxTime = max(data);
  len = data.length;
  // console.log(minTime, maxTime);

  for (var i = 0; i < round(len/3); i++){
    stroke('#fff');
    c1.setAlpha(map(data[i], minTime, maxTime, 128, 255));
    fill(c1);
    rect(x+1, y+1, 9, 9);
    x = x + spacing;
  }

  for (var i = round(len/3); i < round(2*len/3); i++){
    stroke('#fff');
    c2.setAlpha(map(data[i], minTime, maxTime, 128, 255));
    fill(c2);
    rect(x+1, y+1, 9, 9);
    x = x + spacing;
  }

  for (var i = round(2*len/3); i < len; i++){
    stroke('#fff');
    c3.setAlpha(map(data[i], minTime, maxTime, 128, 255));
    fill(c3);
    rect(x+1, y+1, 9, 9);
    x = x + spacing;
  }

}

function drawGridNorm(data, x, y) {
  stroke('#fff');
  fill('#f7f7f7');
  rect(100, 300, 650, 200);
  var t = x;

  noStroke();
  fill(c1);
  rect(x, y, map(2, 0, 10, 0, 600), 9);

  
  x += map(2, 0, 10, 0, 600);
  fill(c2);
  rect(x, y, map(4, 0, 10, 0, 600), 9);


  x += map(4, 0, 10, 0, 600);
  fill(c3);
  rect(x, y, map(4, 0, 10, 0, 600), 9);

}

function drawLineChart(data, x, dy) {
  minTime = min(data);
  maxTime = max(data);
  len = data.length;

  noStroke();
  
  fill(c1);
  beginShape();
  vertex(x, 200-dy);
  for (var i = 0; i < round(len/3); i++){
    y = 200 - map(data[i], minTime, maxTime, 0, 150);
    vertex(x, y-dy);
    x = x + spacing;

  }
  x = x - spacing;
  vertex(x, 200-dy);
  endShape(CLOSE);

  fill(c2);
  beginShape();
  vertex(x, 200-dy);
  for (var i = round(len/3); i < round(2*len/3); i++){
    y = 200 - map(data[i], minTime, maxTime, 0, 150);
    vertex(x, y-dy);
    x = x + spacing;

  }
  x = x - spacing;
  vertex(x, 200-dy);
  endShape(CLOSE);

  fill(c3);
  beginShape();
  vertex(x, 200-dy);
  for (var i = round(2*len/3); i < len; i++){
    y = 200 - map(data[i], minTime, maxTime, 0, 150);
    vertex(x, y-dy);
    x = x + spacing;

  }
  x = x - spacing;
  vertex(x, 200-dy);
  endShape(CLOSE);
  
}

function drawSummary() {
  //fig 3
  fill('#f7f7f7');
  rect(800, 0, 600, 400);
  c1.setAlpha(128);
  c2.setAlpha(128);
  c3.setAlpha(128);

  drawLineChart(subset(time, 0, 36), 800, -60);
  drawLineChart(subset(time, 36, 12), 850, 0);
  drawLineChart(subset(time, 48, 50), 900, 60);

  stroke(0);
  line(800, 260, 900, 140);
  line(800, 260, 1400, 260);
  line(850, 200, 1400, 200);
  line(900, 140, 1400, 140);

  c1.setAlpha(255);
  c2.setAlpha(255);
  c3.setAlpha(255);



}