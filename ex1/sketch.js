var w = 1200;
var h = 700;
var table;
var yearCol;
var conferenceCol;
var minYear;
var maxYear;
var minWidth = 1;
var maxWidth = 5;
var fills = [50, 100, 150, 200];
var conferences = ["InfoVis", "SciVis", "VAST", "Vis"];


function preload() {
  table = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(w, h);
  noLoop(); // draw executed only once background (255,204,0);
  background(255, 204, 0);
  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total cols in table");
  yearCol = table.getColumn("Year");
  minYear = min(yearCol);
  maxYear = max(yearCol);
  minWidth = 1;
  maxWidth = 5;
  conferenceCol = table.getColumn("Conference");

}

function draw() {
  var spacing = 10;
  var x = 0;
  var y = 5;
  var length = 10;
  var lineheight = 20;

  for (var i = 0; i < table.getRowCount(); ++i) {
    
    x = x + spacing;
    if (x > w - spacing) {
      x = x % w + spacing;
      y = y + lineheight + 5;
    }

    currentYear = yearCol[i];
    currentWidth = map(currentYear, minYear, maxYear, minWidth, maxWidth);
    strokeWeight(currentWidth);

    conf = conferenceCol[i];
    index = conferences.indexOf(conf);
    strokeColor = fills[index]; // stroke with 1 parameter is grayscale
    stroke(strokeColor);
    stroke(255);

    line(x, y, x, y + lineheight);
  }





}
