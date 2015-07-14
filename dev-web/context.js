"use strict"

export {setModal, onRuleChange, onRuleEnable};

let getRule;
let getScene;

let ruleList;
let sceneList;

let contextModal = $("#contextModal");
let contextBody = $("#contextModal .modal-body tbody");
let ruleChangeCallback;
let ruleEnableCallback;


function setModal(ruleCallback, sceneCallback) {
  getRule = ruleCallback;
  getScene = sceneCallback;

  contextBody.on('click', 'label', function() {
    let btnId = $(this).attr('id');
    let enable = btnId.charAt(10);
    enable = (enable === "T")?true:false;
    let ruleId = parseInt(btnId.substr(11, 10));
    ruleEnableCallback(ruleId, enable);
    let rule = ruleWithId(ruleId);
    rule.enabled = enable;
  });

  contextBody.on('change', 'select', function() {
    let btnId = $(this).attr('id');
    let ruleId = parseInt(btnId.substr(10, 10));
    let sceneIndex = $(this)[0].selectedIndex;
    let rule = ruleWithId(ruleId);
    rule.scene = sceneList[sceneIndex];
    ruleChangeCallback(rule);
  });
}

function onRuleChange(callback) {
  ruleChangeCallback = callback
}
function onRuleEnable(callback) {
  ruleEnableCallback = callback
}

(function() {
  contextModal.on('show.bs.modal', function (e) {
    ruleList = getRule();
    sceneList = getScene();
    let rows = "";
    for (let rule of ruleList) {
      let row = "";
      row += "<tr>";
      row += "  <td>";     
      row += getRuleEnableButton(rule.id, rule.enabled);
      row += "  </td>";
      row += "  <td>";
      row += "    <dl>";
      row += "      <dt>";
      row += rule.title;
      row += "      </dt>";
      row += "      <dd>";
      row += rule.description;
      row += "      </dd>";
      row += "    </dl>";
      row += "  </td>";
      row += "  <td>";
      row += getSceneListString(rule.id, sceneList, rule.scene.id);
      row += "  </td>";
      row += "</tr>";
      rows += row;
    }
    contextBody.empty();
    contextBody.append(rows);
  })
})();

function getRuleEnableButton(ruleId, state) {
  let result = "";
  result += "<div class='btn-group' data-toggle='buttons'>";     

  let btnId = 'ruleEnableF' + ruleId;
  result += "  <label id='"+btnId+"' class='btn btn-default" + (state?"":" active") + "'>";
  result += "    <input type='radio' name='"+btnId+"' value='0'>Off"; 
  result += "  </label>";

  btnId = 'ruleEnableT' + ruleId;
  result += "  <label id='"+btnId+"' class='btn btn-default" + (state?" active":"") + "'>";
  result += "    <input type='radio' name='"+btnId+"' value='1'>On"; 
  result += "  </label>";
  result += "</div>";
  return result;
}

function getSceneListString(ruleId, sceneList, selectedId) {
  let result = "";
  let selectId = 'ruleSelect' + ruleId;
  result += "<select id='"+selectId+"' class='form-control'>";
  for (let scene of sceneList) {
    if (scene.id === selectedId) {
      result += "  <option selected>";
    } else {
      result += "  <option>";
    }
    result += scene.title;
    result += "  </option>";
  }
  result += "</select>";
  return result;
}

function ruleWithId(ruleId) {
  for (let rule of ruleList) {
    if (rule.id === ruleId) {
      return rule;
    }
  }
}
