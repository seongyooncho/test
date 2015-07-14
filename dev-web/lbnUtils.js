export function getParameter(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function retrieveModule(id, areaList) {
  for (let area of areaList) {
    for (let floor of area.floors) {
      for (let module of floor.modules) {
        if (module.id === id) {
          return module;
        }
      }
    }
  }
  throw new Error("Cannot find module with id: "+id);
}

export function compareObject(object, target) {
  return JSON.stringify(object) === JSON.stringify(target);
}

export function getHHMM(s) {
	var date = new Date(s*1000);
	var timeString = date.toTimeString().split(" ")[0];
	return timeString.substring(0, 5);
}
