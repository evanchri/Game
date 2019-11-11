// Variables

var left = 0;
var right = 0;
var up = 0;
var down = 0;

var xOffset = 0;
var yOffset = 0;

var speed = 8;

var debug = false;

var enemies = [];

var timer = 0;

var health = 200;

var play = true;

// Key Pressed Funtion
document.addEventListener('keydown', function(event) {
  if(play){
    if(event.keyCode == 37 ) {
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
  }
  if(event.keyCode == 80) {
    play = !play;
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

const times = [];
let fps;

function tick() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    tick();
    update();
  });
}

tick();

function update() {
  if(play)
  {
    spawner(timer);
    playerMovement();
    timer++;
    // Cycles through all the enemies
    enemyUpdate();

  }
}

function spawner(time)
{

  if(timer % 1000 == 100)
  {
    createBasicEnemy();
  }

  if(timer % 3000 == 1000)
  {
    createFastEnemy();
  }

  if(timer % 5000 == 3000)
  {
    createSlowEnemy();
  }
}

function enemyUpdate()
{
  var player = document.getElementById("player");
  var px = player.offsetLeft;
  var py = player.offsetTop;
  speed = 8 + enemies.length;
  for(i = 0; i < enemies.length; i++)
  {
    var enemy = enemies[i];
    collision(enemy, px, py);
    enemyMovement(enemy);
  }
}

function playerMovement()
{
  var player = document.getElementById("player");

  xOffset = left + right;
  yOffset = up + down;

  var xPos = player.offsetLeft + xOffset;
  var yPos = player.offsetTop + yOffset;

  xPos = clamp(xPos, 0, window.innerWidth - 48);
  yPos = clamp(yPos, 0, window.innerHeight - 48);

  if(debug)   info(xPos, yPos);
  if(!debug)  reset_info();

  player.style.left = xPos + "px";
  player.style.top = yPos + "px";

}

function enemyMovement(enemy)
{
  var x = enemy.offsetLeft;
  var y = enemy.offsetTop;
  if(x < 0 || x > window.innerWidth - enemy.data["size"])
  {
    enemy.data["xVel"] *= -1;
  }
  if(y < 0 || y > window.innerHeight - enemy.data["size"])
  {
    enemy.data["yVel"] *= -1;
  }

  if(enemy.data["xVel"] < 0)  x += (enemy.data["xVel"] - enemies.length * .01);
  else if(enemy.data["xVel"] >= 0)  x += (enemy.data["xVel"] + enemies.length * .01);


  if(enemy.data["yVel"] < 0) y += (enemy.data["yVel"] - enemies.length * .01);
  else if(enemy.data["yVel"] >= 0) y += (enemy.data["yVel"] + enemies.length * .01);

  enemy.style.left = x + "px";
  enemy.style.top = y + "px";
}

function collision(enemy, px, py)
{
  var ex = enemy.offsetLeft;
  var ey = enemy.offsetTop;
  if(px > ex && py > ey)
  {
    dx = px - ex;
    if(ex + 32 > px && ey + 32 > py)
    {
      loseHealth(enemy.data["damage"]);
    }

  }
  else if (px > ex && py < ey)
  {
    dx = px - ex;
    if(ex + 32 > px && py + 48 > ey)
    {
      loseHealth(enemy.data["damage"]);
    }
  }
  else if (px < ex && py > ey)
  {
    dx = px - ex;
    if(ex < px + 48 && py < ey + 32)
    {
      loseHealth(enemy.data["damage"]);
    }
  }
  else if (px < ex && py < ey)
  {
    dx = px - ex;
    if(ex < px + 48 && py + 48 > ey)
    {
      loseHealth(enemy.data["damage"]);
    }
  }
}

function loseHealth(damage)
{
  var healthbar = document.getElementById("health");
  health -= damage;
  health = clamp(health, 0, 200);
  healthbar.style.width = health + "px";

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
  info.innerHTML = "";
}

function createBasicEnemy()
{

  var element = document.getElementById("background")
  var basicEnemy = document.createElement("div");

  var node = document.createTextNode("");
  basicEnemy.appendChild(node);
  basicEnemy.style.backgroundColor = "red";
  basicEnemy.style.position = "absolute";
  basicEnemy.style.width = 32 + "px";
  basicEnemy.style.height = 32 + "px";
  basicEnemy.style.top = 128 + (Math.round(Math.random() * window.innerHeight - 256)) + "px";
  basicEnemy.style.left = 128 + (Math.round(Math.random() * window.innerWidth - 256)) + "px";
  basicEnemy.data = {"size" : 32, "xVel" : 7, "yVel" : 7, "damage" : 1};

  var placeHolder = document.getElementById("player");
  element.insertBefore(basicEnemy, placeHolder);

  enemies.push(basicEnemy);
}

function createFastEnemy()
{
  var element = document.getElementById("background")
  var fastEnemy = document.createElement("div");

  var node = document.createTextNode("");
  fastEnemy.appendChild(node);
  fastEnemy.style.backgroundColor = "white";
  fastEnemy.style.position = "absolute";
  fastEnemy.style.width = 16 + "px";
  fastEnemy.style.height = 16 + "px";
  fastEnemy.style.top = 128 + (Math.round(Math.random() * window.innerHeight - 256)) + "px";
  fastEnemy.style.left = 128 + (Math.round(Math.random() * window.innerWidth - 256)) + "px";
  fastEnemy.data = {"size" : 16, "xVel" : 5, "yVel" : 12, "damage" : .5};

  var placeHolder = document.getElementById("player");
  element.insertBefore(fastEnemy, placeHolder);

  enemies.push(fastEnemy);
}

function createSlowEnemy()
{
  var element = document.getElementById("background")
  var slowEnemy = document.createElement("div");

  var node = document.createTextNode("");
  slowEnemy.appendChild(node);
  slowEnemy.style.backgroundColor = "orange";
  slowEnemy.style.position = "absolute";
  slowEnemy.style.width = 32 + "px";
  slowEnemy.style.height = 32 + "px";
  slowEnemy.style.top = 128 + (Math.round(Math.random() * window.innerHeight - 256)) + "px";
  slowEnemy.style.left = 128 + (Math.round(Math.random() * window.innerWidth - 256)) + "px";
  slowEnemy.data = {"size" : 32, "xVel" : 3, "yVel" : 3, "damage" : 2};

  var placeHolder = document.getElementById("player");
  element.insertBefore(slowEnemy, placeHolder);

  enemies.push(slowEnemy);
}
