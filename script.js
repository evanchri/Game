// Variables

var left = 0;
var right = 0;
var up = 0;
var down = 0;

var xOffset = 0;
var yOffset = 0;

var speed = 5;


// Key Pressed Funtion
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
      left = -speed;
    }
    if(event.keyCode == 39) {
      right = speed;
    }
    if(event.keyCode == 38) {
      up = -speed;
    }
    if(event.keyCode == 40) {
      down = speed;
    }

});

// Key Released Function
document.addEventListener('keyup', function(event) {
    if(event.keyCode == 37) {
      left = 0;
    }
    if(event.keyCode == 39) {
      right = 0;
    }
    if(event.keyCode == 38) {
      up = 0;
    }
    if(event.keyCode == 40) {
      down = 0;
    }
});


// This function is our tick method meaning it runs every 5 milliseconds, and keeps track of everything that is going on
var tick = setInterval(frame, 5);
function frame() {
  var player = document.getElementById("player");
  var info = document.getElementById("info");

  xOffset = left + right;
  yOffset = up + down;

  var xPos = player.offsetLeft + xOffset;
  var yPos = player.offsetTop + yOffset;

  info.innerHTML = "X: " + xPos + "<br> Y: " + yPos;

  player.style.left = xPos + "px";
  player.style.top = yPos + "px";
}
