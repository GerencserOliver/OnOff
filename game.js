        const platform1 = document.getElementById('platform1');
        const platform2 = document.getElementById('platform2');
        const player = document.getElementById('player');

        let isColorSwitched = false;
        let playerInterval = null;

        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space') {
                if (isColorSwitched) {
                    platform1.style.backgroundColor = '#d3d3d3';
                    platform2.style.backgroundColor = '#a9a9a9';
                } else {
                    platform1.style.backgroundColor = '#a9a9a9';
                    platform2.style.backgroundColor = '#d3d3d3';
                }
                isColorSwitched = !isColorSwitched;
            }
            if (event.code === 'ArrowLeft') {
                movePlayer('left');
            }
            if (event.code === 'ArrowRight') {
                movePlayer('right');
            }
            if (event.code === 'ArrowUp') {
                jumpPlayer();
            }
        });

        function movePlayer(direction) {
            const platform1Color = getComputedStyle(platform1).backgroundColor;
            if (platform1Color === 'rgb(211, 211, 211)') {
                const currentLeft = parseInt(getComputedStyle(player).left);
                if (direction === 'left' && currentLeft > 50) {
                    player.style.left = currentLeft - 10 + 'px';
                } else if (direction === 'right' && currentLeft < 340) {
                    player.style.left = currentLeft + 10 + 'px';
                }
            }
        }

        function playerFall() {
            const platform1Color = getComputedStyle(platform1).backgroundColor;
            if (platform1Color !== 'rgb(211, 211, 211)') {
                const currentBottom = parseInt(getComputedStyle(player).bottom);
                if (currentBottom > -150) {
                    player.style.bottom = currentBottom - 150 + 'px';
                } else {
                    clearInterval(playerInterval);
                    setTimeout(() => {
                        resetGame();
                    }, 2700);
                }
            }
        }

        function resetGame() {
            platform1.style.backgroundColor = '#d3d3d3';
            platform2.style.backgroundColor = '#a9a9a9';
            isColorSwitched = false;
            player.style.bottom = 'calc(100% - 400px)';
            player.style.left = '50px';
            playerInterval = setInterval(playerFall, 100);
        }

        function setInitialPlayerPosition() {
            player.style.bottom = 'calc(100% - 400px)';
            player.style.left = '50px';
        }

        setInitialPlayerPosition();

        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space') {
                movePlayerToPlatform();
            }
        });

        playerInterval = setInterval(playerFall, 100);