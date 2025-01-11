// Configuración principal
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const introScreen = document.getElementById('introScreen');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let isPaused = false; // Variable para controlar la pausa
let gameInterval; // Variable para almacenar la referencia del intervalo
let gameStarted = false; // Variable para verificar si el juego ha comenzado

const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 50,
    height: 50,
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

// Función para dibujar imágenes en el canvas
function drawImage(img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);
}

// Función para generar enemigos
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

// Función principal del juego que maneja la animación
function gameLoop() {
    if (isPaused || !gameStarted) return; // Si el juego está en pausa o no ha comenzado, no hace nada

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo y jugador
    drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawImage(sunImage, player.x, player.y, player.width, player.height);

    // Actualiza las balas
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullets.splice(i, 1);
        } else {
            drawImage(heartImage, bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }

    // Genera enemigos
    if (Math.random() < 0.02) spawnEnemy();

    // Actualiza los enemigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += enemy.speed;

        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            continue;
        }

        drawImage(moonImage, enemy.x, enemy.y, enemy.width, enemy.height);

        // Verifica colisión con el jugador
        if (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        ) {
            gameOver();
            return;
        }

        // Verifica colisión con las balas
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

    gameInterval = requestAnimationFrame(gameLoop); // Llama al siguiente cuadro
}

// Función para finalizar el juego
function gameOver() {
    gameStarted = false;
    isPaused = false;
    cancelAnimationFrame(gameInterval); // Detiene el bucle del juego
    gameOverElement.style.display = 'block';
    introScreen.style.display = 'block'; // Muestra la pantalla de introducción de nuevo
    gameOverElement.textContent = "Moon Over! Your score: " + score;
}

// Función para alternar la pausa
function togglePause() {
    if (!gameStarted) return;
    isPaused = !isPaused;
    if (isPaused) {
        cancelAnimationFrame(gameInterval); // Detiene el bucle del juego
    } else {
        gameLoop(); // Reanuda el bucle del juego
    }
}

// Función para comenzar el juego
function startGame() {
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none'; // Oculta la pantalla de Game Over
    introScreen.style.display = 'none'; // Oculta la pantalla de introducción
    enemies.length = 0; // Limpia los enemigos
    bullets.length = 0; // Limpia las balas
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    gameStarted = true; // Marca el juego como comenzado
    gameLoop(); // Inicia el bucle del juego
}

// Agrega un evento al botón de pausa
pauseButton.addEventListener('click', togglePause);

// Agrega un evento al botón de inicio
startButton.addEventListener('click', startGame);

// Función para mover el jugador
document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

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
    } else if (e.key === 'p' || e.key === 'P') {
        togglePause(); // Pausa al presionar 'P'
    }
});


