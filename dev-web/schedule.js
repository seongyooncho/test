"use strict"

export {setModal, onAddSchedule, onModifySchedule, onDeleteSchedule};

let calendar;

let sceneColors = [];

let getSchedule;
let getScene;
let addSchedule;
let modifySchedule;
let deleteSchedule;

let scheduleList;
let sceneList;

let scheduleDropdown = $("#scheduleDropdown");
let calendarDiv = $("#calendar");
let scheduleEditModal = $("#scheduleEditModal");
let scheduleEditScenes = $("#scheduleEditScenes");
let modifyScheduleBtn = $("#modifyScheduleBtn");

function setModal(scheduleCallback, sceneCallback) {
  getSchedule = scheduleCallback;
  getScene = sceneCallback;
}
function onAddSchedule(callback) {
  addSchedule = callback;
}
function onModifySchedule(callback) {
  modifySchedule = callback;
}
function onDeleteSchedule(callback) {
  deleteSchedule = callback;
}

(function() {
  scheduleDropdown.on('click', 'li, div, button, td', function (e) {
    e.stopPropagation();
  });
  scheduleDropdown.on('show.bs.dropdown', function (e) {
    scheduleList = getSchedule();
    sceneList = getScene();

    scheduleEditScenes.empty();
    for (let scene of sceneList) {
      scheduleEditScenes.append(
        $('<option></option>').val(scene.id).html(scene.title)
      );
    }

    $('#external-events .fc-event').remove();

    for (let scene of sceneList) {
      let row = "";
      row += '<span class="fc-event label" style="background:'+getSceneColor(scene.id)+'">';
      row += scene.title;
      row += '</span>';
      let $row = $(row);
      $row.data('event', {
        title: scene.title, 
        sceneId: scene.id,
        stick: true,
        color: getSceneColor(scene.id),
        durationEditable: false,
      });
      $row.draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });
      $('#external-events').append($row);
    }
  });

  scheduleDropdown.on('shown.bs.dropdown', function (e) {
    updateCalendar();
  });

  function updateCalendar() {
    calendarDiv.fullCalendar('destroy');
    let calendar = calendarDiv.fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      timezone: "local",
			editable: true,
      allDaySlot: false,
      allDayDefault: false,
      defaultTimedEventDuration: '00:30:00',
      snapDuration: '00:10:00',
			droppable: true, 
      events: getEvents(scheduleList), 
      eventClick: function(calEvent, jsEvent, view) {
        $('#scheduleEditModal').data('scheduleId', calEvent.scheduleId);
        $('#scheduleEditModal').modal();
      },
      eventDrop: function ( event, delta, revertFunc, jsEvent, ui, view ) { 
        let schedule = scheduleWithId(event.scheduleId);
        if (schedule !== undefined) {
          let time = momentToTime(event.start);
          schedule.time = time;
          modifySchedule(schedule);
        }
      },
      eventReceive: function (event) {
        let scene = sceneWithId(event.sceneId);
        let time = momentToTime(event.start);
        let scheduleId = addSchedule(scene, time, false, [false, false, false, false, false, false, false]);
        event.scheduleId = scheduleId;
        scheduleList = getSchedule();
      }
    });
  }

  let scheduleEditVisible = false;

  scheduleDropdown.on('hide.bs.dropdown', function (e) {
    if (scheduleEditVisible) {
      return false;
    }
  });
  scheduleEditModal.on('hidden.bs.modal', function (e) {
    scheduleEditVisible = false;
    scheduleList = getSchedule();
    updateCalendar();
  });

  scheduleEditModal.on('show.bs.modal', function (e) {
    scheduleEditVisible = true;
    let schedule = scheduleWithId(scheduleEditModal.data('scheduleId'));
    let startAt = moment(new Date(schedule.time*1000)).format();
    startAt = startAt.substr(0, 19);
    $('#inputStart').val(startAt);
    scheduleEditScenes.val(schedule.scene.id);

    $('#repeatAllCheckbox').prop('checked', schedule.repeatAll);
    for (let index in schedule.repeatDays) {
      $('#repeatDays [type=checkbox]').eq(index).prop('checked', schedule.repeatDays[index]);
    }
  });

  $('#deleteScheduleBtn').click(function(e) {
    var r = confirm("Are you sure you want to delete this schedule?");
    if (r === true) {
      let schedule = scheduleWithId(scheduleEditModal.data('scheduleId'));
      deleteSchedule(schedule.id);
      scheduleEditModal.modal('hide');
    }
  });

  modifyScheduleBtn.click(function(e) {
    let schedule = scheduleWithId(scheduleEditModal.data('scheduleId'));
    if (schedule !== undefined) {
      let time = moment($('#inputStart').val());
      time = momentToTime(time);
      schedule.time = time;

      let sceneId = scheduleEditScenes.val();
      schedule.scene = sceneWithId(sceneId);

      schedule.repeatAll = $('#repeatAllCheckbox').prop('checked');
      
      let repeatDays = [];
      for (let index = 0; index < 7; index++) {
        let repeatDay = $('#repeatDays [type=checkbox]').eq(index).prop('checked');
        repeatDays[index] = repeatDay;
      }
      schedule.repeatDays = repeatDays;

      modifySchedule(schedule);
    }
    scheduleEditModal.modal('hide');
  });
})();

function getEvents(lbnSchedules) {
  let events = [];
  for (let lbnSchedule of lbnSchedules) {
    events.push(convertLbnScheduleToEvent(lbnSchedule));
  }
  return events;
}

// TODO: Repeat
function convertLbnScheduleToEvent(lbnSchedule) {
  return {
    // TODO: Connect with lbnScene
    "scheduleId": lbnSchedule.id,
    "title": lbnSchedule.scene.title,
    "start": (new Date(lbnSchedule.time*1000)).toISOString(), 
    "color": getSceneColor(lbnSchedule.scene.id),
    durationEditable: false,
  }
}

function scheduleWithId(scheduleId) {
  for (let schedule of scheduleList) {
    if (schedule.id === scheduleId) {
      return schedule;
    }
  }
}

function sceneWithId(sceneId) {
  for (let scene of sceneList) {
    if (scene.id === parseInt(sceneId)) {
      return scene;
    }
  }
}

function momentToTime(m) {
  return Math.round((m).toDate().getTime()/1000);
}

function getSceneColor(sceneId) {
  if (sceneColors[sceneId] === undefined) {
    let r = Math.floor(Math.random() * 170) + 16;
    let g = Math.floor(Math.random() * 170) + 16;
    let b = Math.floor(Math.random() * 170) + 16;
    sceneColors[sceneId] = "#" + r.toString(16) + g.toString(16) + b.toString(16);
  }
  return sceneColors[sceneId];
}
