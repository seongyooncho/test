"use strict";

export {setRows};

let parkingTable = $("#parkingTable");

function setRows(rows) {
  $(".parkingRow").remove();
  for (let row of rows) {
    let tr = "<tr class='parkingRow'>";
    tr += "<td>"+floorString(row.floor)+"</td>";
    tr += "<td>"+zoneString(row.zone)+"</td>";
    tr += "<td>"+availableString(row.available, row.maximum)+"</td>";
    tr += "</tr>";

    parkingTable.append($(tr));
  }
}

function floorString(floor) {
  if (floor < 0) {
    return "B"+(-floor)+"F";
  } else {
    return floor+"F";
  }
}

function zoneString(zone) {
  return String.fromCharCode(64 + zone);
}

function availableString(n, max) {
  let label;
  let ratio = n / max;
  if (ratio === 0) {
    label = '<span class="label label-danger">Full</span>';
  } else if (ratio < 0.2) {
    label = '<span class="label label-warning">Busy</span>';
  } else {
    label = '<span class="label label-primary">Free</span>';
  }
  return label + " " + n + " / " + max;
}
