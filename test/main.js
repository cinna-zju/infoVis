var w = 1400;
var h = 900;

var page;

var table, sub0;
var barWidth = 8;
var spacing = 10;

//colors
var c1, c2, c3, grey;

// num currently chose,
var choose, hover;
let current_id;

// info about bar chart
var barX = new Array(14);
var barW = new Array(14);

var app_num, start, end, type, sub, item;

var rec_num = new Array();
var sub0_item = new Array();

function preload() {
  table = loadTable("forSub.csv", "csv", "header");
  sub0 = loadTable("Sub0.csv", "csv", "header");

}

function setup() {
  var mCanvas = createCanvas(w, h);
  mCanvas.parent("canvas");
  background(255);
  frameRate(5);
  page = 0;

  choose = 0;
  current_id = 10;
  sub0_item = [0, 36, 48, 96, 108, 144, 168, 240, 264, 312, 336, 360, 432, 576, 620];

  //from table
  app_num = table.getColumn("apparition_amount");
  start = table.getColumn("transition_start");
  end = table.getColumn("transition_end");
  type = table.getColumn("technique");
  sub = table.getColumn("subject");
  item = table.getColumn("item");

  //from sub0
  app = sub0.getColumn("");
  time = sub0.getColumn("time_item_selected");
  console.log(sub0.getRowCount() + " total rows in sub0");
  console.log(sub0.getColumnCount() + " total cols in sub0");


  //set text
  textSize(12);


  c1 = color(0x32, 0xd3, 0xeb);
  c2 = color(0xff, 0x7c, 0x7c);
  c3 = color(0xfe, 0xb6, 0x4d);
  grey = color(0x7f, 0x7f, 0x7f);


  rec_num.push(0);
  var t = 0;
  for (var i = 0; i < app_num.length; i++){
    if (sub[i] === (t + 1).toString()) {
      rec_num.push(i);
      t++;
    }
  }
  rec_num.push(app_num.length);
}


function draw() {
  clear();

  if (page === 0) {
    for (var i = 0; i < 5; i++){
      for (var j = 0; j < 9; j++){
        if (i * 9 + j < 41) {
          drawSub(i * 9 + j, 100 + 150 * j, 100 + 150 * i);
  
          text('sub' + parseInt(i * 9 + j), 100+150*j, 230+150*i);
          
        }      
      }
    }  
  }

  if (page === 1) {
    text(current_id, 100, 530);
    if (mouseX < 300 && mouseX > 0) {
      var t = Math.floor((mouseY - 300) / barWidth);
      if (t < 14 && t >= 0) {
        if (mouseIsPressed) {
          choose = t;
        }
        hover = t;
      } else {
        hover = -1;
      }
    }
    //drawLineChart(subset(time, sub0_item[choose], sub0_item[choose + 1]), 500, 200);
    if (current_id > 1) {
      drawSub(current_id - 1, 150, 20);    
    }
    drawCenterSub(current_id, 300);
    if (current_id < 41) {
      drawSub(current_id + 1, 150, 580);    
    }
    highLight(hover);
  }


}

function mousePressed() {
  var x = Math.floor((mouseX - 100) / 150);
  var y = Math.floor((mouseY - 100) / 150);

  if (x + 9 * y < 41 && page === 0) {
    page = 1;
    current_id = x + 9 * y;
    console.log(current_id);
    barWidth = 15;
  }

  if (mouseX < 50 && mouseY < 50 && page === 1) {
    page = 0;
    barWidth = 8;
  }
}


function highLight(y) {
  if (hover !== -1) {
    stroke(0);
    noFill();
    rect(barX[y], 300 + barWidth * y, barW[y], barWidth);
  }
}

function drawSub(id, x, y) {
  id = parseInt(id);
  var t = 0;

  c1.setAlpha(255);
  c2.setAlpha(255);
  c3.setAlpha(255);
  
  for (var i = parseInt(rec_num[id]); i < parseInt(rec_num[id+1]); i++){
    if (start[i].toString() !== "-1" && end[i].toString() !== "-1") {
      noStroke();
      drawGrid(parseInt(app_num[i])/2, parseInt(start[i])/2, parseInt(end[i])/2, x, y + barWidth * t);
      fill(0);
      // text(item[i], x, y + barWidth * (t+1));

      barX[t] = x - parseInt(start[i]);
      barW[t] = app_num[i];
    } else {
      noStroke();
      fill(c1);
      if (page === 0) {
        rect(x, y + barWidth * t, app_num[i]/2, barWidth);
        barX[t] = x - app_num[i];
        barW[t] = app_num[i];
      }
      if (page === 1) {
        rect(150, y + barWidth * t, -app_num[i], barWidth);
        
      }


      fill(0);
      // text(item[i], x, y + barWidth * (t+1));
    }
    t++;
  }
}




function drawGrid(num, start, end, x, y) {
  if (page === 0) {
    fill(c1);
    rect(x, y, start, barWidth);
  
    fill(c2);
    rect(x+start, y, end-start, barWidth);
  
    fill(c3);
    rect(x+end, y, num-end, barWidth);
  }
  if (page === 1) {
    fill(c1);
    rect(x, y, -start, barWidth);
  
    fill(c2);
    rect(x, y, end-start, barWidth);
  
    fill(c3);
    rect(x+end-start, y, num-end, barWidth);
  }




}




function keyReleased() {
  if (keyCode === 83 && current_id>0) {
    current_id--;
  }

  if (keyCode === 87 && current_id<41) {
    current_id++;
  }
  return false;
}


function drawCenterSub(id, y) {
  id = parseInt(id);
  var t = 0;

  c1.setAlpha(255);
  c2.setAlpha(255);
  c3.setAlpha(255);
  
  for (var i = parseInt(rec_num[id]); i < parseInt(rec_num[id+1]); i++){
    if (start[i].toString() !== "-1" && end[i].toString() !== "-1") {
      noStroke();
      drawGrid(parseInt(app_num[i]), parseInt(start[i]), parseInt(end[i]), 150, y + barWidth * t);
      fill(0);
      text(item[i], 150, y + barWidth * (t+1));

      barX[t] = 150 - parseInt(start[i]);
      barW[t] = app_num[i];
    } else {
      noStroke();
      fill(c1);
      rect(150, y + barWidth * t, -app_num[i], barWidth);
      barX[t] = 150 - app_num[i];
      barW[t] = app_num[i];

      fill(0);
      text(item[i], 150, y + barWidth * (t+1));
    }
    t++;
  }
}


function drawLineChart(data, x, y0) {
  var minTime = min(data);
  var maxTime = max(data);
  var len = data.length;
  var y0;

  stroke(0);
  line(x-1, y0, x-1 + len*spacing, y0);
  line(x - 1, y0, x - 1, 10);
  triangle(x - 1, 10, x - 7, 20, x + 5, 20);
  triangle(x - 1 + len * spacing, y0, x - 11 + len * spacing, y0 + 6, x - 11 + len * spacing, y0 - 6);

  noStroke();
  
  fill(c1);
  beginShape();
  vertex(x, y0);
  for (var i = 0; i < round(len/3); i++){
    y = y0 - map(data[i], minTime, maxTime, 0, 150);
    vertex(x, y);
    x = x + spacing;

  }
  x = x - spacing;
  vertex(x, y0);
  endShape(CLOSE);

  fill(c2);
  beginShape();
  vertex(x, y0);
  for (var i = round(len/3); i < round(2*len/3); i++){
    y = y0 - map(data[i], minTime, maxTime, 0, 150);
    vertex(x, y);
    x = x + spacing;

  }
  x = x - spacing;
  vertex(x, y0);
  endShape(CLOSE);

  fill(c3);
  beginShape();
  vertex(x, y0);
  for (var i = round(2*len/3); i < len; i++){
    y = y0 - map(data[i], minTime, maxTime, 0, 150);
    vertex(x, y);
    x = x + spacing;

  }
  x = x - spacing;
  vertex(x, y0);
  endShape(CLOSE);

}


