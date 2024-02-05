const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = 1900;
canvas.height = 900;

const characterImage = new Image();
characterImage.src = 'img/character.png';
characterImage.addEventListener('error', function() {
    console.error('Error');
});

const character = {
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    jumping: false,
    jumpHeight: 300,
    jumpCount: 0,
    jumpSpeed: 20,
    fallSpeed: 20,
    speed: 20,
    gravity: 0
};

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'w':
            if (!character.jumping && character.y >= canvas.height - character.height) {
                character.jumping = true;
                character.jumpCount = 0;
            }
            break;
        case 'a':
            character.x -= character.speed;
            break;
        case 's':
            character.y += character.speed;
            break;
        case 'd':
            character.x += character.speed;
            break;
    }
});

// if the character jumps once, it cannot jump again until it lands

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(characterImage, character.x, character.y, character.width, character.height);

    if (character.jumping) {
        character.y -= character.jumpSpeed;
        character.jumpCount += character.jumpSpeed;
        if (character.jumpCount >= character.jumpHeight) {
            character.jumping = false;
        }
    } else if (character.y < canvas.height - character.height) {
        // Simulate falling down when not jumping
        character.y += character.fallSpeed;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
