"use strict";

export {login, getPassword, getContext, onSubmitConnect, start};

let loginForm = $("#loginForm");
let connectForm = $("#connectForm");
let userProfile = $("#userProfile");
let passwordInput = $("#passwordInput");
let logoutBtn = $("#logoutBtn");
let serverUrlInput = $("#serverUrlInput");
let connectBtn = $("#connectBtn");
let activeOption = $("#activeOption");
let autoOption = $("#autoOption");
let simulateOption = $("#simulateOption");
let sceneCol = $("#sceneCol");
let controlCol = $("#controlCol");

(function() {
  passwordInput.val(localStorage.getItem("password"));

  logoutBtn.click(function(event) {
    logout();
  });
  activeOption.click(function(event) {
    let $this = $(this);
    let active = !$this.hasClass("active");
    if (active) {
      $this.html(getHtml('toggle-on', 'Online'));
    } else {
      $this.html(getHtml('toggle-off', 'Offline'));
    }
  });
  autoOption.click(function(event) {
    let $this = $(this);
    let active = !$this.hasClass("active");
    if (active) {
      $this.html(getHtml('toggle-on', 'Schedule'));
    } else {
      $this.html(getHtml('toggle-off', 'Schedule'));
    }
  });
  simulateOption.click(function(event) {
    let $this = $(this);
    let active = !$this.hasClass("active");
    if (active) {
      $this.html(getHtml('toggle-on', 'Simulate'));
    } else {
      $this.html(getHtml('toggle-off', 'Simulate'));
    }
  });
  /*
  autoOption.click(function(event) {
    let $this = $(this);
    let active = !$this.hasClass("active");
    $this.html(getHtml('calendar', active?"Schedule":"Auto"));
  });
  simulateOption.click(function(event) {
    let $this = $(this);
    let active = !$this.hasClass("active");
    $this.html(getHtml('globe', active?"Demo":"Simulate"));
  });
  */

  let serverUrl = localStorage.getItem("serverUrl");
  if (!serverUrl) {
    serverUrl = "localhost:9090";
  }
  serverUrlInput.val(serverUrl);

})();

// Exported methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function login(success) {
  if (!success) {
    passwordInput.popover("show");
    return;
  }
  passwordInput.popover("hide");
  loginForm.addClass("hidden");
  userProfile.removeClass("hidden");
  //sceneCol.removeClass("col-md-9");
  //sceneCol.addClass("col-md-6");
  //controlCol.removeClass("hidden");
  let guiControl = $("#gui .folder:eq( 0 )");
  guiControl.css("display", "block");

  localStorage.setItem("password", passwordInput.val());
}

function getPassword() {
  return passwordInput.val();
}

function onSubmitConnect(callback) {
  connectForm.submit(function(event) {
    let serverUrl = "http://"+serverUrlInput.val();
    callback(serverUrl);
    event.preventDefault();
  });
}

function start() {
  localStorage.setItem("serverUrl", serverUrlInput.val());
  disable.apply(serverUrlInput);
  disable.apply(connectBtn);
}

function showDisaster(data) {

}

// Internal methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function logout() {
  loginForm.removeClass("hidden");
  userProfile.addClass("hidden");

  let guiControl = $("#gui .folder:eq( 0 )");
  guiControl.css("display", "none");
  //sceneCol.removeClass("col-md-6").addClass("col-md-9");
  //controlCol.addClass("hidden");
}

function disable() {
  this.prop('disabled', true);
}

function getHtml(fa, title) {
  return '<i class="fa fa-'+fa+'"></i> ' + title;
}


