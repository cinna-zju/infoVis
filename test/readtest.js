function preload() {
  table = loadTable("./sp/sub0.csv", "csv", "header");
}

function setup() {
  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total cols in table");
}