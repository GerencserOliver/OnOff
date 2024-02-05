const canvas = document.createElement("canvas"); // rajzolás
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas); // megjelenítés

canvas.width = 1900;
canvas.height = 900;

const characterImage = new Image(); // karakter kép
characterImage.src = "img/character.png";
characterImage.addEventListener("error", function () {
  console.error("Error"); // ha hiba van
});

const character = {
  x: 0,
  y: 0,
  width: 150,
  height: 150,
  jumping: false,
  jumpHeight: 350,
  jumpCount: 0,
  jumpSpeed: 15,
  fallSpeed: 5,
  speed: 5,
  velocityX: 0,
  gravity: 0.5,
}; // karakter tulajdonságai

const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.key] = true; // ha lenyomjuk a gombot
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false; // ha felengedjük a gombot
});

function updateCharacter() {
  if (
    keys["w"] &&
    !character.jumping && // ha lenyomjuk a w-t és nem ugrunk (nem a levegőben vagyunk)
    character.y >= canvas.height - character.height // és a karakter a földön van
  ) {
    character.jumping = true; // akkor ugrunk
    character.jumpCount = 0;
    character.velocityY = -character.jumpSpeed;
  }

  if (keys["a"]) {
    character.velocityX = -character.speed; // balra mozgás
  } else if (keys["d"]) {
    character.velocityX = character.speed; // jobbra mozgás
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
    character.y += character.fallSpeed; // ha a karakter a levegőben van, akkor lefelé mozog
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

  requestAnimationFrame(gameLoop);
}

gameLoop();
