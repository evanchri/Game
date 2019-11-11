// Variables

var left = 0;
var right = 0;
var up = 0;
var down = 0;

var xOffset = 0;
var yOffset = 0;

var speed = 8;

var enemies = [];

var timer = 0;

var health = 200;

var play = true;
var dead = false;

function init()
{

}


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
  if(play && !dead)
  {
    spawner(timer);
    playerMovement();
    timer++;
    // Cycles through all the enemies
    enemyUpdate();
    updateScore(timer);
  }
}

function updateScore(timer)
{
  var stats = document.getElementById("stats");
  stats.innerHTML = "Health: " + Math.round(health / 2) + "<br>Score: " + Math.round(timer / 10) + "<br>Enemies: " + enemies.length;

  var info = document.getElementById("info");
  info.innerHTML = "Press R to Restart!";


}

function spawner(time)
{

  if(timer % 500 == 150)
  {
    createBasicEnemy();
  }

  if(timer % 750 == 350)
  {
    createFastEnemy();
  }

  if(timer % 1000 == 225)
  {
    createSlowEnemy();
  }

  if(timer == 5000 || timer == 2500)
  {
    createSmartEnemy();
  }

}

function enemyUpdate()
{
  var player = document.getElementById("player");
  var px = player.offsetLeft;
  var py = player.offsetTop;
  speed = 8 + enemies.length * .1;
  for(i = 0; i < enemies.length; i++)
  {
    var enemy = enemies[i];
    collision(enemy, px, py);
    enemyMovement(enemy, player);
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

  player.style.left = xPos + "px";
  player.style.top = yPos + "px";

}

function enemyMovement(enemy, player)
{

  var ex = enemy.offsetLeft;
  var ey = enemy.offsetTop;
  var px = player.offsetLeft;
  var py = player.offsetTop;

  if(enemy.data['id'] != "smart")
  {
    if(ex < 0 || ex > window.innerWidth - enemy.data["size"])
    {
      enemy.data["xVel"] *= -1;
    }
    if(ey < 0 || ey > window.innerHeight - enemy.data["size"])
    {
      enemy.data["yVel"] *= -1;
    }

    if(enemy.data["xVel"] < 0)  ex += (enemy.data["xVel"] - enemies.length * .05);
    else if(enemy.data["xVel"] >= 0)  ex += (enemy.data["xVel"] + enemies.length * .05);

    if(enemy.data["yVel"] < 0) ey += (enemy.data["yVel"] - enemies.length * .05);
    else if(enemy.data["yVel"] >= 0) ey += (enemy.data["yVel"] + enemies.length * .05);

    enemy.style.left = ex + "px";
    enemy.style.top = ey + "px";
  }
  else
  {
    var dx = (px+24) - (ex + enemy.data['size'] / 2);
    var dy = (py+24) - (ey + enemy.data['size'] / 2);

    var aa = 0;

    if(dx <= 0) aa = Math.PI - Math.atan(dy/dx);
    if(dx > 0) aa = 2*Math.PI - Math.atan(dy/dx);

    var xx = Math.cos(aa) * enemy.data["speed"];
    var yy = Math.sin(aa) * enemy.data["speed"];

    console.log("XX: " + xx +" YY: " + yy);

    ex += xx;
    ey -= yy;

    enemy.style.left = ex + "px";
    enemy.style.top = ey + "px";

  }
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

  if(health == 0)
  {
    dead = true;
  }

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
  basicEnemy.data = {"id": "basic", "size" : 32, "xVel" : 7, "yVel" : 7, "damage" : 1};

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
  fastEnemy.data = {"id": "fast", "size" : 16, "xVel" : 5, "yVel" : 12, "damage" : .5};

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
  slowEnemy.data = {"id": "slow", "size" : 32, "xVel" : 3, "yVel" : 3, "damage" : 2};

  var placeHolder = document.getElementById("player");
  element.insertBefore(slowEnemy, placeHolder);

  enemies.push(slowEnemy);
}

function createSmartEnemy()
{
  var element = document.getElementById("background")
  var smartEnemy = document.createElement("div");

  var node = document.createTextNode("");
  smartEnemy.appendChild(node);
  smartEnemy.style.backgroundColor = "#FF00FF";
  smartEnemy.style.position = "absolute";
  smartEnemy.style.width = 32 + "px";
  smartEnemy.style.height = 32 + "px";
  smartEnemy.style.top = 50 + "vh"//128 + (Math.round(Math.random() * window.innerHeight - 256)) + "px";
  smartEnemy.style.left =  50 + "vh"//128 + (Math.round(Math.random() * window.innerWidth - 256)) + "px";
  smartEnemy.data = {"id" : "smart", "size" : 32, "speed" : 2, "damage" : 2};

  var placeHolder = document.getElementById("player");
  element.insertBefore(smartEnemy, placeHolder);

  enemies.push(smartEnemy);
}
