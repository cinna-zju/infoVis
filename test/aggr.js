//x trial, y time_item_selected

var w = 4000;
var h = 10000;

var table;
var spacing = 10;

var ex = new Array(3);
var item = new Array(14);
var btn1, btn2, btn3;

var c1, c2, c3, grey;

var app_num, start, end, type, sub, item;

function preload() {
  table = loadTable("aggr_2.csv", "csv", "header");
}

function setup() {
  var mCanvas = createCanvas(w, h);
  mCanvas.parent("canvas");
  noLoop();
  background(255);

  btn1 = createButton('By technique');
  btn1.position(10, 0);
  btn1.mousePressed(drawByTech);

  btn2 = createButton('By subject');
  btn2.position(100, 0);
  btn2.mousePressed(drawBySub);

  btn3 = createButton('By item');
  btn3.position(190, 0);
  btn3.mousePressed(drawByItem);

  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total cols in table");

  app_num = table.getColumn("apparition_amount");
  start = table.getColumn("transition_start");
  end = table.getColumn("transition_end");
  type = table.getColumn("technique");
  sub = table.getColumn("subject");
  item = table.getColumn("item");

  c1 = color(0x32, 0xd3, 0xeb);
  c2 = color(0xff, 0x7c, 0x7c);
  c3 = color(0xfe, 0xb6, 0x4d);
  grey = color(0x7f, 0x7f, 0x7f);
}

function groupByTech() {
  ex[0] = new Array();
  ex[1] = new Array();
  ex[2] = new Array();
  //0: traditional, 1: audio, 2: disabled
  for (var i = 0; i < app_num.length; i++){
    if (type[i].toString() === "0") {
      ex[0].push(i);
    }
    if (type[i].toString() === "1") {
      ex[1].push(i);
    }
    if (type[i].toString() === "2") {
      ex[2].push(i);
    }
  }
}

function groupByItem() {
  for (var i = 0; i < 14; i++){
    item[i] = new Array();
  }
  for (var i = 0; i < app_num.length; i++){
    switch (item[i]) {
      case "Pencil":
        item[0].push(i); break;
      case "Banana":
        item[1].push(i); break;
      case "Karate":
        item[2].push(i); break;
      case "Strawberry":
        item[3].push(i); break;
      case "Cards":
        item[4].push(i); break;
      case "Corn":
        item[5].push(i); break;
      case "Mouse":
        item[6].push(i); break;
      case "Coat":
        item[7].push(i); break;
      case "Sweater":
        item[8].push(i); break;
      case "Garlic":
        item[9].push(i); break;
      case "Frog":
        item[10].push(i); break;
      case "Dolphin":
        item[11].push(i); break;
      case "Clock":
        item[12].push(i); break;
      case "Camel":
        item[13].push(i); break;
      
    }
  }
}



function drawBySub() {
  clear();
  var t = 0;
  for (var i = 0; i < app_num.length; i++){
    if (start[i].toString() !== "-1" && end[i].toString() !== "-1") {
      drawGridNorm(parseInt(app_num[i]), parseInt(start[i]), parseInt(end[i]), parseInt(sub[i]) * 110, t + 100, 100);      
    } else {
      fill(grey);
      rect(parseInt(sub[i]) * 110, t + 100, 100, 1);
    }
    t = t + 1;
    if (sub[i] !== sub[i - 1]) {
      t = 0;
    }
  }
}


function drawByTech() {
  groupByTech();
  clear();

  for (var i = 0; i < 3; i++){
    var x_pos = 50 + 350 * i;
    t = 0;
    for (var j = 0; j < ex[i].length; j++){
      
      if (start[ex[i][j]].toString() !== "-1" && end[ex[i][j]].toString() !== "-1") {
        drawGridNorm(parseInt(app_num[ex[i][j]]), parseInt(start[ex[i][j]]), parseInt(end[ex[i][j]]), x_pos, t + 100, 300);
        t += 1;
        }
      }
    }

  }

function drawByItem() {
  groupByItem();
  clear();

  for (var i = 0; i < 14; i++){
    var x_pos = 50 + 110 * i;
    t = 0;
    for (var j = 0; j < item[i].length; j++){
      
      if (start[item[i][j]].toString() !== "-1" && end[item[i][j]].toString() !== "-1") {
        drawGridNorm(parseInt(app_num[item[i][j]]), parseInt(start[item[i][j]]), parseInt(end[item[i][j]]), x_pos, t + 100, 100);
        t += 1;
        }
      }
    }
  
}

function drawGridNorm(num, start, end, x, y, len) {
  var l1 = map(start, 0, num, 0, len);
  var l2 = map(end - start, 0, num, 0, len);
  var l3 = map(num - end, 0, num, 0, len);
  // console.log(l1, l2, l3);

  noStroke();
  fill(c1);
  rect(x, y, l1, 1);
  x += l1

  fill(c2);
  rect(x, y, l2, 1);
  x += l2;

  fill(c3);
  rect(x, y, l3, 1);

  // console.log(start, end, num);

}

