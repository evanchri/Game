// Variables

var left = 0;
var right = 0;
var up = 0;
var down = 0;

var xOffset = 0;
var yOffset = 0;

var speed = 5;

var debug = false;

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
    if(event.keyCode == 77) {
      debug = !debug;
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

  movement();

}

function movement()
{
  var player = document.getElementById("player");

  xOffset = left + right;
  yOffset = up + down;

  var xPos = player.offsetLeft + xOffset;
  var yPos = player.offsetTop + yOffset;

  xPos = clamp(xPos, 0, window.innerWidth - 50);
  yPos = clamp(yPos, 0, window.innerHeight - 50);
  // if(xPos < 0){
  //   xPos = 0;
  // }else if(xPos > window.innerWidth - 50){
  //   xPos = window.innerWidth - 50;
  // }
  //

  if(debug)   info(xPos, yPos);
  if(!debug)  reset_info();

  player.style.left = xPos + "px";
  player.style.top = yPos + "px";

}

function clamp(num, mini, maxi)
{
  if(num < mini)
  {
    return mini;
  }
  else if(num > maxi)
  {
    return maxi;
  }
  else
  {
    return num;
  }
}

function info(xPos, yPos)
{
  var info = document.getElementById("info");
  info.innerHTML = "X: " + xPos + "<br> Y: " + yPos;
}

function reset_info()
{
  var info = document.getElementById("info");
  info.style.backgroundColor = "transparent"
  info.innerHTML = null;



}
