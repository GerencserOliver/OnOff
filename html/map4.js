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
characterImage.src = "img2/character-jobb.png";
characterImage.addEventListener("error", function () {
  console.error("Error"); // ha hiba van
});

const character = {
  x: 200,
  y: 0,
  width: 80,
  height: 130,
  jumping: false,
  jumpHeight: 200,
  jumpCount: 0,
  jumpSpeed: 1500,
  fallSpeed: 1000,
  speed: 1000,
  velocityX: 0,
  gravity: 0.28,
  velocityY: 0,
  leftWall: 0, // left wall position
  rightWall: canvas.width, // right wall position
}; // karakter tulajdonságai

function collisionDetection() {
  if (character.x < 0) {
    character.x = 0; // ha a karakter bal széle kimegy a képernyőről, akkor visszahúzzuk
  } else if (character.x > canvas.width - character.width) {
    character.x = canvas.width - character.width; // ha a karakter jobb széle kimegy a képernyőről, akkor visszahúzzuk
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

document.addEventListener("keydown", function (event) {
  // ha lenyomjuk a space-t akkor a platformok színe változik
  if (event.code == "Space") {
    if (isColorSwitched) {
      platform1.style.backgroundColor = "#3b3b3b";
      platform2.style.backgroundColor = "rgb(214, 214, 214)";
      platform3.style.backgroundColor = "#3b3b3b";
      document.body.style.backgroundColor = "#ffffff";
    } else {
      platform1.style.backgroundColor = "#636363";
      platform2.style.backgroundColor = "#ffffff";
      platform3.style.backgroundColor = "#636363";
      document.body.style.backgroundColor = "#3b3b3b";
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
    keys["w"] && // w lenyomva
    character.y == platform1.offsetTop - character.height // karakter a platformon van
  ) {
    character.jumping = true; // ugrás
    character.velocityY = -character.jumpSpeed * dt; // függőleges sebesség
    character.jumpCount = 0; // ugrás számláló
  }

  if (keys["a"]) {
    character.velocityX = -character.speed * dt; // balra mozgás
    characterImage.src = "img2/character-bal.png"; // karakter képének cseréje
  } else if (keys["d"]) {
    character.velocityX = character.speed * dt; // jobbra mozgás
    characterImage.src = "img2/character-jobb.png"; // karakter képének cseréje
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

const platform1 = document.querySelector(".platform1_lvl4");
const platform2 = document.querySelector(".platform2_lvl4");
const platform3 = document.querySelector(".platform3_lvl4");

function characterStandingOnPlatform() {
    var platforms = [platform1, platform2, platform3]; // platform1, platform2 stb. helyett az összes platformot ide kell felsorolni
  
    for (var i = 0; i < platforms.length; i++) {
      var platform = platforms[i];
  
      // Ellenőrizze, hogy a karakter érintkezik-e a platformmal
      if (
        character.x + character.width > platform.offsetLeft &&
        character.x < platform.offsetLeft + platform.offsetWidth &&
        character.y + character.height > platform.offsetTop &&
        character.y < platform.offsetTop + platform.offsetHeight
      ) {
        // Ellenőrizze, hogy a platform színe megfelel-e az elvártnak
        if (
          (!isColorSwitched && platform === platform1) ||
          (!isColorSwitched && platform === platform3) ||
          (isColorSwitched && platform === platform2)
        ) {
          // Ha igen, állítsa be a karakter pozícióját a platform tetejére
          character.y = platform.offsetTop - character.height;
          character.jumping = false; // Megállítjuk az ugrást
          character.velocityY = 0; // Beállítjuk a függőleges sebességet 0-ra
          break; // Ha találtunk egy platformot, kilépünk a ciklusból
        }
      }
    }
  }

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
      window.location.reload();
    }, 1000);
  }
}

let death = 0;
function deathCounter() {
  if (character.y == canvas.height - character.height) {
    death++;
    document.querySelector(".death").innerHTML = "Deaths: " + death;
    StartAgain();
  }
}

let stars = 0;
function starsCollected() {
  if (goalReached) {
    stars++;
    document.querySelector(".stars").innerHTML = "Stars: " + stars;
  }
}

const goal = document.querySelector(".goal1");
function goalReached() {
  if (
    character.x + character.width > goal.offsetLeft &&
    character.x < goal.offsetLeft + goal.offsetWidth &&
    character.y + character.height > goal.offsetTop &&
    character.y < goal.offsetTop + goal.offsetHeight
  ) {
    winAnimation();
    death = -1;
    document.querySelector(".death").innerHTML = "Deaths: " + death;
    stars++;
    document.querySelector(".stars").innerHTML = "Stars: " + stars;
  }
}

function StartAgain() {
  if (character.y == canvas.height - character.height) {
    character.x = 200;
    character.y = 0;
    keys["w"] = false;
    keys["a"] = false;
    keys["d"] = false;
  }
}

function gameLoop() {
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

  requestAnimationFrame(gameLoop);

  characterStandingOnPlatform(); // karakter a platformon áll-e

  deathCounter(); // halál számláló

  goalReached();

  StartAgain(); // újrakezdés
}

gameLoop();