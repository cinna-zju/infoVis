var w = 1400;
var h = 900;

var page, isAlign = false, isGroup = false;

//for animation
var isTran = 0, isTran2 = 0, tran = 0, tran2 = 0;//0

var table, sub0;

//
var barWidth = 8;
var spacing = 6;

//colors
var c1, c2, c3, grey;

// num currently chose,
var choose, hover;
let current_id, current_drawing = null, rowData;

// info about bar chart
var barX = new Array(14);
var barW = new Array(14);

var app_num, start, end, type, item;

var tech = new Array(3);
tech[0] = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39];
tech[1] = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40];
tech[2] = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41];

var rec_num = new Array();
var isLoaded = false;
var sub = new Array();

var ave_phase = new Array(3);

let spsub;

var pos1 = new Array(84);
var pos2 = new Array(84);
var tran_cnt = 0;

// var ani = [1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24, 27, 30];
// var ani = [24, 48, 72, 96,120,
//   150, 180, 210, 240, 270,
//   306, 342, 378, 414, 450,
//   486, 522, 558, 594, 630,
//   660, 690, 720, 750, 780,
//   804, 828, 852, 876, 900];

var ani = [24, 48, 72,
  102, 132, 162,
  198, 244, 280,
  316, 352, 388,
  418, 448, 478,
  502, 526, 550];



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
  current_id = 0;
  sub_item = new Array(14);

  //from table
  app_num = table.getColumn("apparition_amount");
  start = table.getColumn("transition_start");
  end = table.getColumn("transition_end");
  type = table.getColumn("technique");
  sub = table.getColumn("subject");
  item = table.getColumn("item");

  c2 = color(0xff, 0x55, 0x62);
  c1 = color(0xff, 0xb4, 0x3a);
  c3 = color(0x77, 0x6c, 0xe2);

  grey = color(0x4f, 0x4f, 0x4f);

  rec_num.push(0);
  var t = 0;
  for (var i = 0; i < app_num.length; i++) {
    if (sub[i] === (t + 1).toString()) {
      rec_num.push(i);
      t++;
    }
  }
  rec_num.push(app_num.length);

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 14; j++) {
      pos2[2 * (3 * j + i)] = 10 + 100 * j;
      pos2[2 * (3 * j + i) + 1] = 20 + 220 * i;
    }
  }

  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 9; j++) {
      if (i * 9 + j < 42) {
        pos1[2 * (i * 9 + j)] = 50 + 150 * j;
        pos1[2 * (i * 9 + j) + 1] = 20 + 150 * i;
      }
    }
  }


}

function addBackground() {
  if (isGroup === false && mouseX > 50) {
    noStroke();
    fill('rgba(100,100,100,0.5)');
    var x = Math.floor((mouseX - 50) / 150);
    var y = Math.floor((mouseY - 20) / 150);
    if (x + y * 9 < 42 && x + y * 9 >= 0) {
      rect(50 + 150 * x, 20 + 150 * y, 100, 140);

    }
  }
}

function legend(x, y) {
  noStroke();

  fill(c1); rect(x - 10, y - 20, 15, 15);
  fill(c2); rect(x - 10, y + 10, 15, 15);
  fill(c3); rect(x + 140, y - 20, 15, 15);
  fill(grey); rect(x + 140, y + 10, 15, 15);

  fill(255);
  textSize(18);
  text('Menu only', x, y);
  text('Menu&hotkey', x, y + 30);
  text('Hotkey only', x + 150, y);
  text('No transition', x + 150, y + 30);

  if (page === 1) {
    ellipse(x-5, y + 50, 10, 10);
    text('average time per phase', x, y + 60);
    text("Use 'W' and 'S' to switch subjects.", 80, 750);
    text("Move <-mouse-> to see details", 400, 650);
  }

}

function draw() {
  background("#333333");

  if (page === 0) {
    if (isTran === 0) {
      if (isGroup === false) {
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 9; j++) {
            if (i * 9 + j < 42) {
              drawSub(i * 9 + j, 50 + 150 * j, 20 + 150 * i);
              textSize(12);
              fill(255);
              // text('sub' + parseInt(i * 9 + j), 50 + 150 * j, 150 + 150 * i);
            }
          }
        }
      } else {
        textSize(120);
        fill('rgba(255,255,255,0.5)');
        noStroke();
        text('Traditional', 10, 180);
        text('Audio', 10, 400);
        text('Disabled', 10, 620);

        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 14; j++) {
            drawSub(3 * j + i, 10 + 100 * j, 20 + 220 * i);
            textSize(12);
            fill(255);
            // text('sub' + parseInt(3 * j + i), 10 + 100 * j, 150 + 220 * i);
          }
        }
      }

    } else {
      if (tran_cnt % 2 === 1) {
        for (var i = 0; i < 42; i++) {
          var dx = pos2[2 * i] - pos1[2 * i];
          var dy = pos2[2 * i + 1] - pos1[2 * i + 1];
          drawSub(i, pos1[2 * i] + dx * ani[tran] / 550, pos1[2 * i + 1] + dy * ani[tran] / 550);
        }
        tran++;
        if (tran === 18) {
          isTran = 0;
          tran = 0;
        }
      } else {
        for (var i = 0; i < 42; i++) {
          var dx = pos1[2 * i] - pos2[2 * i];
          var dy = pos1[2 * i + 1] - pos2[2 * i + 1];
          drawSub(i, pos2[2 * i] + dx * ani[tran] / 550, pos2[2 * i + 1] + dy * ani[tran] / 550);
        }
        tran++;
        if (tran === 18) {
          isTran = 0;
          tran = 0;
        }
      }

    }

    textSize(36);
    fill(255);
    text('Menu-hotkey transition', 950, 650);

    legend(960, 700);

    text('Align', 1250, 700);
    text('Group by tech', 1250, 730);
    noFill();
    stroke(255);
    rect(1250, 680, 80, 25);
    rect(1250, 710, 120, 25);

    addBackground();
  }

  if (page === 1) {
    legend(1050, 50);

    if (isTran2 === 0) {
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
    }
    if (isTran2 === 1) { //up

      drawSub(current_id - 2, 100, 50 - 250 * ani[tran2] / 550);
      drawSub(current_id - 1, 100, 300 - 250 * ani[tran2] / 550);
      drawSub(current_id, 100, 550 - 250 * ani[tran2] / 550);
      drawSub(current_id + 1, 100, 800 - 250 * ani[tran2] / 550);

      tran2++;

      if (tran2 === 18) {
        isTran2 = 0;
      }
    }

    if (isTran2 === -1) { //down
      drawSub(current_id - 1, 100, -200 + 250 * ani[tran2] / 550);
      drawSub(current_id, 100, 50 + 250 * ani[tran2] / 550);
      drawSub(current_id + 1, 100, 300 + 250 * ani[tran2] / 550);
      drawSub(current_id + 2, 100, 550 + 250 * ani[tran2] / 550);
      tran2++;

      if (tran2 === 18) {
        isTran2 = 0;
      }
    }


    var time;
    if (current_drawing !== current_id) {
      spsub = loadTable("./sp/sub" + current_id + ".csv", "csv", "header", () => {
        // console.log(current_id);
        sub_item = [0];
        var item = spsub.getColumn('item');
        for (var i = 0; i < spsub.getRowCount(); i++) {
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
    fill(255);
    noStroke();
    text('Back', 10, 30);
    text('Align', 10, 70);

    noFill();
    stroke(255);
    rect(5, 5, 80, 30);
    rect(5, 45, 80, 30);

  }
}

function mousePressed() {
  var x = Math.floor((mouseX - 50) / 150);
  var y = Math.floor((mouseY - 20) / 150);

  if (page === 0) {
    if (isGroup === false) {
      if (x + 9 * y < 42 && x + y * 9 >= 0) {
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
    stroke(255);
    strokeWeight(1);
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

  for (var i = parseInt(rec_num[id]); i < parseInt(rec_num[id + 1]); i++) {
    if (start[i].toString() !== "-1" && end[i].toString() !== "-1") {
      noStroke();
      drawGrid(app_num[i] / 1.5, start[i] / 1.5, end[i] / 1.5, x, y + barWidth * t);
      fill(0);
      // // text(item[i], x, y + barWidth * (t+1));

    } else {
      noStroke();
      fill(grey);
      rect(x, y + barWidth * t, app_num[i] / 1.5, barWidth);
    }
    t++;
  }
}

function drawGrid(num, start, end, x, y) {
  if (isAlign === false) {
    fill(c1);
    rect(x, y, start, barWidth);

    fill(c2);
    rect(x + start, y, end - start, barWidth);

    fill(c3);
    rect(x + end, y, num - end, barWidth);
  }
  if (isAlign === true) {
    fill(c1);
    rect(x, y, -start, barWidth);

    fill(c2);
    rect(x, y, end - start, barWidth);

    fill(c3);
    rect(x + end - start, y, num - end, barWidth);
  }
}




function keyReleased() {
  if (keyCode === 83 && current_id > 0) {
    current_id--;
    isTran2 = -1;//down
    tran2 = 0;
  }

  if (keyCode === 87 && current_id < 41) {
    current_id++;
    isTran2 = 1;//up
    tran2 = 0;
  }
  return false;
}


function drawCenterSub(id, x, y) {
  id = parseInt(id);
  var t = 0;

  c1.setAlpha(255);
  c2.setAlpha(255);
  c3.setAlpha(255);

  for (var i = parseInt(rec_num[id]); i < parseInt(rec_num[id + 1]); i++) {
    if (start[i].toString() !== "-1" && end[i].toString() !== "-1") {
      noStroke();
      drawGrid(app_num[i] / 1.5, start[i] / 1.5, end[i] / 1.5, x, y + barWidth * t);
      fill(255);
      textSize(12);
      text(item[i], 200, y + barWidth * (t + 1));

      barX[t] = x - parseInt(start[i]) / 1.5;
      barW[t] = app_num[i] / 1.5;
    } else {
      noStroke();
      fill(grey);
      // if (isAlign === true) {
      //   rect(x, y + barWidth * t, -app_num[i]/2, barWidth);
      // } else {
      //   rect(x, y + barWidth * t, app_num[i]/2, barWidth);

      // }
      rect(x, y + barWidth * t, app_num[i] / 1.5, barWidth);

      barX[t] = x - app_num[i] / 1.5;
      barW[t] = app_num[i] / 1.5;

      fill(255);
      textSize(12);
      text(item[i], 200, y + barWidth * (t + 1));
    }
    t++;
  }

  textSize(30);
  fill(255);
  text(current_id, 50, 320);
  text(current_id - 1, 50, 120);
  text(current_id + 1, 50, 620);
}


var fac = 50;

function drawLineChart(time, bhv, x, y0) {

  var num = time.length;
  var x0 = x;

  var ave_phase = [0, 0, 0, 0];
  var worst1, worst2, worst3, worst4, best1, best2, best3, best4;

  // if (spsub.getRowCount() !== 0) {
    // worst1 = spsub.get(sub_item[choose], 'worst_time_menu_only');
    // worst2 = spsub.get(sub_item[choose], 'worst_time_hotkey_only_transitioning');
    // worst3 = spsub.get(sub_item[choose], 'worst_time_hotkey_only');
    
  
    // best1 = spsub.get(sub_item[choose], 'best_time_menu_only');
    // best2 = spsub.get(sub_item[choose], 'best_time_hokey_only_transitioning');
    // best3 = spsub.get(sub_item[choose], 'best_time_hotkey_only');
  // }

  stroke(255);
  line(x - 1, y0, x - 1 + 900, y0);
  line(x - 1, y0, x - 1, 30);
  fill(255);
  triangle(x - 1, 30, x - 7, 40, x + 5, 40);
  triangle(x - 1 + 900, y0, x - 11 + 900, y0 + 6, x - 11 + 900, y0 - 6);

  noStroke();
  fill(255);
  textSize(30);
  text('Time', x + 10, 50);
  text('Trial', x + 850, y0 + 40);

  textSize(15);
  for (var i = 0; i < y0 - 50; i++) {
    if ((y0 - i) % 50 === 0) {
      // console.log(i);
      text(i / 50, x - 30, y0 - i);
    }
  }

  var ptr = rec_num[current_id] + choose;
  var sp = parseInt(start[ptr]), ep = parseInt(end[ptr]), num = parseInt(app_num[ptr]);
  // console.log(sp, ep, num);

  if (sp === -1 || ep === -1) {
    fill(grey);
    beginShape();
    vertex(x, y0);
    for (var i = 0; i < num; i++) {
      y = y0 - fac * time[i];
      ave_phase[0] += parseInt(time[i]);
      vertex(x + i * spacing, y);
      push();
      fill(255);
      if (time[i] > 6) {
        text(time[i], x + i * spacing, y);
      }
      if (i % 5 === 0) {
        text(i, x + i * spacing, y0 + 20);
      }
      pop();

    }

    vertex(x + spacing * (num - 1), y0);
    endShape(CLOSE);

    ave_phase[0] /= parseInt(num);
    fill('#fff');

    ellipse(x + (num - 1) * spacing / 2, y0 - fac * ave_phase[0], 10, 10);

    noStroke();
    text(ave_phase[0].toString().substr(0, 4), x + (num - 1) * spacing / 2 + 10, y0 - fac * ave_phase[0] + 10);


  } else {
    fill(c1);
    beginShape();
    vertex(x, y0);
    for (var i = 0; i <= sp; i++) {
      y = y0 - fac * time[i];
      ave_phase[1] += parseInt(time[i]);

      vertex(x + i * spacing, y);
      push();
      fill(255);
      if (time[i] > 6) {

        text(time[i], x + i * spacing, y);
      }
      //draw x axis
      if (i % 5 === 0) {
        text(i, x + i * spacing, y0 + 20);
      }
      pop();


    }
    vertex(x + spacing * sp, y0);
    endShape(CLOSE);

    fill(c2);
    beginShape();
    vertex(x + spacing * sp, y0);
    for (var i = sp; i <= ep; i++) {
      y = y0 - fac * time[i];
      ave_phase[2] += parseInt(time[i]);

      vertex(x + i * spacing, y);
      push();
      fill(255);
      if (time[i] > 6) {

        text(time[i], x + i * spacing, y);
      }
      if (i % 5 === 0) {
        text(i, x + i * spacing, y0 + 20);
      }
      pop();
    }
    vertex(x + spacing * ep, y0);
    endShape(CLOSE);

    fill(c3);
    beginShape();
    vertex(x + spacing * ep, y0);
    for (var i = ep; i < num; i++) {
      y = y0 - fac * time[i];
      ave_phase[3] += parseInt(time[i]);

      vertex(x + i * spacing, y);
      push();
      fill(255);
      if (time[i] > 6) {
        text(time[i], x + i * spacing, y);
      }
      if (i % 5 === 0) {
        text(i, x + i * spacing, y0 + 20);
      }
      pop();
    }
    vertex(x + spacing * num, y0);
    endShape(CLOSE);
    ave_phase[1] /= (sp + 1);
    ave_phase[2] /= (ep - sp + 1);
    ave_phase[3] /= (num - ep + 1);



    fill('#fff');
    if (sp !== 0) {

      // strokeWeight(2);
      stroke(255);
      // line(x + sp * spacing / 2, y0 - fac * worst1, x + sp * spacing / 2, y0 - fac * best1);
      noStroke();
      ellipse(x + sp * spacing / 2, y0 - fac * ave_phase[1], 10, 10);
      text(ave_phase[1].toString().substr(0, 4), x + sp * spacing / 2 + 10, y0 - fac * ave_phase[1] + 10);

    }
    ellipse(x + (ep + sp) * spacing / 2, y0 - fac * ave_phase[2], 10, 10);
    ellipse(x + (num + ep) * spacing / 2, y0 - fac * ave_phase[3], 10, 10);

    text(ave_phase[2].toString().substr(0, 4), x + (ep + sp) * spacing / 2 + 10, y0 - fac * ave_phase[2] + 10);
    text(ave_phase[3].toString().substr(0, 4), x + (num + ep) * spacing / 2 + 10, y0 - fac * ave_phase[3] + 10);

    // push();
    // strokeWeight(2);
    // stroke(255);
    // line(x + (sp+ep) * spacing / 2, y0 - fac * worst2, x + (sp+ep) * spacing / 2, y0 - fac * best2);
    // line(x + (num+ep) * spacing / 2, y0 - fac * worst3, x + (num+ep) * spacing / 2, y0 - fac * best3);
    // pop();
  }

  for (var i = 0; i < num; i++) {
    switch (bhv[i]) {
      case "menu_only":
        fill(c1);
        rect(x0 + spacing * i, 670, 5, 40);
        break;
      case "menu_keyboard_pressed":
        fill(c1);
        rect(x0 + spacing * i, 670, 5, 40);
        break;
      case "hotkey_menu_opened":
        fill(c2);
        rect(x0 + spacing * i, 670, 5, 40);
        break;
      case "hotkey_only":
        fill(c3);
        rect(x0 + spacing * i, 670, 5, 40);
        break;
    }
  }

  if (mouseX > 400 && mouseX < 1300) {

    var x = Math.round((mouseX - 400) / spacing);
    push();
    fill(255);
    textSize(15);
    if (x < num) {

      text(time[x], mouseX + 10, mouseY);
      stroke(50);
      strokeWeight(2);
      line(mouseX, y0 - fac * time[x], mouseX, 600);
      // console.log(spsub);
      rowData = spsub.getRow(sub_item[choose] + x);

      if (spsub.getRowCount() !== 0) {
        var c = (x+1) + '/' + num + '\t';
        c += 'trial: ' + rowData.getString('trial') + '\t';
        c += 'hotkey: ' + rowData.getString('hotkey') + '\t';
        c += 'technique label: ' + rowData.getString('technique_label') + '\n';
        c += 'user behavior: ' + rowData.getString('user_behavior') + '\t';

        text(c, x0, y0 + 150);
        fill('rgba(255,255,255,0.3)');
        noStroke();
        rect(x0 + spacing * x, 670, 5, 40);

      }




    }
    pop();

  }



}


