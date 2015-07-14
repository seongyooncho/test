var transport, protocol, client;
var liveModuleList;
var moduleList;
var sceneList;
var ruleList;
var moduleLookupTable;
var scheduleList;
var selectedModuleIdList;
var energyConsumptionHistory;
var models = new Array();
var updateInterval = 100;
var async = false;
var isSliding = 0;
var calendarPicker;
var floorMatrix4;
var isFloorLocked = false;
var controlMax;

var adminPassword;

var resized = false;

var pick;

var oldAreaList;

var floorModels = [];
var bulbModels = [];
var lightModels = [];

var shellModel;
var sphereModel;

var showShell = true;

var floorZooms = [
	-15, -15, -15,
	-15, -15, -15,
	-15,
	-20,
	-20,
	-38,
];

var floorOffsets = [
	[-10.0, -5.0,  7.0],
	[-10.0, -5.0,  5.0],
	[-10.0, -5.0,  3.0],
	[-10.0, -5.0,  1.0],
	[-10.0, -5.0, -1.0],
	[-10.0, -5.0, -3.0],
	[-10.0, -5.0, -5.0],
	[-10.0, -6.0, -5.0],
	[ 10.0, -5.0, -5.0],
	[  0.0, 10.0, -5.0],
];


var modulePositions = [
	// * Office * //
	[-4, 4], [-3, 2], [-3,-1], [-4,-4],
	[-3, 4], [-3,-3], [-1, 4], [-1,-4],
	[ 1, 4], [ 1,-4], [ 3, 4], [ 3,-3],
	[ 4, 4], [ 3, 2], [ 3,-1], [ 4,-4],

	[-4, 4], [-3, 2], [-3,-1], [-4,-4],
	[-3, 4], [-3,-3], [-1, 4], [-1,-4],
	[ 1, 4], [ 1,-4], [ 3, 4], [ 3,-3],
	[ 4, 4], [ 3, 2], [ 3,-1], [ 4,-4],

	[-4, 4], [-3, 2], [-3,-1], [-4,-4],
	[-3, 4], [-3,-3], [-1, 4], [-1,-4],
	[ 1, 4], [ 1,-4], [ 3, 4], [ 3,-3],
	[ 4, 4], [ 3, 2], [ 3,-1], [ 4,-4],

	// * Residential * //
	[-4, 3], [-3, 1], [-3,-1], [-4,-4],
	[-3, 4], [-3,-3], [-1, 4], [-1,-4],
	[ 1, 4], [ 1,-4], [ 3, 4], [ 3,-3],
	[ 4, 3], [ 3, 1], [ 3,-1], [ 4,-4],

	[-4, 3], [-3, 1], [-3,-1], [-4,-4],
	[-3, 4], [-3,-3], [-1, 4], [-1,-4],
	[ 1, 4], [ 1,-4], [ 3, 4], [ 3,-3],
	[ 4, 3], [ 3, 1], [ 3,-1], [ 4,-4],

	[-4, 3], [-3, 1], [-3,-1], [-4,-4],
	[-3, 4], [-3,-3], [-1, 4], [-1,-4],
	[ 1, 4], [ 1,-4], [ 3, 4], [ 3,-3],
	[ 4, 3], [ 3, 1], [ 3,-1], [ 4,-4],

	// * Commercial * //
	[-4, 0], [-1, 2], [-4,-2], [-4,-5],
	[-3, 3], [-3,-3], [-1, 5], [-1,-5],
	[ 1, 5], [ 1,-5], [ 3, 3], [ 3,-3],
	[ 4, 0], [ 1, 2], [ 4,-2], [ 4,-5],

	// * Facade * //
	[-6, 6], [-6, 3], [-6, 0], [-6,-3],
	[-6,-6], [-3, 6], [-2,-6], [-1, 0],
	[ 6, 6], [ 6, 3], [ 6, 0], [ 6,-3],
	[ 6,-6], [ 3, 6], [ 2,-6], [ 1, 1],

	// * Parking * //
	[-3, 5], [-3, 3], [-3, 1], [-3,-1],
	[-3,-3], [-3,-5], [ 0, 6], [ 0, 2],
	[ 3, 5], [ 3, 3], [ 3, 1], [ 3,-1],
	[ 3,-3], [ 3,-5], [ 0,-6], [ 0,-2],

	// * Road * //
	[-18, -2], [-12, -2], [ -6, -2], [  0,-2],
	[ 18,  4], [ 18, -2], [ 12, -2], [  6,-2],
	[-18,  2], [-12,  2], [ -6,  2], [  0, 2],
	[ 14,  4], [ 18,  2], [ 12,  2], [  6, 2],
];

var GL, _color, _position;

// TODO: change all thrift calls to async. refer to https://github.com/apache/thrift/blob/master/lib/js/test/test.js#L266

$(function() {
	var windowArea = Math.floor(4 * window.innerWidth * window.innerHeight);
	floorMatrix4 = new Uint8Array(windowArea);
	
	setInterval(function(){
		$("#title-time").html((new Date()).toString().substring(4, 25));
	}, 1000);

	initClient();

	try {
		adminPassword = client.LBN_Thrift_GetAdminPassword();
	} catch (err){
		console.log(err);
	}
	if (!adminPassword) {
		adminPassword = "0000";
	}

  try {
    controlMax = client.LBN_Thrift_GetModuleControlMax();
  } catch (err) {
    console.log(err);
  }
  if (!controlMax) {
    controlMax = new stLBN_ModuleControl();

    controlMax.cwdimming = 100;
    controlMax.wwdimming = 100;
    controlMax.red = 255;
    controlMax.green = 255;
    controlMax.blue = 255;
    controlMax.pan = 359;
    controlMax.tilt = 359;
    controlMax.zoom = 100;
  }

	glMain();

	$('#controller').hide();

	loadAreaList(function() {
		$('.accordion h3').next().slideUp('fast');
		$('.area').click(function(event) {
			toggleArea($('.area').index(this));
		});

		$('.floor').click(function(event) {
			toggleFloor($('.floor').index(this));
		});

		$("#arealist ol").selectable({
			stop: function() {
				// deselect modules in other floor
				var $x = $("#arealist ol");
				var thisIndex = $x.index(this);

				$x.each( function(i) {
					if (i != thisIndex) {
						$($x[i]).children().removeClass('ui-selected');
					}
				});

				setSelectedModule(this);
			}
		});
	});

	selectedModuleIdList = new Array();

	$("#activeBtn").click(function() {
		var active = $("#activeBtn").hasClass("active");
		client.LBN_Thrift_SetActive(!active);
	});
	$("#autoBtn").click(function() {
		var auto = $("#autoBtn").hasClass("auto");
		client.LBN_Thrift_SetAuto(!auto);
	});
	$("#simulateBtn").click(function() {
		$(this).toggleClass("active");
		var simulate = $(this).hasClass("active");
		client.LBN_Thrift_SetSimulate(simulate);
	});
	$("#loginBtn").click(function() {
		var password = prompt("Please enter administrator password");
		if (password === adminPassword) {
			$("#stage").removeClass("logout");
		}
	});

	$("#sceneBtn").click(function() {
		var className = "scene";
		var hasClass = $("#stage").hasClass(className);
		$("#stage").removeClass();
		if (!hasClass) {
			$("#stage").addClass(className);
			updateSceneList();
		}
		client.LBN_Thrift_PreviewScene(-1);
	});
	$("#scheduleBtn").click(function() {
		var className = "schedule";
		var hasClass = $("#stage").hasClass(className);
		$("#stage").removeClass();
		if (!hasClass) {
			$("#stage").addClass(className);
			updateScheduleList();
		}
	});
	$("#ruleBtn").click(function() {
		var className = "rule";
		var hasClass = $("#stage").hasClass(className);
		$("#stage").removeClass();
		if (!hasClass) {
			$("#stage").addClass(className);
			updateRuleList();
		}
	});

	$("#addSceneBtn").click(function() {
		var sceneTitle = prompt("Add current state to new scene.\nPlease enter title.", "Scene title");
		if (sceneTitle != null) {
			if (sceneTitle.length > 0) {
				client.LBN_Thrift_AddScene(sceneTitle);
				updateSceneList();
			} else {
				alert("Please enter title.");
			}
		}
	});

	$("#cwdimming-slider").slider({
		range:"min",
		max: controlMax.cwdimming,
//		step: 25,
		slide: function(event, ui) {
			var value = ui.value;
			if (isSliding != 0) {
				setModuleControlCWDimming(value, true);
			}
			isSliding++;
		},
		stop: function(event, ui) {
			var value = ui.value;
			if (isSliding === 1) {
				value = Math.round(value/25)*25;
			}
			setModuleControlCWDimming(value, true);
			isSliding = 0;
		},
		animate: 100,
	});

	$("#cw-off-btn").click( function(){
		setModuleControlCWDimming(0, true);
	});
	$("#cw-on-btn").click( function(){
		setModuleControlCWDimming(100, true);
	});

	$("#wwdimming-slider").slider({
		range:"min",
		max: controlMax.wwdimming,
//		step: 25,
		slide: function(event, ui) {
			var value = ui.value;
			if (isSliding != 0) {
				setModuleControlWWDimming(value, true);
			}
			isSliding++;
		},
		stop: function(event, ui) {
			var value = ui.value;
			if (isSliding === 1) {
				value = Math.round(value/25)*25;
			}
			setModuleControlWWDimming(value, true);
			isSliding = 0;
		},
		animate: 100,
	});
	$("#ww-off-btn").click( function(){
		setModuleControlWWDimming(0, true);
	});
	$("#ww-on-btn").click( function(){
		setModuleControlWWDimming(100, true);
	});

	$("#red-slider").slider({
		range:"min",
		max: controlMax.red,
		slide: function(event, ui) {
			setModuleControlRGB(1, ui.value, true);
		},
		stop: function(event, ui) {
						setModuleControlRGB(1, ui.value, true);
					},
		animate: 100,
	});

	$("#green-slider").slider({
		range:"min",
		max: controlMax.green,
		slide: function(event, ui) {
			setModuleControlRGB(2, ui.value, true);
		},
		stop: function(event, ui) {
						setModuleControlRGB(2, ui.value, true);
					},
		animate: 100,
	});

	$("#module-message").click( function() {
		var message = prompt("Please enter module message", $(this).html());
		if (message !== undefined) {
			client.LBN_Thrift_SetModuleMessage(selectedModuleIdList[0], message);
			setTimeout(function(){selectModule(selectedModuleIdList[0]);}, 100);
		}
	});

	$("#blue-slider").slider({
		range:"min",
		max: controlMax.blue,
		slide: function(event, ui) {
			setModuleControlRGB(3, ui.value, true);
		},
		stop: function(event, ui) {
						setModuleControlRGB(3, ui.value, true);
					},
		animate: 100,
	});

	$("#pan-slider").slider({
		range:"min",
		max: controlMax.pan,
		slide: function(event, ui) {
			setModuleControlPan(ui.value, true);
		},
		stop: function(event, ui) {
						setModuleControlPan(ui.value, true);
					},
		animate: 100,
	});

	$("#tilt-slider").slider({
		range:"min",
		max: controlMax.tilt,
		slide: function(event, ui) {
			setModuleControlTilt(ui.value, true);
		},
		stop: function(event, ui) {
						setModuleControlTilt(ui.value, true);
					},
		animate: 100,
	});

	$("#zoom-slider").slider({
		range:"min",
		max: controlMax.zoom,
		slide: function(event, ui) {
			setModuleControlZoom(ui.value, true);
		},
		stop: function(event, ui) {
						setModuleControlZoom(ui.value, true);
					},
		animate: 100,
	});

  $("#up-button").click(function(){
    setModuleControlMove("up", true);
  });
  $("#down-button").click(function(){
    setModuleControlMove("down", true);
  });
  $("#left-button").click(function(){
    setModuleControlMove("left", true);
  });
  $("#right-button").click(function(){
    setModuleControlMove("right", true);
  });
  $("#stop-button").click(function(){
    setModuleControlMove("stop", true);
  });

	$("#minAllBtn").click(function(){
		setAllModulesMin();
	});
	$("#maxAllBtn").click(function(){
		setAllModulesMax();
	});

	initEnergyConsumption();
	loadWeather();
	loadDisaster();
	updateSolarInfo(60000);

	window.setTimeout(updateList, updateInterval);

  var globalFloorId = getParameterByName("floor");
  if (globalFloorId) {
    globalFloorId = parseInt(globalFloorId);
    openFloor(globalFloorId);
    isFloorLocked = true;
    console.log(globalFloorId);
  }
});


function updateList() {
	if (selectedModuleIdList.length === 1) {
		selectModule(selectedModuleIdList[0]);
	}
	updateAreaList();
	updateActive();
	updateAuto();
	window.setTimeout(updateList, updateInterval);
}
function updateActive() {
	var active = client.LBN_Thrift_GetActive();
	var activeOld = $("#activeBtn").hasClass("active");
	if (active != activeOld) {
		$("#activeBtn").toggleClass("active");
	}
}
function updateAuto() {
	var auto = client.LBN_Thrift_GetAuto();
	var autoOld = $("#autoBtn").hasClass("auto");
	if (auto != autoOld) {
		$("#autoBtn").toggleClass("auto");
	}
}

function updateSceneList() {
	client.LBN_Thrift_PreviewScene(-1);
	sceneList = client.LBN_Thrift_GetSceneList();
	$(".scene-modify-button").off("click");
	$(".scene-delete-button").off("click");
	$(".drawer-item.scene-item").remove();
	var $sceneContainer = $("#sceneDrawer > .container");
	for (var i in sceneList) {
		var scene = sceneList[i];
		var $sceneItem = $("<div id='scene-item-"+scene.id+"' class='drawer-item scene-item'></div>");
		var $sceneItemH = $("<h5>#"+scene.id+"</h5>");
		var $sceneItemP = $("<p>"+scene.title+"</p>");
		var $sceneItemBtn0 = $("<button class='scene-modify-button'>Modify</button>");
		var $sceneItemBtn1 = $("<button class='scene-delete-button'>Delete</button>");
		$sceneItem.append($sceneItemH);
		$sceneItem.append($sceneItemP);
		$sceneItem.append($sceneItemBtn0);
		$sceneItem.append($sceneItemBtn1);
		$sceneContainer.append($sceneItem);
	}
	$(".scene-item").click(function() {
		var sceneId = parseInt($(this).attr("id").replace("scene-item-", ""));
		client.LBN_Thrift_PreviewScene(parseInt(sceneId));
		$(".scene-item").removeClass("preview");
		$(this).addClass("preview");
	});
	$(".scene-delete-button").click(function(e){
		e.stopPropagation();
    var r = confirm("Are you sure you want to delete this scene?");
    if (r === true) {
      var sceneId = getIdFromParent($(this), "scene-item-");
      client.LBN_Thrift_DeleteScene(parseInt(sceneId));
      updateSceneList();
    }
	});
	$(".scene-modify-button").click(function(e){
		e.stopPropagation();
		var sceneId = getIdFromParent($(this), "scene-item-");
		var scene = findSceneById(sceneId);
		var newTitle = prompt("Modify this scene with current state.\nPlease rename title.", scene.title);
		if (newTitle != null) {
			if (newTitle.length > 0) {
				scene.title = newTitle;
				client.LBN_Thrift_ModifyScene(scene);
				updateSceneList();
			} else {
				alert("Please enter title.");
			}
		}
	});

}
function getIdFromParent($element, prefix) {
	return parseInt($element.parent().attr("id").replace(prefix, ""));
}
function findSceneById(sceneId) {
	for (var i in sceneList) {
		var scene = sceneList[i]
		if (parseInt(scene.id) === parseInt(sceneId)) return scene;
	}
}

function updateScheduleList(selected) {
	initCalendar();
	scheduleList = client.LBN_Thrift_GetScheduleList();
	sceneList = client.LBN_Thrift_GetSceneList();

	$(".timeline-dot").remove();
	$(".dropdown").remove();

	for (var i in scheduleList) {
		var schedule = scheduleList[i];
		if (!validateSchedule(schedule)) {
			continue;
		}
		$timelineDot = $("<div id='timeline-dot-"+schedule.id+"' class='timeline-dot' data-dropdown='#dropdown-"+schedule.id+"'></div>");
		$timelineDot.css({"left": getLeftFromTime(schedule.time)});
		$("#timeline").append($timelineDot);
		var $dropdown = initScheduleDropdown(schedule);
		$("body").append($dropdown);

	}

	$(".dropdown button").click(function(e) {
		if($(e.target).html() === "Delete Schedule"){
			var selectedId = $(e.target).parent().parent().attr("id").replace("dropdown-", "");
			client.LBN_Thrift_DeleteSchedule(selectedId);
			updateScheduleList();
		}
	});

	$(".dropdown input:checkbox").click(function(e){
		var id = $(e.target).parents(".dropdown").attr("id").replace("dropdown-", "");
		var schedule = findScheduleById(id);
		var checked = e.target.checked;
		var day = parseInt($(e.target).val());

		if (day === -1) {
			schedule.repeatAll = checked;
		} else {
			schedule.repeatDays[day] = checked;
		}
		client.LBN_Thrift_ModifySchedule(schedule);
		updateScheduleList(id);
	});

	$(".dropdown select").change(function(e){
		var sceneId = $(e.target).val();
		var scene = findSceneById(sceneId);
		var id = $(e.target).parents(".dropdown").attr("id").replace("dropdown-", "");
		var schedule = findScheduleById(id);
		schedule.scene = scene;
		client.LBN_Thrift_ModifySchedule(schedule);
		updateScheduleList(id);
	});

	$(".timeline-dot").hover(function() {
		if ($("#simulateBtn").hasClass("active")) {
			var id = parseInt($(this).attr("id").replace("timeline-dot-", ""));
			var schedule = findScheduleById(id);
			client.LBN_Thrift_PreviewScene(schedule.scene.id);
		}
	});

	if (selected) {
		setTimeout(function(){
			$("#timeline-dot-"+selected).dropdown("show");
		}, 100);
	}
}

function initScheduleSceneDropdown(id) {
	var $dropdownDiv = $('<div id="dropdown-'+i+'" class="dropdown dropdown-tip dropdown-scroll"></div>');
	var $dropdownUL = $('<ul class="dropdown-menu"></ul>');
	var $dropdownUl = $('<form></form>');
	for (var j in sceneList) {
		var scene = sceneList[j];
		var $dropdownLi;
		if (rule.scene && scene.id === rule.scene.id) {
			$dropdownLi = $('<li><label><input type="radio" name="radio-group-'+i+'" value="'+j+'" checked="checked" />'+scene.title+'</label></li>');
		} else {
			$dropdownLi = $('<li><label><input type="radio" name="radio-group-'+i+'" value="'+j+'" />'+scene.title+'</label></li>');
		}
		$dropdownUl.append($dropdownLi);
	}
	$dropdownUL.append($dropdownUl);
	$dropdownDiv.append($dropdownUL);
	return $dropdownDiv;

}
function validateSchedule(schedule) {
	return (schedule.repeatAll ||
			schedule.repeatDays[getDayFromTime(calendarPicker.currentDate.getTime()/1000)] ||
			compareDates(new Date(schedule.time*1000), calendarPicker.currentDate))
}

function getDayFromTime(time) {
	return (new Date(time*1000)).getDay();
}
function compareDates(date1, date2) {
	return (date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getYear() === date2.getYear());
}
function initCalendar() {
	if (calendarPicker) {
		return;
	}

	var width = window.innerWidth;

	calendarPicker = $("#calendar").calendarPicker({
    	monthNames:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    useWheel:false,
	    callbackDelay:100,
	    years:Math.floor(width/600),
	    months:Math.floor(width/300),
	    days:Math.floor(width/100),
	    showDayArrows:false,
	    callback:function(cal) {
			updateScheduleList();
		}
	});

	$("#timeline").dblclick(function(e) {
		if ($(e.target).attr("id") !== "timeline") {
			return;
		}
		var time = getSelectedTime(e.offsetX);
		var mdate = new Date(time*1000);
		var mtime = prompt("Add schedule at:", mdate.getHours()+":"+mdate.getMinutes()+":00");
		if (mtime === null) {
			return;
		}
		var hh = parseInt(mtime.split(":")[0]);
		var mm = parseInt(mtime.split(":")[1]);
		var ss = parseInt(mtime.split(":")[2]);
		mdate.setHours(hh);
		mdate.setMinutes(mm);
		mdate.setSeconds(ss);
		time = Math.floor(mdate.getTime()/1000);

		showAddSchedulePanel(time);
	});
	$("#resetBtn").click(function() {
		for (var i in scheduleList) {
			var id = scheduleList[i].id;
			client.LBN_Thrift_DeleteSchedule(id);
		}
		updateScheduleList();
	});
};
function showAddSchedulePanel (time) {
	var selected = client.LBN_Thrift_AddSchedule(sceneList[0], time, false, [false, false, false, false, false, false, false]);
	updateScheduleList(selected);
}
function initScheduleDropdown (schedule) {
	var $dropdown = $('<div id="dropdown-'+schedule.id+'" class="dropdown dropdown-tip"></div>');

	var $panel = $('<div class="dropdown-panel"></div>');
	$dropdown.append($panel);

	var $table = $('<table></table>');
	$panel.append($table);

	var $heading = $('<tr><th colspan="2">Schedule</th></tr>');
	$table.append($heading);

	var $date = $('<tr><th>Date</th><td>'+(new Date(schedule.time*1000)).toDateString()+'</td></tr>');
	$table.append($date);
	var $time = $('<tr><th>Time</th><td>'+(new Date(schedule.time*1000)).toLocaleTimeString()+'</td></tr>');
	$table.append($time);

	var repeat = '<tr><th>Repeat</th><td><ul>';

	repeat += liForRepeat(-1, schedule.repeatAll);
	for (var i in schedule.repeatDays) {
		repeat += liForRepeat(i, schedule.repeatDays[i]);
	}
	repeat += '</ul></td></tr>';

	$table.append($(repeat));

	var sceneString = '<tr><th>Scene</th><td><select>';
	for (var i in sceneList) {
		var scene = sceneList[i];
		sceneString += '<option value='+scene.id+(scene.id === parseInt(schedule.scene.id)?' selected="selected"':'')+'>'+scene.title+'</option>';
	}
	sceneString += '</select></td></tr>';
	$table.append($(sceneString));

	var $deleteBtn = $('<button>Delete Schedule</button>');
	$panel.append($deleteBtn);

	return $dropdown;
}
function liForRepeat(index, checked) {
	var title;
	switch (parseInt(index)) {
		case -1:
			title = "Everyday";
			break;
		case 0:
			title = "Sunday";
			break;
		case 1:
			title = "Monday";
			break;
		case 2:
			title = "Tuesday";
			break;
		case 3:
			title = "Wednesday";
			break;
		case 4:
			title = "Thursday";
			break;
		case 5:
			title = "Friday";
			break;
		case 6:
			title = "Saturday";
			break;
	}
	return '<li><label><input type="checkbox" '+(checked?'checked="checked" ':'')+'value='+index+' />'+title+'</label></li>';
}
function getLeftFromTime(time) {
	var startX = 0;
	var endX = 922+720;
	var date = new Date(time * 1000);
	var timeScale = (date.getHours() * 60 + date.getMinutes())/(24 * 60);
	return Math.round(endX * timeScale);
}
function getSelectedTime(mouseX) {
	var startX = 14;
	var endX = 936+720;
	var currentX = Math.max(Math.min(endX, mouseX) , startX);

	var selectedTime = Math.floor(calendarPicker.currentDate.getTime()/1000);
	selectedTime = floorTime(selectedTime);

	selectedTime += (currentX - startX) / (endX - startX) * 60 * 60 * 24;
	selectedTime = roundTime(selectedTime, 60);

	return selectedTime;
}
function floorTime(time) {
	var date = new Date(time * 1000);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return Math.floor(date/1000);
}
function roundTime(time, seed) {
	return Math.round(time / seed) * seed;
}


function updateRuleList() {
	ruleList = client.LBN_Thrift_GetContextRuleList();
	sceneList = client.LBN_Thrift_GetSceneList();

	$(".drawer-item.rule-item").remove();
	$(".dropdown").remove();
	var $ruleContainer = $("#ruleDrawer > .container");
	for (var i in ruleList) {
		var rule = ruleList[i];
		var $ruleItem = $("<div id='rule-item-"+rule.id+"' class='drawer-item rule-item'></div>");
		var $ruleItemH = $("<label><input type='checkbox'"+(rule.enabled?" checked='checked'":"")+">"+rule.title+"</input></label>");
		var $ruleItemP = $("<p>"+rule.description+"</p>");

		var $dropdown = initRuleDropdown(rule, i);
		$ruleItem.append($ruleItemH);
		$ruleItem.append($ruleItemP);
		if (rule.hasScene) {
			var $ruleItemBtn = initRuleItemBtn(rule, i);
			$ruleItem.append($ruleItemBtn);
		}
		$("body").append($dropdown);
		$ruleContainer.append($ruleItem);
	}
	$('.dropdown form').change(function(e) {
		var sceneIndex = parseInt($(e.target).val());
		var scene = sceneList[sceneIndex];
		var ruleIndex = parseInt($(e.target).attr("name").replace("radio-group-", ""));
		var rule = ruleList[ruleIndex];
		rule.scene = scene;
		client.LBN_Thrift_ModifyContextRule(rule);
		updateRuleList();
	});
	$('.rule-item input').change(function(e) {
		var enabled = e.target.checked;
		var ruleId = parseInt($(e.target).parents(".rule-item").attr("id").replace("rule-item-", ""));
		client.LBN_Thrift_SetEnableContextRule(ruleId, enabled);
		updateRuleList();

	});
}
function initRuleItemBtn(rule, i) {
	var sceneTitle = "Select scene";
	if (rule.scene) {
		sceneTitle = rule.scene.title;
	}
	return $("<button class='rule-set-button' data-dropdown='#dropdown-"+i+"'>"+sceneTitle+"</button>");
}
function initRuleDropdown(rule, i) {
	var $dropdownDiv = $('<div id="dropdown-'+i+'" class="dropdown dropdown-tip dropdown-scroll"></div>');
	var $dropdownUL = $('<ul class="dropdown-menu"></ul>');
	var $dropdownUl = $('<form></form>');
	for (var j in sceneList) {
		var scene = sceneList[j];
		var $dropdownLi;
		if (rule.scene && scene.id === rule.scene.id) {
			$dropdownLi = $('<li><label><input type="radio" name="radio-group-'+i+'" value="'+j+'" checked="checked" />'+scene.title+'</label></li>');
		} else {
			$dropdownLi = $('<li><label><input type="radio" name="radio-group-'+i+'" value="'+j+'" />'+scene.title+'</label></li>');
		}
		$dropdownUl.append($dropdownLi);
	}
	$dropdownUL.append($dropdownUl);
	$dropdownDiv.append($dropdownUL);
	return $dropdownDiv;

}
function findScheduleById(scheduleId) {
	for (var i in scheduleList) {
		var schedule = scheduleList[i]
		if (parseInt(schedule.id) === parseInt(scheduleId)) return schedule;
	}
}
function findRuleById(ruleId) {
	for (var i in ruleList) {
		var rule = ruleList[i]
		if (rule.id === ruleId) return rule;
	}
}

function initClient() {

	var serverUrl = getParameterByName("thrift");
	if (serverUrl === "") {
		serverUrl = "http://localhost:9090";
	}

	var getAsync = getParameterByName("async");
	if (getAsync === "true") {
		async = true;
	}

	transport = new Thrift.Transport(serverUrl);
	protocol  = new Thrift.Protocol(transport);
	client = new LBN_Thrift_ServiceClient(protocol);

	console.log("Thrift.Transport("+serverUrl+")");
	console.log("Thrift.Protocol("+transport+")");
	console.log("LBN_Thrift_ServiceClient("+protocol+")");
}

function loadAreaList(callback) {
	var areaList = client.LBN_Thrift_GetAreaList();

	oldAreaList = areaList;

	console.log("LBN_Thrift_GetAreaList()");
	liveModuleList = new Array();
	moduleLookupTable = new Array();

	var $areaList = $('#arealist');

	areaList.forEach(function(area){
		var $areaHead = $('<h3 class="area">'+area.name+'</h3>');
		var $areaContent = $('<div class="accordion"></div>');

		shellModel = new GlModel(GL, _color, _position, "Shell", [0,0,-1], undefined, undefined, undefined, false);

		area.floors.forEach(function(floor){
			var $floorContainer = $('<div class="floor-container"></div>');

			var $floorHead = $('<h3 class="floor">'+floor.name+'</h3>');
			var $floorContent = $('<div><div class="divider"></div></div>');

			var $ol = $('<ol></ol>');

			var	floorModel = new Object();
			floorModel.model = new GlModel(GL, _color, _position, area.name + "-floor", floorOffsets[floor.id], floor.id);
			floorModel.bulbs = [];
			floorModel.lights = [];

			floorModels.push(floorModel);

			floor.modules.forEach(function(module){
				$ol.append('<li id="module-' + module.id + '"><img src="img/module-icon-'+module.type+'.png" />#' + module.id + '<span>' + Math.round(getRGBA(module)[3]*100) + '%</span>' + '</li>');
				liveModuleList.push(module);

				$('#float-info').append('<div id="info-panel-' + module.id + '" class="info-panel"><div class="info-bar info-ambient"></div><div class="info-bar info-red"></div><div class="info-bar info-green"></div><div class="info-bar info-blue"></div><div class="info-bar info-temp"></div><div class="info-bar info-humid"></div></div>');

				var moduleIndex = liveModuleList.length - 1;

				var bulbModel = new GlModel(GL, _color, _position, "bulb", floorOffsets[floor.id], module.id, modulePositions[moduleIndex][0], modulePositions[moduleIndex][1], undefined, undefined, undefined, undefined, undefined);
				var lightModel = new GlModel(GL, _color, _position, "light", floorOffsets[floor.id], undefined, modulePositions[moduleIndex][0], modulePositions[moduleIndex][1], false, null, true, [module.control.red/255.0, module.control.green/255.0, module.control.blue/255.0, module.control.cwdimming/100.0], true);

				floorModel.bulbs.push(bulbModel);
				bulbModels.push(bulbModel);
				floorModel.lights.push(lightModel);
				lightModels.push(lightModel);
			});

			$floorContent.append($ol);

			$floorContainer.append($floorHead);
			$floorContainer.append($floorContent);

			$areaContent.append($floorContainer);

			moduleLookupTable.push( {
				start: floor.modules[0].id,
				end : floor.modules[ floor.modules.length - 1 ].id,
				area : area.id,
				floor : floor.id,
				$area : $areaHead,
				$floor : $floorHead,
			});
		});

		$areaList.append($areaHead);
		$areaList.append($('<div></div>').append($areaContent));
		$areaList.append($('<div class="divider"></div>'));
	});

	moduleList = liveModuleList;

	callback();
}

function updateAreaList() {
	var result = client.LBN_Thrift_GetAreaList();

	var areaList = result;

	// console.log(areaList[1].floors[0].modules[0].sensor);

	if (JSON.stringify(areaList) === JSON.stringify(oldAreaList)) {
		return;
	}

	oldAreaList = areaList;

	liveModuleList = new Array();

	areaList.forEach(function(area){
		area.floors.forEach(function(floor){
			floor.modules.forEach(function(module){
				liveModuleList.push(module);
			});
		});
	});

	moduleList = liveModuleList;

	refreshModuleListUI();
}

function updateSolarInfo(interval) {
	solarInfo = client.LBN_Thrift_GetSolarInfo();

	$("#weather-item0-rise").html(getHHMM(solarInfo.sunriseTime));
	$("#weather-item0-transit").html(getHHMM(solarInfo.suntransitTime));
	$("#weather-item0-set").html(getHHMM(solarInfo.sunsetTime));

	if (solarInfo.elevation > 0) {
		var solarOffset = calculateSolarOffset(solarInfo.azimuth, solarInfo.elevation);

		// TODO: Possible memory leak. Should implement changeOffset fn in GlModel
		sphereModel = new GlModel(GL, _color, _position, "Sphere", solarOffset, 254, undefined, undefined, false, undefined, true, [1.0, 0.7, 0.0, 0.4]);
		$("#float-solar p").show();
	} else {
		sphereModel = undefined;
		$("#float-solar p").hide();
	}

	window.setTimeout(function(){updateSolarInfo(interval);}, interval);
}

function calculateSolarOffset(degA, degE) {
	var a = degToRad(degA - 180);
	var e = degToRad(degE);

	var radius = 25;
	var x, y, z;

	x = radius * Math.sin(a);
	y = radius * Math.cos(a);

	z = radius * Math.sin(e) * 0.75;
	x = x * Math.cos(e);
	y = y * Math.cos(e);

	return [x, y, z];
}

function degToRad(deg) {
	return deg * Math.PI / 180;
}

function getHHMM(s) {
	var date = new Date(s*1000);
	var timeString = date.toTimeString().split(" ")[0];
	return timeString.substring(0, 5);
}

function unsetSelectedModule() {
	$('#arealist ol li').removeClass('ui-selected');
	selectedModuleIdList = new Array();
	$("#controller").fadeOut('fast');

	for (var i = 0; i < bulbModels.length; i++) {
		bulbModels[i].selected = false;
	}
}

function setSelectedModule(ol) {

	$("#controller").fadeIn('fast');

	var selectedCount = $("#selected-count").empty();
	var selectedModules = $("#selected-modules").empty();

	var controllerType = [true, true, true, true, true, true];

	selectedModuleIdList = new Array();
	var acw = 0, aww = 0, ar = 0, ag = 0, ab = 0, ap = 0, at = 0, az = 0;


  $("#cwdimming-slider").slider("enable");
  $("#wwdimming-slider").slider("enable");
  $("#red-slider").slider("enable");
  $("#green-slider").slider("enable");
  $("#blue-slider").slider("enable");
  $("#pan-slider").slider("enable");
  $("#tilt-slider").slider("enable");
  $("#zoom-slider").slider("enable");
  $("#up-button").prop("disabled", false);
  $("#down-button").prop("disabled", false);
  $("#left-button").prop("disabled", false);
  $("#right-button").prop("disabled", false);
  $("#stop-button").prop("disabled", false);

	$(".ui-selected", ol).each(function() {
		var index = $("li").index(this);
    var module = moduleList[index];
    var control = moduleList[index].control;
    var sensor = moduleList[index].sensor;

		if (index == -1) return;

    if (control.cwdimming === -1) 
    {
      $("#cwdimming-slider").slider("disable");
    }
    if (control.wwdimming === -1) 
    {
      $("#wwdimming-slider").slider("disable");
    }
    if (control.red === -1) 
    {
      $("#red-slider").slider("disable");
    }
    if (control.green === -1) 
    {
      $("#green-slider").slider("disable");
    }
    if (control.blue === -1) 
    {
      $("#blue-slider").slider("disable");
    }
    if (control.pan === -1) 
    {
      $("#pan-slider").slider("disable");
    }
    if (control.tilt === -1) 
    {
      $("#tilt-slider").slider("disable");
    }
    if (control.zoom === -1) 
    {
      $("#zoom-slider").slider("disable");
    }
    if (control.up === -1) 
    {
      $("#up-button").prop("disabled", true);
    }
    if (control.down === -1) 
    {
      $("#down-button").prop("disabled", true);
    }
    if (control.left === -1) 
    {
      $("#left-button").prop("disabled", true);
    }
    if (control.right === -1) 
    {
      $("#right-button").prop("disabled", true);
    }
    if (control.stop === -1) 
    {
      $("#stop-button").prop("disabled", true);
    }


		selectedModules.append( " #" +  index  );
		selectedModuleIdList.push(moduleList[index].id);
		acw += moduleList[index].control.cwdimming;
		aww += moduleList[index].control.wwdimming;
		ar += moduleList[index].control.red;
		ag += moduleList[index].control.green;
		ab += moduleList[index].control.blue;
		ap += moduleList[index].control.pan;
		at += moduleList[index].control.tilt;
		az += moduleList[index].control.zoom;


		$("#ambient-sensor").html(sensor.ambient);
		$("#red-sensor").html(sensor.red);
		$("#green-sensor").html(sensor.green);
		$("#blue-sensor").html(sensor.blue);
		$("#cieX-sensor").html(sensor.cieX?sensor.cieX.toFixed(2):"");
		$("#cieY-sensor").html(sensor.cieY?sensor.cieY.toFixed(2):"");
		$("#temp-sensor").html(sensor.temp?sensor.temp.toFixed(2):"");
		$("#humid-sensor").html(sensor.humid?sensor.humid.toFixed(2):"");

		var mmessage = moduleList[index].message;
		$("#module-message").html(mmessage);

		switch (moduleList[index].type)
		{
      case 0: // square color
        controllerType[3] = false;
        controllerType[4] = false;
        break;
			case 1: //mr16 warm white
			case 3: //street white
				controllerType[0] = false;
				controllerType[2] = false;
        controllerType[3] = false;
        controllerType[4] = false;
				break;
			case 2: //cool white
			case 5: //bar cool white
				controllerType[1] = false;
				controllerType[2] = false;
        controllerType[3] = false;
        controllerType[4] = false;
				break;
			case 4: //dmx
        controllerType[4] = false;
				break;
			case 6: //moving white
				controllerType[1] = false;
				controllerType[2] = false;
        controllerType[3] = false;
				break;
		}

	});

	if (controllerType[0]) {
		$("#cwdimming-controller").show();
	} else {
		$("#cwdimming-controller").hide();
	}
	if (controllerType[1]) {
		$("#wwdimming-controller").show();
	} else {
		$("#wwdimming-controller").hide();
	}
	if (controllerType[2]) {
		$("#rgb-controller").show();
	} else {
		$("#rgb-controller").hide();
	}
	if (controllerType[3]) {
		$("#dmx-controller").show();
	} else {
		$("#dmx-controller").hide();
	}
	if (controllerType[4]) {
		$("#move-controller").show();
	} else {
		$("#move-controller").hide();
	}

	if (selectedModules.html().length > 20) {
		var truncated = selectedModules.html().substr(0,20) + "...";
		selectedModules.html(truncated);
	}
	selectedCount.append(""+selectedModuleIdList.length + " selected");

	acw = Math.round(acw/selectedModuleIdList.length);
	aww = Math.round(aww/selectedModuleIdList.length);
	ar = Math.round(ar/selectedModuleIdList.length);
	ag = Math.round(ag/selectedModuleIdList.length);
	ab = Math.round(ab/selectedModuleIdList.length);
	ap = Math.round(ap/selectedModuleIdList.length);
	at = Math.round(at/selectedModuleIdList.length);
	az = Math.round(az/selectedModuleIdList.length);

	applyCWDimmingToController(acw);
	applyWWDimmingToController(aww);
	applyRGBToController(ar, ag, ab);
  applyPanToController(ap);
  applyTiltToController(at);
  applyZoomToController(az);

	for (var i = 0; i < bulbModels.length; i++) {
		bulbModels[i].selected = false;
	}
	for (var i = 0; i < selectedModuleIdList.length; i++) {
		bulbModels[selectedModuleIdList[i]].selected = true;
	}
}

function setAllModulesMin() {
	var control = new stLBN_ModuleControl();
	control.cwdimming = 0;
	control.wwdimming = 0;
	control.red = 0;
	control.green = 0;
	control.blue = 0;

	setAllModules(control);
}
function setAllModulesMax() {
	var control = new stLBN_ModuleControl();
	control.cwdimming = controlMax.cwdimming;
	control.wwdimming = controlMax.wwdimming;
	control.red = controlMax.red;
	control.green = controlMax.green;
	control.blue = controlMax.blue;

	setAllModules(control);
}

function setAllModules(control) {
	var moduleIdList = new Array();

	moduleList.forEach(function(module){
		moduleIdList.push(module.id);
	});

	client.LBN_Thrift_SetModules(moduleIdList, control);
}

function controlCopy(oldControl)
{
	var control = new stLBN_ModuleControl();
	control.cwdimming = oldControl.cwdimming;
	control.wwdimming = oldControl.wwdimming;
	control.red = oldControl.red;
	control.green = oldControl.green;
	control.blue = oldControl.blue;
  control.pan = oldControl.pan;
  control.tilt = oldControl.tilt;
  control.zoom = oldControl.zoom;
  control.up = oldControl.up;
  control.down = oldControl.down;
  control.left = oldControl.left;
  control.right = oldControl.right;
  control.stop = oldControl.stop;
  return control;
}

function setModuleControlCWDimming(value, sendToServer) {
	if (!selectedModuleIdList) return;
  if (moduleList[selectedModuleIdList[0]].control.cwdimming === -1) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	control.cwdimming = value;

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else 
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }

	}

	selectedModuleIdList.forEach(function(moduleId){
		moduleList[moduleId].control.cwdimming = value;

		lightModels[moduleId].setRGBA(getRGBA(moduleList[moduleId]));

		refreshModuleControl(moduleList[moduleId]);
	});

	applyCWDimmingToController(value);
}

function setModuleControlWWDimming(value, sendToServer) {
	if (!selectedModuleIdList) return;
  if (moduleList[selectedModuleIdList[0]].control.wwdimming === -1) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	control.wwdimming = value;

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }
	}

	selectedModuleIdList.forEach(function(moduleId){
		moduleList[moduleId].control.wwdimming = value;

		lightModels[moduleId].setRGBA(getRGBA(moduleList[moduleId]));

		refreshModuleControl(moduleList[moduleId]);
	});

	applyWWDimmingToController(value);
}

function setModuleControlRGB(rgb, value, sendToServer) {
	if (!selectedModuleIdList) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	switch (rgb) {
		case 1:
			control.red = value;
			$("#red-result").html(""+value);
			break;
		case 2:
			control.green = value;
			$("#green-result").html(""+value);
			break;
		case 3:
			control.blue = value;
			$("#blue-result").html(""+value);
			break;
	}

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }
	}

	selectedModuleIdList.forEach(function(moduleId){
		var control = moduleList[moduleId].control;
		switch (rgb) {
			case 1:
				control.red = value;
				lightModels[moduleId].setRGBA(getRGBA(moduleList[moduleId]));
				break;
			case 2:
				control.green = value;
				lightModels[moduleId].setRGBA(getRGBA(moduleList[moduleId]));
				break;
			case 3:
				control.blue = value;
				lightModels[moduleId].setRGBA(getRGBA(moduleList[moduleId]));
				break;
		}
		refreshModuleControl(moduleList[moduleId]);
	});

	var control = moduleList[ selectedModuleIdList[0] ].control;

	applyRGBToController(control.red, control.green, control.blue);
}

function setModuleControlPan (value, sendToServer) {
	if (!selectedModuleIdList) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	control.pan = value;

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }

	}
  $("#pan-result").html(""+value);

	selectedModuleIdList.forEach(function(moduleId){
		moduleList[moduleId].control.pan = value;
	});
}

function setModuleControlTilt (value, sendToServer) {
	if (!selectedModuleIdList) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	control.tilt = value;

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else 
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }
	}

  $("#tilt-result").html(""+value);

	selectedModuleIdList.forEach(function(moduleId){
		moduleList[moduleId].control.tilt = value;
	});
}

function setModuleControlZoom (value, sendToServer) {
	if (!selectedModuleIdList) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	control.zoom = value;

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }
	}

  $("#zoom-result").html(""+value);

	selectedModuleIdList.forEach(function(moduleId){
		moduleList[moduleId].control.zoom = value;
	});
}

function setModuleControlMove (value, sendToServer) {
	if (!selectedModuleIdList) return;

	var control = controlCopy(moduleList[selectedModuleIdList[0]].control);
	control.up = (value==="up")?1:0;
  control.down = (value==="down")?1:0;
  control.left = (value==="left")?1:0;
  control.right = (value==="right")?1:0;
  control.stop = (value==="stop")?1:0;

	if (sendToServer) {
		if (selectedModuleIdList.length === 1) {
			client.LBN_Thrift_SetModule(selectedModuleIdList[0], control);
		}
    else
    {
      client.LBN_Thrift_SetModules(selectedModuleIdList, control);
    }
	}
}


function refreshModuleControl(module) {
		$($("li span")[module.id]).html(""+Math.round(getRGBA(module)[3]*100)+"%");
}

function applyCWDimmingToController(dimming) {
	$("#cwdimming-result").html(""+dimming);
	$("#cwdimming-slider").slider('value', dimming);

	var dimming255 = Math.round(dimming * 255 / 100);
	$("#cwdimming-icon").css('background',
			'rgba(' + dimming255 + ',' + dimming255 + ',' + dimming255 + ',1)');
}

function applyWWDimmingToController(dimming) {
	$("#wwdimming-result").html(""+dimming);
	$("#wwdimming-slider").slider('value', dimming);

	var dimming255 = Math.round(dimming * 255 / 100);
	$("#wwdimming-icon").css('background',
			'rgba(' + dimming255 + ',' + dimming255 + ',' + dimming255 + ',1)');
}


function applyRGBToController(red, green, blue) {
	$("#red-result").html(""+red);
	$("#red-slider").slider('value', red);
	$("#green-result").html(""+green);
	$("#green-slider").slider('value', green);
	$("#blue-result").html(""+blue);
	$("#blue-slider").slider('value', blue);

	$("#rgb-icon").css('background',
			'rgba(' + red + ',' + green + ',' + blue + ',1)');
}

function applyPanToController(value) {
	$("#pan-result").html(""+value);
	$("#pan-slider").slider('value', value);
}
function applyTiltToController(value) {
	$("#tilt-result").html(""+value);
	$("#tilt-slider").slider('value', value);
}
function applyZoomToController(value) {
	$("#zoom-result").html(""+value);
	$("#zoom-slider").slider('value', value);
}

function refreshModuleListUI() {
	moduleList.forEach(function(module) {
		refreshModuleControl(module);

		lightModels[module.id].setRGBA(getRGBA(module));
		if (module.sensor.ambient == null)
		{
			$("#info-panel-"+module.id).removeClass("on");
		}
		else
		{
			$("#info-panel-"+module.id+" > .info-ambient").height(module.sensor.ambient/65535*24);
			$("#info-panel-"+module.id+" > .info-red").height(module.sensor.red/65535*24);
			$("#info-panel-"+module.id+" > .info-green").height(module.sensor.green/65535*24);
			$("#info-panel-"+module.id+" > .info-blue").height(module.sensor.blue/65535*24);
			$("#info-panel-"+module.id+" > .info-temp").height((module.sensor.temp+20)/100*24);
			$("#info-panel-"+module.id+" > .info-humid").height(module.sensor.humid/100*24);
		}
	});
}

function getRGBA(module)
{
	var rgba = new Array();
	var c1 = module.control.cwdimming/controlMax.cwdimming;
	var w1 = module.control.wwdimming/controlMax.wwdimming;
	var r1 = module.control.red/controlMax.red;
	var g1 = module.control.green/controlMax.green;
	var b1 = module.control.blue/controlMax.blue;

	rgba[0] = (1.0 + 1.0 + r1) / 3.0;
	rgba[1] = (1.0 + 1.0 + g1) / 3.0;
	rgba[2] = (1.0 + 1.0 + b1) / 3.0;
	rgba[3] = ((r1+g1+b1)/3.0 + c1 + w1) / 3.0;

	return rgba;
}

function clone_stLBN_Module(module) {
	var result = new stLBN_Module();
	result.control = new stLBN_ModuleControl();
	result.control.red = module.control.red;
	result.control.green = module.control.green;
	result.control.blue = module.control.blue;
	result.control.cwdimming = module.control.cwdimming;
	result.control.wwdimming = module.control.wwdimming;

	result.id = module.id;
	result.type = module.type;
	result.groups = new Array();

	var j;
	for (j=0; j<module.groups.length; ++j) {
		var group = new stLBN_Group();
		group.id = module.groups[j].id;
		result.groups.push(group);
	}

	return result;
}


function initEnergyConsumption() {

	var canvas = $("#energy-canvas").get(0);
	var columnWidth=canvas.width/(24*60*6);

	var timer = $.timer(function() {
		var powerMeter = client.LBN_Thrift_GetPowerMeter();

		$("#energy-voltage").html(powerMeter.dVoltage.toFixed(1) + ' V');
		$("#energy-current").html(powerMeter.dCurrent.toFixed(3) + ' A');
		$("#energy-power").html(powerMeter.dPower.toFixed(3) + ' kW');

		// chart
		var ctx = canvas.getContext("2d");
		var oneDay = client.LBN_Thrift_GetPowerMeterOneDay();
		var max = 3;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var pIndex = ((powerMeter.hour * 60 + powerMeter.minute) * 60 + powerMeter.second) / 10;
		var pPower = (powerMeter.dPower / max);

		// elapsed box
		ctx.lineWidth = 0;
		ctx.setLineDash([0, 0]);
		ctx.fillStyle = 'rgba(247, 164, 3, 0.2)';

		ctx.beginPath();
		ctx.rect(0, 0, pIndex * columnWidth, canvas.height);
		ctx.fill();
		ctx.closePath();

		// plot history
		ctx.lineWidth=1;
		ctx.setLineDash([0,0]);
		ctx.fillStyle = 'rgba(247, 164, 3, 1)';

		ctx.beginPath();
		ctx.moveTo(0, canvas.height);
		var i;

		var oj = -1;

		for (i=0; i<oneDay.powermeters.length; ++i) {
			var mPower = oneDay.powermeters[i];
			var hPower = oneDay.powermeters[i].dPower;
			if (hPower === null) hPower = 0;
			hPower = hPower / max;

			var j = mPower.hour * 60 * 6 + mPower.minute * 6 + Math.round(mPower.second/10);

			if (j - oj !== 1) {
				ctx.lineTo((oj+1)*columnWidth, canvas.height);
				ctx.lineTo(j*columnWidth, canvas.height);
			}

			ctx.lineTo(j*columnWidth, canvas.height * (1 - hPower));
			ctx.lineTo((j+1)*columnWidth, canvas.height * (1 - hPower));
			oj = j;
		}
		ctx.lineTo((oj+1)*columnWidth, canvas.height);
		ctx.lineTo(canvas.width, canvas.height);
		ctx.fill();
		ctx.closePath();

		// current line
		ctx.lineWidth=3;
		ctx.setLineDash([2,3]);
		ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';

		ctx.beginPath();
		ctx.moveTo(0, (1 - pPower) * canvas.height);
		ctx.lineTo(pIndex * columnWidth, (1 - pPower) * canvas.height);
		ctx.stroke();
		ctx.closePath();

	});

	timer.set( {time: 1000, autostart: true} );
	timer.play();
}

function loadWeather() {
	return $.simpleWeather({
			zipcode: '',
			woeid: '1132467',
			location: '',
			unit: 'c',
			success: function(weather) {
				var unit = '&deg;' + weather.units.temp;
				$("#weather-temp").html(weather.temp + unit);
				$("#weather-city").html(weather.city);
				$("#weather-currently").html(weather.currently);
				$("#weather-item1-day").html(weather.items[0].day);
				$("#weather-item1-high").html(weather.items[0].high + unit);
				$("#weather-item1-low").html(weather.items[0].low + unit);
				$("#weather-item2-day").html(weather.items[1].day);
				$("#weather-item2-high").html(weather.items[1].high + unit);
				$("#weather-item2-low").html(weather.items[1].low + unit);
				$("#weather-item3-day").html(weather.items[2].day);
				$("#weather-item3-high").html(weather.items[2].high + unit);
				$("#weather-item3-low").html(weather.items[2].low + unit);
				resize();
			},
			error: function(error) {
				console.log(error);
			}
		});
}

function loadDisaster() {
	$("#log").html(client.LBN_Thrift_GetDisasterInfo().description.replace(/\n/g, "<br>"));
}

function cropString(value, from, to) {
	var startIndex = value.indexOf(from);
	var endIndex = value.indexOf(to);
	return value.substr(startIndex + from.length, endIndex - startIndex - from.length);
}

function selectModule(arg) {
	var modules = arg;
	if ($.isArray(arg) == false) {
		modules = [arg];
	}
	if (modules.length === 0) {
		if (selectedModuleIdList.length === 0) {
			var openAreaId = getOpenAreaId();
			if (openAreaId != undefined) {
				toggleArea(openAreaId);
			}
		} else {
			unsetSelectedModule();
		}
		return;
	}

	$('#arealist ol li').removeClass('ui-selected');

	if( modules.length === 1) {
		$("#sensor-controller").show();
		$("#message-controller").show();
	} else {
		$("#sensor-controller").hide();
		$("#message-controller").hide();
	}

	for (var j=0; j<modules.length; ++j) {
		moduleId = modules[j];
		for (var i=0; i<moduleLookupTable.length; ++i) {
			if ( moduleLookupTable[i].start <= moduleId && moduleId <= moduleLookupTable[i].end ) {
				var $area = moduleLookupTable[i].$area;
				var $floor = moduleLookupTable[i].$floor;

				if (!$area.next().is(':visible')) {
					$area.click();
				}

				if (!$floor.next().is(':visible')) {
					$floor.click();
				}

				var $li = $("#module-" + moduleId);
				$li.addClass("ui-selected")
					setSelectedModule($li.parent()[0]);

				// scroll sideBar
				if (j==0) {
					var sideBar = $('#sidebar-left')[0];

					if (sideBar.scrollTop > $li[0].offsetTop || sideBar.scrollTop + sideBar.offsetHeight < $li[0].offsetTop) {
						sideBar.scrollTop = $li[0].offsetTop;
						window.setTimeout(function() {
							sideBar.scrollTop = $li[0].offsetTop;
						}, 500); // FIXME: other way not to use timeout ??
					}
				}

				break;
			}
		}
	}
}

function toggleArea(areaId) {
  if (isFloorLocked) return;

	var $areaTitle = $('.area');
	if (areaId < 0 || areaId >= $areaTitle.length)
		return;

	var $div = $($areaTitle[areaId]).next();

	if ($div.is(':visible')) {
		$("#float-floor").hide();
		$div.slideUp('fast');
		// closeAllFloor();
	}
	else {
		openArea(areaId);
	}

	unsetSelectedModule();
}

function toggleFloor(floorId) {
  if (isFloorLocked) return;

	var $floorTitle = $('.floor');
	if (floorId < 0 || floorId >= $floorTitle.length) {
		$("#float-floor").hide();
		return;
	}

	var $div = $($floorTitle[floorId]).next();

	if ($div.is(':visible')) {
		$("#float-floor").hide();
		var $otherFloors = $($('.floor')[floorId]).parent().parent().parent().children().children('.floor-container');
		if ($otherFloors.length > 1) {
			$div.slideUp('fast');
		}
	}
	else {
		openFloor(floorId);
	}
	unsetSelectedModule();
}

function openArea(areaId) {
  if (isFloorLocked) return;

	var $areaTitle = $('.area');
	if (areaId < 0 || areaId >= $areaTitle.length)
		return;

	for (var i=0; i<$areaTitle.length; ++i) {
		if (i == areaId) {
			$div = $($areaTitle[i]).next();
			$div.slideDown('fast');
			$dcc = $div.children().children().children('div');

			if ($dcc.length == 1) {
				$dcc.slideDown('fast');
			}
		}
		else {
			$($areaTitle[i]).next().slideUp('fast');
		}
	}
}

function closeAllFloor() {
  if (isFloorLocked) return;

	var $floorTitle = $('.floor');

	for (var i=0; i<$floorTitle.length; ++i) {
		$($floorTitle[i]).next().slideUp('fast');
	}
}

function openFloor(floorId) {
  if (isFloorLocked) return;

	switch (floorId) {
		case 0:
		case 1:
		case 2:
			openArea(0);
			break;
		case 3:
		case 4:
		case 5:
			openArea(1);
			break;
		case 6:
			openArea(2);
			break;
		case 7:
			openArea(3);
			break;
		case 8:
			openArea(4);
			break;
		case 9:
			openArea(5);
			break;
	}


	var $floorTitle = $('.floor');
	if (floorId < 0 || floorId >= $floorTitle.length) {
		$("#float-floor").hide();
		return;
	}

	$("#float-floor").show();
	$("#float-floor h2").html("Floor #"+floorId);
	for (var i=0; i<$floorTitle.length; ++i) {
		if (i == floorId) {
			$div = $($floorTitle[i]).next();
			$div.slideDown('fast');
			$dcc = $div.children().children().children('div');

			if ($dcc.length == 1) {
				$dcc.slideDown('fast');
			}
		}
		else {
			$($floorTitle[i]).next().slideUp('fast');
		}
	}
}

function getOpenAreaId() {
	var $areaTitle = $('.area');
	for (var i=0; i<$areaTitle.length; ++i) {
		if ($($areaTitle[i]).next().is(':visible')) {
			return i;
		}
	}
	return undefined;
}

function getOpenFloorId() {
	var $floorTitle = $('.floor');
	for (var i=0; i<$floorTitle.length; ++i) {
		if ($($floorTitle[i]).next().is(':visible')) {
			return i;
		}
	}
	return undefined;
}


function resize(flag) {
	var height = document.getElementById('information-panel').offsetHeight
				- document.getElementById('energy-panel').offsetHeight
				- document.getElementById('weather-panel').offsetHeight
				- 90;
	document.getElementById('log').style.height = height + 'px';

	var windowArea = Math.floor(4 * window.innerWidth * window.innerHeight);
	floorMatrix4 = new Uint8Array(windowArea);

	if (flag == 1) {
		resized = true;
	}
}

function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* WebGL */
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame;
	} )();
};

var glMain=function() {
	var CANVAS=document.getElementById("glcanvas");
	CANVAS.width=window.innerWidth;
	CANVAS.height=window.innerHeight;

	/*========================= CAPTURE MOUSE EVENTS ========================= */

	var drag=false;
	var locationArray=undefined;

	var old_x, old_y;

	var mouseDown=function(e) {
		if (e.button == 2) {
			drag=true;
			old_x=e.pageX, old_y=e.pageY;
		}
		if (e.button == 0) {
			pick = [e.pageX, window.innerHeight - e.pageY, undefined, undefined];
		}

		e.preventDefault();
		return false;
	}

	var mouseUp=function(e){
		$("#selection-indicator").hide();
		drag=false;
		if (e.button == 0) {
			if (pick !== undefined) {
				pick = [pick[0], pick[1],  e.pageX, window.innerHeight - e.pageY];
				pick = [Math.min(pick[0], pick[2]), Math.min(pick[1], pick[3]), Math.max(pick[0], pick[2]), Math.max(pick[1], pick[3])]
			}
		} else if (e.button == 2) {
			locationArray = undefined;
		}

		locationArray = undefined;
	}

	var mouseMove=function(e) {
		if (!drag)
		{
			if (pick !== undefined)
			{
				var x0, y0, x1, y1;
				x0 = pick[0];
				y0 = window.innerHeight - pick[1];
				x1 = e.pageX;
				y1 = e.pageY;
				$("#selection-indicator").css({
					left: Math.min(x0, x1),
					top: Math.min(y0, y1),
					width: Math.abs(x0-x1),
					height: Math.abs(y0-y1),
				})
				$("#selection-indicator").show();
			}
			return false;
		}
		$('.info-panel').removeClass('on');

		var dX=e.pageX-old_x,
				dY=e.pageY-old_y;
		THETA+=dX*2*Math.PI/CANVAS.width;
		PHI+=dY*2*Math.PI/CANVAS.height;
		old_x=e.pageX, old_y=e.pageY;
		e.preventDefault();

	}

	var shiftDown = false;
	var setShiftDown = function(event){
			if(event.keyCode === 16 || event.charCode === 16){
					shiftDown = true;
			}
	};

	var setShiftUp = function(event){
			if(event.keyCode === 16 || event.charCode === 16){
					shiftDown = false;
			}
	};

	CANVAS.addEventListener("mousedown", mouseDown, false);
	CANVAS.addEventListener("mouseup", mouseUp, false);
	CANVAS.addEventListener("mouseout", mouseUp, false);
	CANVAS.addEventListener("mousemove", mouseMove, false);
	document.addEventListener('keydown', setShiftDown);
	document.addEventListener('keyup', setShiftUp);

	/*========================= GET WEBGL CONTEXT ========================= */
	try {
		GL = CANVAS.getContext("experimental-webgl", {preserveDrawingBuffer: true});
	} catch (e) {
		alert("You are not webgl compatible :(") ;
		return false;
	} ;

	/*========================= SHADERS ========================= */

	var shader_vertex_source="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec4 color; //the color of the point\n\
varying vec4 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vColor=color;\n\
}";

	var shader_fragment_source="\n\
precision mediump float;\n\
varying vec4 vColor;\n\
void main(void) {\n\
gl_FragColor = vColor;\n\
}";

	var get_shader=function(source, type, typeString) {
	var shader = GL.createShader(type);
	GL.shaderSource(shader, source);
	GL.compileShader(shader);
	if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
		alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
		return false;
	}
	return shader;
	};

	var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
	var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

	var SHADER_PROGRAM=GL.createProgram();
	GL.attachShader(SHADER_PROGRAM, shader_vertex);
	GL.attachShader(SHADER_PROGRAM, shader_fragment);

	GL.linkProgram(SHADER_PROGRAM);

	var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
	var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
	var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

	_color = GL.getAttribLocation(SHADER_PROGRAM, "color");
	_position = GL.getAttribLocation(SHADER_PROGRAM, "position");

	GL.enableVertexAttribArray(_color);
	GL.enableVertexAttribArray(_position);

	GL.useProgram(SHADER_PROGRAM);

	/*========================= MATRIX ========================= */

	var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
	var MOVEMATRIX=LIBS.get_I4();
	var VIEWMATRIX=LIBS.get_I4();

	LIBS.translateZ(VIEWMATRIX, -15);
	var THETA=0,
		PHI=0;

	/*========================= DRAWING ========================= */
	GL.enable(GL.BLEND);
	GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
	GL.enable(GL.DEPTH_TEST);
	GL.depthFunc(GL.LEQUAL);

	GL.enable(GL.CULL_FACE);
	GL.cullFace(GL.BACK);

	GL.lineWidth(1.0);

	// GL.clearColor(0.0, 0.0, 0.0, 1.0);
	GL.clearDepth(1.0);


	var time_old=0;
	var animate=function(time) {
		if (resized) {
			CANVAS.width=window.innerWidth;
			CANVAS.height=window.innerHeight;
			PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
		}

		if (floorModels.length > 0) {
			var dt=time-time_old;
			LIBS.set_I4(MOVEMATRIX);

			LIBS.rotateZ(MOVEMATRIX, THETA + LIBS.degToRad(-135));
			LIBS.rotateX(MOVEMATRIX, PHI + LIBS.degToRad(-60));

			time_old=time;

			GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
			GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
			GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
			GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);

			var openFloorId = getOpenFloorId();

			if (openFloorId === undefined) {
				$('.info-panel').removeClass('on');

				LIBS.set_I4(VIEWMATRIX);

				var ty = -2;
				if ($("#stage").hasClass("scene")) ty -= 2;
				else if ($("#stage").hasClass("schedule")) ty -= 5;
				else if ($("#stage").hasClass("rule")) ty -= 2;
				LIBS.translateY(VIEWMATRIX, ty);
				LIBS.translateZ(VIEWMATRIX, -50);

				if (sphereModel) {
					sphereModel.drawColorCode(true);

					GL.readPixels(0, 0, window.innerWidth, window.innerHeight, GL.RGBA, GL.UNSIGNED_BYTE, floorMatrix4);
					GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
					$("#float-solar p").html("Azimuth: "+solarInfo.azimuth.toFixed(4)+"<br>Elevation: "+solarInfo.elevation.toFixed(4));
					calculateSolarPosition(floorMatrix4);
				}
				if (pick != undefined) {
					for (var i = 0; i < floorModels.length; i++) {
						floorModels[i].model.drawColorCode(true);
					}
					var pixelValues = new Uint8Array(4);
					GL.readPixels(pick[0], pick[1], 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pixelValues);
					GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
					var selectedPixel;
					if (pixelValues[1] === 255 && pixelValues[2] === 255 && pixelValues[3] === 255) {
						selectedPixel = pixelValues[0];
					}
					if (selectedPixel === undefined) {
						showShell = !showShell;
					} else {
						openFloor(selectedPixel);
						locationArray = undefined;
					}
					pick = undefined;
				}


				if (showShell) {
					shellModel.draw(true);
				}

				if (sphereModel) {
					sphereModel.draw(true);
				}

				for (var i = 0; i < floorModels.length; i++) {
					var bulbs = floorModels[i].bulbs;
					var lights = floorModels[i].lights;

					GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
					floorModels[i].model.draw(true);

					for (key in bulbs) {
						bulbs[key].draw(true);
					}

					// GL.blendFunc(GL.SRC_COLOR, GL.ONE);
					// GL.blendEquation(GL.FUNC_ADD);
					for (key in lights) {
						lights[key].draw(true);
					}
				}
			} else {
				$("#float-solar p").html("");
				LIBS.set_I4(VIEWMATRIX);
				var ty = 0;
				if ($("#stage").hasClass("scene")) ty -= 2;
				else if ($("#stage").hasClass("schedule")) ty -= 3;
				else if ($("#stage").hasClass("rule")) ty -= 2;
				LIBS.translateY(VIEWMATRIX, ty);
				LIBS.translateZ(VIEWMATRIX, floorZooms[openFloorId]);

				var bulbs = floorModels[openFloorId].bulbs;
				var lights = floorModels[openFloorId].lights;

				if (locationArray === undefined) {
					locationArray = [];
					for (key in bulbs) {
						bulbs[key].drawColorCode();
					}

					GL.readPixels(0, 0, window.innerWidth, window.innerHeight, GL.RGBA, GL.UNSIGNED_BYTE, floorMatrix4);
					GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
					calculateModulePosition(floorMatrix4);
				}

				if (pick != undefined && pick[2] != undefined) {
					var ids = [];
					if (shiftDown) {
						ids = selectedModuleIdList;
					}
					var pickedIndex = getPickedIndex(pick);

					if (pickedIndex !== -1)
					{
						ids = ids.concat(pickedIndex);
					}


					selectModule(ids);


					pick = undefined;
				}

				GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
				floorModels[openFloorId].model.draw();

				for (key in bulbs) {
					bulbs[key].draw();
				}

				// GL.blendFunc(GL.SRC_COLOR, GL.ONE);
				// GL.blendEquation(GL.FUNC_ADD);
				for (key in lights) {
					lights[key].draw();
				}
			}

			dragFinished=false;

			GL.flush();
		}
		window.requestAnimationFrame(animate);
	}
	animate(0);
}

function calculateSolarPosition(floorMatrix4)
{
	var l = floorMatrix4.length / 4;
	var floorMatrix = new Uint8Array(l);
	for (var i = 0; i < l; i++)
	{
		if (floorMatrix4[i*4+1] === 255
			&& floorMatrix4[i*4+2] === 255
			&& floorMatrix4[i*4+3] === 255)
		{
			floorMatrix[i] = floorMatrix4[i*4];
		}
		else
		{
			floorMatrix[i] = 255;
		}
	}
	var locationSolar;
	var width = window.innerWidth;
	for (var i = 0; i < floorMatrix.length; i++)
	{
		if (floorMatrix[i] !== 255) {
			var x = i % width;
			var y = i / width;
			if (locationSolar === undefined)
			{
				locationSolar = [x, y, x, y];
			}
			else {
				var left0 = locationSolar[0];
				var top0 = locationSolar[1];
				var right0 = locationSolar[2];
				var bottom0 = locationSolar[3];
				locationSolar = [
				Math.min(left0, x),
				Math.min(top0, y),
				Math.max(right0, x),
				Math.max(bottom0, y)];
			}
		}
	}
	if (locationSolar) {
		$("#float-solar").css({top:window.innerHeight-locationSolar[3], left:locationSolar[2]});
	}


}
function calculateModulePosition(floorMatrix4)
{
	var l = floorMatrix4.length / 4;
	var floorMatrix = new Uint8Array(l);
	for (var i = 0; i < l; i++)
	{
		if (floorMatrix4[i*4+1] === 255
			&& floorMatrix4[i*4+2] === 255
			&& floorMatrix4[i*4+3] === 255)
		{
			floorMatrix[i] = floorMatrix4[i*4];
		}
		else
		{
			floorMatrix[i] = 255;
		}
	}
	locationArray = new Array(moduleList.length);
	var width = window.innerWidth;
	for (var i = 0; i < floorMatrix.length; i++)
	{
		if (floorMatrix[i] !== 255) {
			var x = i % width;
			var y = i / width;
			if (locationArray[floorMatrix[i]] === undefined)
			{
				locationArray[floorMatrix[i]] = [x, y, x, y];
			}
			else {
				var left0 = locationArray[floorMatrix[i]][0];
				var top0 = locationArray[floorMatrix[i]][1];
				var right0 = locationArray[floorMatrix[i]][2];
				var bottom0 = locationArray[floorMatrix[i]][3];
				locationArray[floorMatrix[i]] = [
				Math.min(left0, x),
				Math.min(top0, y),
				Math.max(right0, x),
				Math.max(bottom0, y)];
			}
		}
	}

	$('.info-panel').removeClass('on');

	for (var i in locationArray)
	{
		$('#info-panel-'+i).addClass('on');
		$('#info-panel-'+i).css({left:locationArray[i][2], top:window.innerHeight - locationArray[i][3]})
	}
}

function getPickedIndex(pick)
{
	var result = [];
	for (var i in locationArray)
	{
		if (!(locationArray[i][0] >= pick[2] || locationArray[i][2] <= pick[0])
			&& !(locationArray[i][1] >= pick[3] || locationArray[i][3] <= pick[1]))
		{
			result.push(parseInt(i));
		}
	}
	return result;
}
