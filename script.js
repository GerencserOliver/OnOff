let lvl = 1;
let playerSpawnX = 0;
let playerSpawnY = 0;
const canvas = document.createElement("canvas"); // rajzolás
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas); // megjelenítés

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
});

const characterImage = new Image(); // karakter kép
characterImage.src = "img/character_vegleges_jobb.png";
characterImage.addEventListener("error", function () {
  console.error("Error"); // ha hiba van
});

const character = {
  x: 0,
  y: 0,
  width: 100,
  height: 120,
  jumping: false,
  jumpHeight: 250,
  jumpCount: 0,
  jumpSpeed: 1500,
  fallSpeed: 1000,
  speed: 750,
  velocityX: 0,
  gravity: 0.5,
  velocityY: 0,
  leftWall: 0, // left wall position
  rightWall: canvas.width, // right wall position
}; // karakter tulajdonságai

function collisionDetection() {
  if (character.x < 0) {
    character.x = 0; // ha a karakter bal széle kimegy a képernyőről, akkor visszahúzzuk
  } else if (character.x > canvas.width - character.width) {
    character.x = canvas.width - character.width; // ha a karakter jobb széle kimegy a képernyőről, akkor visszahúzzuk
  } else if (character.y < 0) {
    character.y = 0; // ha a karakter teteje kimegy a képernyőről, akkor visszahúzzuk
  }
}

// ne lógjon le a karakter a képernyő aljáról
function characterOnGround() {
  if (character.y > canvas.height - character.height) {
    character.y = canvas.height - character.height;
  }
}

const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.key] = true; // ha lenyomjuk a gombot
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false; // ha felengedjük a gombot
});

let isColorSwitched = false;
let playerInterval = null;

let platform1 = document.querySelector(".platform1");
let platform2 = document.querySelector(".platform2");
let platform3 = document.querySelector(".platform1_lvl2");
let platform4 = document.querySelector(".platform2_lvl2");
let platform5 = document.querySelector(".platform3_lvl2");
let platform6 = document.querySelector(".platform1_lvl3");
let platform7 = document.querySelector(".platform2_lvl3");
let platform8 = document.querySelector(".platform1_lvl4");
let platform9 = document.querySelector(".platform2_lvl4");
let platform10 = document.querySelector(".platform1_lvl4");
let platform11 = document.querySelector(".platform1_lvl5");
let platform12 = document.querySelector(".platform2_lvl5");
let platform13 = document.querySelector(".platform3_lvl5");
let platform14 = document.querySelector(".platform4_lvl5");
let platform15 = document.querySelector(".platform5_lvl5");
let platform16 = document.querySelector(".platform6_lvl5");
let platform17 = document.querySelector(".platform7_lvl5");

var platforms = [];

document.addEventListener("keydown", function (event) {
  // ha lenyomjuk a space-t akkor a platformok színe változik
  if (event.code == "Space") {
    if (isColorSwitched) {
      platforms.forEach(platform => {
        platform.style.backgroundColor = "#D3D3D3";
        if (platform.dataset.on == "true") platform.style.backgroundColor = "#3b3b3b";
      });
      document.body.style.backgroundColor = "#ffffff";
    } else {
      platforms.forEach(platform => {
        platform.style.backgroundColor = "#3b3b3b";
        if (platform.dataset.on == "true") platform.style.backgroundColor = "#D3D3D3";
      });
      document.body.style.backgroundColor = "#333333";
    }
    isColorSwitched = !isColorSwitched; // azért kell, hogy a következő lenyomásnál visszaállítsa a színeket
  }
});

var lastUpdate = Date.now();

function updateCharacter() {
  var now = Date.now();
  var dt = (now - lastUpdate) / 1000;
  lastUpdate = now;

  if (
    keys["w"] && lvl == 1 && character.y == platform1.offsetTop - character.height ||
    keys["w"] && lvl == 1 && character.y == platform2.offsetTop - character.height ||
    keys["w"] && lvl == 2 && character.y == platform3.offsetTop - character.height ||
    keys["w"] && lvl == 2 && character.y == platform4.offsetTop - character.height ||
    keys["w"] && lvl == 2 && character.y == platform5.offsetTop - character.height ||
    keys["w"] && lvl == 3 && character.y == platform6.offsetTop - character.height ||
    keys["w"] && lvl == 3 && character.y == platform7.offsetTop - character.height ||
    keys["w"] && lvl == 4 && character.y == platform8.offsetTop - character.height ||
    keys["w"] && lvl == 4 && character.y == platform9.offsetTop - character.height ||
    keys["w"] && lvl == 4 && character.y == platform10.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform11.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform12.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform13.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform14.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform15.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform16.offsetTop - character.height ||
    keys["w"] && lvl == 5 && character.y == platform17.offsetTop - character.height
  ) {
    character.jumping = true; // ugrás
    character.velocityY = -character.jumpSpeed * dt; // függőleges sebesség
    character.jumpCount = 0; // ugrás számláló
  }

  if (keys["a"]) {
    character.velocityX = -character.speed * dt; // balra mozgás
    characterImage.src = "img/character_vegleges_bal.png"; // karakter képének cseréje
  } else if (keys["d"]) {
    character.velocityX = character.speed * dt; // jobbra mozgás
    characterImage.src = "img/character_vegleges_jobb.png"; // karakter képének cseréje
  } else {
    character.velocityX = 0; // ha nem nyomjuk a gombot, akkor nem mozog
  }

  character.x += character.velocityX;

  if (character.jumping) {
    character.y += character.velocityY; // ha ugrunk, akkor a karakter felfelé mozog
    character.velocityY += character.gravity;

    character.jumpCount += Math.abs(character.velocityY); // ugrás számláló
    if (character.jumpCount >= character.jumpHeight) {
      character.jumping = false; // ha elértük a maximális ugrás magasságot, akkor lefelé kezdünk mozogni
      character.velocityY = 0;
    }
  } else if (character.y < canvas.height - character.height) {
    character.y += character.fallSpeed * dt; // ha a karakter a levegőben van, akkor lefelé mozog
  }
}

function characterMovingAnimation() {
  if(keys["a"]){
    let toggle = false;
    let IntervalId = setInterval(() => {
      if(toggle){
        characterImage.src = "img/character_vegleges_ballab_bal.png";
      } else{
        characterImage.src = "img/character_vegleges_jobblab_bal.png";
      }
      toggle = !toggle;
    }, 10);

    window.addEventListener("keyup", function(e){
      if(e.key == "a"){
        clearInterval(IntervalId);
        characterImage.src = "img/character_vegleges_bal.png";
      }
    })
  }

  if(keys["d"]){
    let toggle = false;
    let intervalId = setInterval(() => {
      if(toggle){
        characterImage.src = "img/character_vegleges_jobblab_jobb.png";
      } else{
        characterImage.src = "img/character_vegleges_ballab_jobb.png";
      }
      toggle = !toggle;
    }, 10);
    window.addEventListener("keyup", function(e){
      if(e.key == "d"){
        clearInterval(intervalId);
        characterImage.src = "img/character_vegleges_jobb.png";
      }
    })
  }
}

function characterStandingOnPlatform() {
  platform1 = document.querySelector(".platform1");
  platform2 = document.querySelector(".platform2");
  platform3 = document.querySelector(".platform1_lvl2");
  platform4 = document.querySelector(".platform2_lvl2");
  platform5 = document.querySelector(".platform3_lvl2");
  platform6 = document.querySelector(".platform1_lvl3");
  platform7 = document.querySelector(".platform2_lvl3");
  platform8 = document.querySelector(".platform1_lvl4");
  platform9 = document.querySelector(".platform2_lvl4");
  platform10 = document.querySelector(".platform3_lvl4");
  platform11 = document.querySelector(".platform1_lvl5");
  platform12 = document.querySelector(".platform2_lvl5");
  platform13 = document.querySelector(".platform3_lvl5");
  platform14 = document.querySelector(".platform4_lvl5");
  platform15 = document.querySelector(".platform5_lvl5");
  platform16 = document.querySelector(".platform6_lvl5");
  platform17 = document.querySelector(".platform7_lvl5");

  if (lvl == 1) {
    platforms = [platform1, platform2];
  } else if (lvl == 2) {
    platforms = [platform3, platform4, platform5];
  } else if (lvl == 3){
    platforms = [platform6, platform7];
  } else if (lvl == 4) {
    platforms = [platform8, platform9, platform10];
  } else if (lvl == 5){
    platforms = [platform11, platform12, platform13, platform14, platform15, platform16, platform17];
  }

  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];

    if (isColorSwitched) {
      if (platform.dataset.on == "true") continue;
    } else {
      if (platform.dataset.on == "false") continue;
    }

    if (
      character.x + character.width > platform.offsetLeft &&
      character.x < platform.offsetLeft + platform.offsetWidth &&
      character.y + character.height > platform.offsetTop &&
      character.y < platform.offsetTop + platform.offsetHeight &&
      character.y + character.height < platform.offsetTop + 110
    ) {
      character.y = platform.offsetTop - character.height;
      character.jumping = false;
    }
  }
}

function BottomPlatformCollision() {
  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];

    if (isColorSwitched) {
      continue;
    }

    if (
      character.x + character.width > platform.offsetLeft &&
      character.x < platform.offsetLeft + platform.offsetWidth &&
      character.y + character.height > platform.offsetTop &&
      character.y < platform.offsetTop + platform.offsetHeight
    ) {
      if (character.y + character.height > platform.offsetTop + platform.offsetHeight) {
        character.y = platform.offsetTop + platform.offsetHeight;
      }
    }
  }
}

function sidePlatformCollision(){
  for(var i = 0; i < platforms.length; i++){
    var platform = platforms[i];

    if(isColorSwitched){
      if(platform.dataset.on == "true") continue;
    } else{
      if(platform.dataset.on == "false") continue;
    }

    if (
      character.x + character.width > platform.offsetLeft &&
      character.x < platform.offsetLeft + platform.offsetWidth &&
      character.y + character.height > platform.offsetTop &&
      character.y < platform.offsetTop + platform.offsetHeight
    ) {
      if (character.x < platform.offsetLeft) {
        // A karakter bal oldala érinti a platform jobb oldalát
        character.x = platform.offsetLeft - character.width; 
      } else if (character.x + character.width > platform.offsetLeft + platform.offsetWidth) {
        // A karakter jobb oldala érinti a platform bal oldalát
        character.x = platform.offsetLeft + platform.offsetWidth;
      }
    }
  }
}

let isTabActive = true;

document.addEventListener("visibilitychange", function() {
  if(document.hidden){
    isTabActive = false;
    death -= 1;
  } else{
    isTabActive = true;
    gameLoop();
  }
});


function winAnimation() {
  if (goalReached) {
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "#3b3b3b";
    const win = document.createElement("h1");
    win.innerHTML = "You won!";
    win.style.color = "white";
    win.style.textAlign = "center";
    win.style.fontSize = "100px";
    win.style.marginTop = "50vh";
    document.body.appendChild(win);
    setTimeout(() => {
    }, 1000);
  }
}

let death = 0;
function deathCounter() {
  if (character.y == canvas.height - character.height) {
    death++;
    document.querySelector(".death").innerHTML = "Deaths: " + death;
  }
}

let stars = 0;
function starsCollected() {
  if (goalReached) {
    stars++;
    document.querySelector(".stars").innerHTML = "Stars: " + stars;
  }
}

var goals =[]

function goalReached() {
  const goal1 = document.querySelector(".goal1");
  const goal2 = document.querySelector(".goal2");
  const goal3 = document.querySelector(".goal3");
  const goal4 = document.querySelector(".goal4");
  
  if(lvl == 1){
    goals = [goal1];
  } else if (lvl == 2){
    goals = [goal2];
  } else if(lvl == 3){
    goals = [goal3];
  } else if(lvl == 4){
    goals = [goal4];
  }

  for (var i = 0; i < goals.length; i++) {
    var goal = goals[i];

    if (
      character.x + character.width > goal.offsetLeft &&
      character.x < goal.offsetLeft + goal.offsetWidth &&
      character.y + character.height > goal.offsetTop &&
      character.y < goal.offsetTop + goal.offsetHeight
    ) {
      lvl++;
      keys["w"] = false;
      keys["a"] = false;
      keys["d"] = false;
      spawnMap();
      document.querySelector(".death").innerHTML = "Deaths: " + death;
      stars++;
      document.querySelector(".stars").innerHTML = "Stars: " + stars;
    }
  }
}

function StartAgain() {
  if (character.y == canvas.height - character.height) {
    character.x = playerSpawnX;
    character.y = playerSpawnY;
    keys["w"] = false;
    keys["a"] = false;
    keys["d"] = false;
  }
}

function spawnMap() {
  const map = document.querySelector("#map");
  map.innerHTML = "";
  if (lvl == 1) {
    let p1 = document.createElement("div");
    let p2 = document.createElement("div");
    p1.className = "platform1";
    p2.className = "platform2";
    map.appendChild(p1);
    map.appendChild(p2);
    playerSpawnX = 0;
    playerSpawnY = 0;
  } else if (lvl == 2) {
    let p3 = document.createElement("div");
    let p4 = document.createElement("div");
    let p5 = document.createElement("div");
    let goal2 = document.createElement("div");
    p3.className = "platform1_lvl2";
    p3.dataset.on = "true";
    p4.className = "platform2_lvl2";
    p4.dataset.on = "true";
    p5.className = "platform3_lvl2";
    p5.dataset.on = "false";
    goal2.className = "goal2";
    map.appendChild(p3);
    map.appendChild(p4);
    map.appendChild(p5);
    map.appendChild(goal2);
    playerSpawnX = 300;
    playerSpawnY = 0;
  } else if (lvl == 3){
    let p6 = document.createElement("div");
    let p7 = document.createElement("div");
    let goal3 = document.createElement("div");
    p6.className = "platform1_lvl3";
    p6.dataset.on = "true";
    p7.className = "platform2_lvl3";
    p7.dataset.on = "false";
    goal3.className = "goal3";
    map.appendChild(p6);
    map.appendChild(p7);
    playerSpawnX = 200;
    playerSpawnY = 0;
  } else if (lvl == 4){
    let p8 = document.createElement("div");
    let p9 = document.createElement("div");
    let p10 = document.createElement("div");
    p8.className = "platform1_lvl4";
    p8.dataset.on = "true";
    p9.className = "platform2_lvl4";
    p9.dataset.on = "false";
    p10.className = "platform3_lvl4";
    p10.dataset.on = "true";
    map.appendChild(p8);
    map.appendChild(p9);
    map.appendChild(p10);
    playerSpawnX = 200;
    playerSpawnY = 0;
  } else if (lvl == 5){
    let p11 = document.createElement("div");
    let p12 = document.createElement("div");
    let p13 = document.createElement("div");
    let p14 = document.createElement("div");
    let p15 = document.createElement("div");
    let p16 = document.createElement("div");
    let p17 = document.createElement("div");
    p11.className = "platform1_lvl5";
    p11.dataset.on = "true";
    p12.className = "platform2_lvl5";
    p12.dataset.on = "true";
    p13.className = "platform3_lvl5";
    p13.dataset.on = "true";
    p14.className = "platform4_lvl5";
    p14.dataset.on = "true";
    p15.className = "platform5_lvl5";
    p15.dataset.on = "true";
    p16.className = "platform6_lvl5";
    p16.dataset.on = "false";
    p17.className = "platform7_lvl5";
    p17.dataset.on = "false";
    map.appendChild(p11);
    map.appendChild(p12);
    map.appendChild(p13);
    map.appendChild(p14);
    map.appendChild(p15);
    map.appendChild(p16);
    map.appendChild(p17);
    playerSpawnX = 250;
    playerSpawnY = 500;
  }
  character.x = playerSpawnX;
  character.y = playerSpawnY;
  let goal = document.createElement("div");
  goal.innerHTML = `<img src="img/goal.png" class="goal${lvl}" alt="" />`;
  map.appendChild(goal);
}


function gameLoop() {
  if (!isTabActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // képernyő törlése
  ctx.drawImage(
    characterImage,
    character.x,
    character.y,
    character.width,
    character.height
  ); // karakter rajzolása

  updateCharacter(); // karakter mozgatása

  collisionDetection(); // ütközés detektálás

  characterOnGround(); // karakter a földön van-e

  characterStandingOnPlatform(); // karakter a platformon áll-e

  deathCounter(); // halál számláló

  goalReached();

  BottomPlatformCollision();

  sidePlatformCollision();

  characterMovingAnimation();

  StartAgain(); // újrakezdés

  setTimeout(gameLoop, 1000 / 60); // 60 fps
}

gameLoop();
