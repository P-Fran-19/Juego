const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('gameOver');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let score = 0;
        const player = {
            x: canvas.width / 2,
            y: canvas.height - 80,
            width: 50,
            height: 50,
            color: 'yellow',
            speed: 10,
        };

        const bullets = [];
        const enemies = [];

        const sunImage = new Image();
        sunImage.src = 'sol.png';

        const heartImage = new Image();
        heartImage.src = 'corazon.png';

        const moonImage = new Image();
        moonImage.src = 'Lunda.png';

        const backgroundImage = new Image();
        backgroundImage.src = 'fondo.png'; // Reemplaza con la URL de tu imagen de fondo


        function drawImage(img, x, y, width, height) {
            ctx.drawImage(img, x, y, width, height);
        }

        function spawnEnemy() {
            const enemy = {
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                speed: 3 + Math.random() * 2,
            };
            enemies.push(enemy);
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw player
            drawImage(sunImage, player.x, player.y, player.width, player.height);

            // Update bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                const bullet = bullets[i];
                bullet.y -= bullet.speed;

                if (bullet.y < 0) {
                    bullets.splice(i, 1);
                } else {
                    drawImage(heartImage, bullet.x, bullet.y, bullet.width, bullet.height);
                }
            }

            // Spawn enemies
            if (Math.random() < 0.02) {
                spawnEnemy();
            }

            // Update enemies
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                enemy.y += enemy.speed;

                if (enemy.y > canvas.height) {
                    enemies.splice(i, 1);
                    continue;
                }

                drawImage(moonImage, enemy.x, enemy.y, enemy.width, enemy.height);

                // Check collision with player
                if (
                    enemy.x < player.x + player.width &&
                    enemy.x + enemy.width > player.x &&
                    enemy.y < player.y + player.height &&
                    enemy.y + enemy.height > player.y
                ) {
                    gameOver();
                    return;
                }

                // Check collision with bullets
                for (let j = bullets.length - 1; j >= 0; j--) {
                    const bullet = bullets[j];
                    if (
                        bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y
                    ) {
                        bullets.splice(j, 1);
                        enemies.splice(i, 1);
                        score += 10;
                        scoreElement.textContent = score;
                        break;
                    }
                }
            }

            requestAnimationFrame(gameLoop);
        }

        function gameOver() {
            gameOverElement.style.display = 'block';
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && player.x > 0) {
                player.x -= player.speed;
            } else if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) {
                player.x += player.speed;
            } else if (e.key === 'ArrowUp' && player.y > 0) {
                player.y -= player.speed;
            } else if (e.key === 'ArrowDown' && player.y + player.height < canvas.height) {
                player.y += player.speed;
            } else if (e.key === ' ') {
                bullets.push({
                    x: player.x + player.width / 2 - 15,
                    y: player.y,
                    width: 30,
                    height: 30,
                    speed: 10,
                });
            }
        });

        gameLoop();