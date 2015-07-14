"use strict"

export {setDropdown, onPreviewScene, onAddScene, onModifyScene, onDeleteScene};

let getScene;
let previewScene;
let addScene;
let modifyScene;
let deleteScene;

let sceneDropdown = $("#sceneDropdown");
let sceneBody = $("#sceneDropdown ul");
let addSceneBtn = $("#addSceneBtn");

let sceneList;

function setDropdown(callback) {
  getScene = callback;
}

function onPreviewScene(callback) {
  previewScene = callback;
}

function onAddScene(callback) {
  addScene = callback;
}

function onModifyScene(callback) {
  modifyScene = callback;
}

function onDeleteScene(callback) {
  deleteScene = callback;
}

(function() {
  sceneDropdown.on('show.bs.dropdown', function (e) {
    updateSceneList(-1);
  })
  sceneDropdown.on('hide.bs.dropdown', function (e) {
    previewScene(-1);
  });
  sceneDropdown.on('click', 'li', function (e) {
    e.stopPropagation();
    let liId = $(this).attr('id');
    let sceneId = parseInt(liId.substr(5, 10));
    previewScene(sceneId);
  });
  sceneDropdown.on('click', 'button', function (e) {
    e.stopPropagation();
  });
  sceneDropdown.on('click', '.sceneModifyBtn', function (e) {
    let liId = $(this).parent().parent().attr('id');
    let sceneId = parseInt(liId.substr(5, 10));
    let scene = sceneWithId(sceneId);
		let newTitle = prompt("Modify this scene with current state.\nPlease rename title.", scene.title);
		if (newTitle != null) {
			if (newTitle.length > 0) {
				scene.title = newTitle;
        modifyScene(scene);
				updateSceneList(-1);
			} else {
				alert("Please enter title.");
			}
		}
  });
  sceneDropdown.on('click', '.sceneDeleteBtn', function (e) {
    var r = confirm("Are you sure you want to delete this scene?");
    if (r === true) {
      let liId = $(this).parent().parent().attr('id');
      let sceneId = parseInt(liId.substr(5, 10));
      deleteScene(sceneId);
      updateSceneList(-1);
    }
  });
  addSceneBtn.click(function(e) {
		let sceneTitle = prompt("Add current state to new scene.\nPlease enter title.", "Scene title");
		if (sceneTitle != null) {
			if (sceneTitle.length > 0) {
				addScene(sceneTitle);
        updateSceneList(-1);
			} else {
				alert("Please enter title.");
			}
		}
  });
})();

function sceneWithId(sceneId) {
  for (let scene of sceneList) {
    if (scene.id === sceneId) {
      return scene;
    }
  }
}

function updateSceneList(selectedId) {
  sceneList = getScene();
  let rows = "";

  for (let scene of sceneList) {
    let row = "";
    let sceneId = "scene"+scene.id;
    row += '<li id="'+sceneId+'" role="presentation" class="sceneItem">';
    row += '  <a role="menuitem" tabindex="-1" href="#">';
    row += '    <span style="display:inline-block;width: calc(100% - 70px);">' + scene.title + '</span>';
    row += '    <button type="button" class="btn btn-sm btn-default sceneModifyBtn"><span class="glyphicon glyphicon-pencil"></span></button>';
    row += '    <button type="button" class="btn btn-sm btn-default sceneDeleteBtn"><span class="glyphicon glyphicon-trash"></span></button>';
    row += '  </a>';
    row += '</li>';
    rows += row;
  }

  sceneBody.children(".sceneItem").remove();
  sceneBody.append(rows);

  previewScene(selectedId);
}
