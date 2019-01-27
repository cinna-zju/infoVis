//sub data needs to sort


var w = 1400;
var h = 900;

var page, isAlign = false, isGroup = false, tran = 0;
var isTran = 0;//0
var table, sub0;
var barWidth = 8;
var spacing = 6;

//colors
var c1, c2, c3, grey;

// num currently chose,
var choose, hover;
let current_id, current_drawing=null;

// info about bar chart
var barX = new Array(14);
var barW = new Array(14);

var app_num, start, end, type, item;

var tech = new Array(3);
tech[0] = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39];
tech[1] = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40];
tech[2] = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41];

var rec_num = new Array();
var sub0_item = new Array();
var isLoaded = false;
var sub = new Array();

let spsub;

var pos1 = new Array(84);
var pos2 = new Array(84);
var tran_cnt = 0;

// var ani = [1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24, 27, 30];
var ani = [24, 48, 72, 96,120,
  150, 180, 210, 240, 270,
  306, 342, 378, 414, 450,
  486, 522, 558, 594, 630,
  660, 690, 720, 750, 780,
  804, 828, 852, 876, 900];


function preload() {
  table = loadTable("forSubNew.csv", "csv", "header");

}

function setup() {
  // console.log(table.getRowCount());

  var mCanvas = createCanvas(w, h);
  mCanvas.parent("canvas");
  frameRate(30);
  page = 0;

  choose = 0;
  current_id = 10;
  sub_item = new Array(14);

  //from table
  app_num = table.getColumn("apparition_amount");
  start = table.getColumn("transition_start");
  end = table.getColumn("transition_end");
  type = table.getColumn("technique");
  sub = table.getColumn("subject");
  item = table.getColumn("item");

  // c1 = color(0x32, 0xd3, 0xeb);
  // c2 = color(0xff, 0x7c, 0x7c);
  // c3 = color(0xfe, 0xb6, 0x4d);
  // c1 = color(0xe5, 0xf5, 0xe0);
  // c2 = color(0xa1, 0xd9, 0x9b);
  // c3 = color(0x31, 0xa3, 0x54);

  c1 = color(0xaf, 0xf3, 0x9e);
  c2 = color(0x60, 0xc4, 0x90);
  c3 = color(0x00, 0xaa, 0x8a);

  grey = color(0xfb, 0xff, 0x9d);


  rec_num.push(0);
  var t = 0;
  for (var i = 0; i < app_num.length; i++){
    if (sub[i] === (t + 1).toString()) {
      rec_num.push(i);
      t++;
    }
  }
  rec_num.push(app_num.length);

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 14; j++) {
      pos2[2*(3 * j + i)] = 10 + 100 * j;
      pos2[2*(3 * j + i) + 1] = 20 + 150 * i;
    }
  }

  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 9; j++) {
      if (i * 9 + j < 42) {
        pos1[2*(i * 9 + j)] = 50 + 150 * j;
        pos1[2*(i * 9 + j) + 1] = 20 + 150 * i;
      }
    }
  }


}

function addBackground() {
  if (isGroup === false) {
    noStroke();
    fill('rgba(200,200,200,0.5)');
    var x = Math.floor((mouseX - 20) / 150);
    var y = Math.floor((mouseY - 20) / 150);
    if (x + y * 9 < 41 && x + y * 9 >= 0) {
      rect(50 + 150 * x, 20 + 150 * y, 150, 150);
      
    }
  }


}

function draw() {
  background("#ccc");  

  if (page === 0) {
    if (isGroup === false && isTran === 0) {
      for (var i = 0; i < 5; i++){
        for (var j = 0; j < 9; j++){
          if (i * 9 + j < 42) {
            drawSub(i * 9 + j,  50 + 150 * j, 20 + 150 * i);
            textSize(12);  
            text('sub' + parseInt(i * 9 + j), 50+150*j, 150+150*i);
            
          }      
        }
      }
    }
    if(isGroup === true && isTran === 0) {
      for (var i = 0; i < 3; i++){
        for (var j = 0; j < 14; j++){
          drawSub(3 * j + i, 10 + 100 * j, 20 + 150 * i);
          textSize(12);  
          text('sub' + parseInt(3 * j + i), 10 + 100 * j, 150 + 150 * i);
        }
      }
    }

    if (isTran === 1 && tran_cnt % 2 === 1) {
      
      for (var i = 0; i < 42; i++){
        var dx = pos2[2*i] - pos1[2*i];
        var dy = pos2[2*i + 1] - pos1[2*i + 1];
        drawSub(i, pos1[2*i]+ dx * ani[tran]/900, pos1[2*i + 1]+dy*ani[tran]/900);
      }
      tran++;
      if (tran === 30) {
        isTran = 0;
        tran = 0;
      }
    }

    if (isTran === 1 && tran_cnt % 2 === 0) {
      for (var i = 0; i < 42; i++){
        var dx = pos1[2*i] - pos2[2*i];
        var dy = pos1[2*i + 1] - pos2[2*i + 1];
        drawSub(i, pos2[2*i]+ dx * ani[tran]/900, pos2[2*i + 1]+dy*ani[tran]/900);
      }
      tran++;
      if (tran === 30) {
        isTran = 0;
        tran = 0;
      }
    }

    textSize(40);
    fill(255);
    text('Menu-hotkey transition', 950, 650);
    fill(c1);
    rect(950, 680, 15, 15);
    fill(c2);
    rect(950, 710, 15, 15);
    fill(c3);
    rect(1100, 680, 15, 15);
    fill(grey);
    rect(1100, 710, 15, 15);


    fill(255);
    textSize(20);
    text('Menu only', 960, 700);
    text('Menu&hotkey', 960, 730);

    text('hotkey only', 1110, 700);
    text('No transition', 1110, 730);

    text('Align', 1250, 700);
    text('Group by tech', 1250, 730);
    noFill();
    stroke(0);
    rect(1250, 680, 80, 25);
    rect(1250, 710, 120, 25);

    addBackground();
  }

  if (page === 1) {
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
    if (current_id > 0) {
      drawSub(current_id - 1, 100, 50);    
    }
    drawCenterSub(current_id, 100, 300);
    if (current_id < 42) {
      drawSub(current_id + 1, 100, 550);    
    }
    highLight(hover);

    var time;
    if (current_drawing !== current_id) {
      spsub = loadTable("./sp/sub" + current_id + ".csv", "csv", "header", () => {
        // console.log(current_id);
        sub_item = [0];
        var item = spsub.getColumn('item');
        for (var i = 0; i < spsub.getRowCount(); i++){
          if (item[i + 1] !== item[i]) {
            sub_item.push(i + 1);
          }

        }
        isLoaded = true;
        choose = 0;
        console.log(sub_item);

      });
      current_drawing = current_id;
    }

    if (current_drawing === current_id && isLoaded === true) {
      time = spsub.getColumn('time_item_selected');
      var bhv = spsub.getColumn('user_behavior');
      drawLineChart(subset(time, sub_item[choose], sub_item[choose + 1]),
        subset(bhv, sub_item[choose], sub_item[choose + 1]),
        400,
        600
      );   
    }

    textSize(24);
    fill(0);
    noStroke();
    text('Back', 10, 30);
    text('Align', 10, 70);
    
    noFill();
    stroke(0);
    rect(5, 5, 80, 30);
    rect(5, 45, 80, 30);

  }
}

function mousePressed() {
  var x = Math.floor((mouseX - 50) / 150);
  var y = Math.floor((mouseY - 20) / 150);

  if (page === 0) {
    if (isGroup === false) {
      if (x + 9 * y < 41 && x + y * 9 >= 0) {
        page = 1;
        current_id = x + 9 * y;
        console.log(current_id);
        barWidth = 12;
      }
    }
    //align
    if (mouseX < 1330 && mouseX > 1250 && mouseY > 680 && mouseY < 705) {
      isAlign = !isAlign;
    }
    // group
    if (mouseX < 1370 && mouseX > 1250 && mouseY > 710 && mouseY < 735) {
      isGroup = !isGroup;
      isTran = 1;
      tran_cnt++;
      
    }
  }
  if (page === 1) {
    if (mouseX < 85 && mouseY < 35) {
      page = 0;
      barWidth = 8;
      isAlign = false;
    }
    if (mouseX < 85 && mouseY < 75 && mouseY > 45) {
      isAlign = !isAlign;
    }
    
  }
}


function highLight(y) {
  if (hover !== -1) {
    stroke(0);
    noFill();
    if (isAlign === true) {
      rect(barX[y], 300 + barWidth * y, barW[y], barWidth);      
    } else {
      rect(100, 300 + barWidth * y, barW[y], barWidth);
      
    }
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
      drawGrid(app_num[i]/2, start[i]/2, end[i]/2, x, y + barWidth * t);
      fill(0);
      // // text(item[i], x, y + barWidth * (t+1));

    } else {
      noStroke();
      fill(grey);
      // if (isAlign === false) {
        rect(x, y + barWidth * t, app_num[i]/2, barWidth);

      // }
      // if (isAlign === true) {
      //   rect(x, y + barWidth * t, -app_num[i]/2, barWidth);
      // }
      fill(0);
      // text(item[i], x, y + barWidth * (t+1));
    }
    t++;
  }
}

function drawGrid(num, start, end, x, y) {
  if (isAlign === false) {
    fill(c1);
    rect(x, y, start, barWidth);
  
    fill(c2);
    rect(x+start, y, end-start, barWidth);
  
    fill(c3);
    rect(x+end, y, num-end, barWidth);
  }
  if (isAlign === true) {
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


function drawCenterSub(id, x, y) {
  id = parseInt(id);
  var t = 0;

  c1.setAlpha(255);
  c2.setAlpha(255);
  c3.setAlpha(255);
  
  for (var i = parseInt(rec_num[id]); i < parseInt(rec_num[id+1]); i++){
    if (start[i].toString() !== "-1" && end[i].toString() !== "-1") {
      noStroke();
      drawGrid(app_num[i]/2, start[i]/2, end[i]/2, x, y + barWidth * t);
      fill(0);
      textSize(12);
      text(item[i], 200, y + barWidth * (t+1));

      barX[t] = x - parseInt(start[i])/2;
      barW[t] = app_num[i]/2;
    } else {
      noStroke();
      fill(grey);
      // if (isAlign === true) {
      //   rect(x, y + barWidth * t, -app_num[i]/2, barWidth);
      // } else {
      //   rect(x, y + barWidth * t, app_num[i]/2, barWidth);
        
      // }
      rect(x, y + barWidth * t, app_num[i]/2, barWidth);

      barX[t] = x - app_num[i]/2;
      barW[t] = app_num[i]/2;

      fill(0);
      textSize(12);
      text(item[i], 200, y + barWidth * (t+1));
    }
    t++;
  }

  textSize(30);
  text(current_id, 10, 400);
}


var fac = 50;

function drawLineChart(time, bhv, x, y0) {

  var num = time.length;
  var x0 = x;

  stroke(0);
  line(x - 1, y0, x - 1 + 900, y0);
  line(x - 1, y0, x - 1, 10);
  fill(0);
  triangle(x - 1, 10, x - 7, 20, x + 5, 20);
  triangle(x - 1 + 900, y0, x - 11 + 900, y0 + 6, x - 11 + 900, y0 - 6);
  
  noStroke();
  fill(0);
  text('Time', x - 80, 30);
  text('Trial', x + 900, y0 + 30);

  var ptr = rec_num[current_id] + choose;
  var sp = parseInt(start[ptr]), ep = parseInt(end[ptr]), num = parseInt(app_num[ptr]);
  // console.log(sp, ep, num);

  if (sp === -1 || ep === -1) {
    fill(grey);
    beginShape();
    vertex(x, y0);
    for (var i = 0; i < num; i++){
      y = y0 - fac * time[i];
      vertex(x + i * spacing, y);
      if (time[i] > 4) {
        push();
        fill(255);
        textSize(10);
        text(time[i], x + i * spacing, y);
        pop();
      }

    }
    vertex(x + spacing*(num-1), y0);
    endShape(CLOSE);
    
  } else {
    fill(c1);
    beginShape();
    vertex(x, y0);
    for (var i = 0; i <= sp; i++){
      y = y0 - fac*time[i];

      vertex(x + i * spacing, y);
      if (time[i] > 4) {
        push();
        fill(255);
        textSize(10);
        text(time[i], x + i * spacing, y);
        pop();        
      }

    }
    vertex(x + spacing*sp, y0);
    endShape(CLOSE);

    fill(c2);
    beginShape();
    vertex(x+spacing*sp, y0);    
    for (var i = sp; i <= ep; i++){
      y = y0 - fac* time[i];

      vertex(x+i*spacing, y);
      if (time[i] > 4) {
        push();
        fill(255);
        textSize(10);
        text(time[i], x + i * spacing, y);
        pop();        
      }
    }
    vertex(x+spacing*ep, y0);
    endShape(CLOSE);

    fill(c3);
    beginShape();
    vertex(x+spacing*ep, y0);    
    for (var i = ep; i <= num; i++){
      y = y0 - fac * time[i];
      vertex(x+i*spacing, y);
      if (time[i] > 4) {
        push();
        fill(255);
        textSize(10);
        text(time[i], x + i * spacing, y);
        pop();        
      }
    }
    vertex(x+spacing*num, y0);
    endShape(CLOSE);


    
  }

  for (var i = 0; i < num; i++){
    switch (bhv[i]) {
      case "menu_only":
        fill(c1);
        rect(x0 + spacing * i, 610, 3, 40);
        break;
      case "menu_keyboard_pressed":
        fill(c1);
        rect(x0 + spacing * i, 610, 3, 40);
        break;
      case "hotkey_menu_opened":
        fill(c2);
        rect(x0 + spacing * i, 610, 3, 40);
        break;
      case "hotkey_only":
        fill(c3);
        rect(x0 + spacing * i, 610, 3, 40);
        break; 
    }
  }

  if (mouseX > 400 && mouseX < 1300) {
    var x = Math.round((mouseX - 400) / spacing);
    
    if (x < num) {
      push();
      fill(255);
      textSize(20);
      text(time[x], mouseX, mouseY);
      stroke(0);
      // strokeWeight(5);
      line(mouseX, y0 - fac * time[x], mouseX, 600);
      pop();  
    }
  }

  

}


