document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('backgroundMusic').play();
});

document.getElementById('pauseButton').addEventListener('click', function() {
    document.getElementById('backgroundMusic').pause();
});

document.getElementById('playButton').addEventListener('click', function() {
    document.getElementById('backgroundMusic').play();
});

// Configuración principal
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const introScreen = document.getElementById('introScreen');
const playButton = document.getElementById('playButton'); // Botón de Play
// Obtener elementos HTML
const detailsButton = document.getElementById('detailsButton');
const detailsScreen = document.getElementById('detailsScreen');
const backButton = document.getElementById('backButton');

// Evento para mostrar detalles
detailsButton.addEventListener('click', () => {
    introScreen.style.display = 'none';  // Oculta la pantalla de introducción
    detailsScreen.style.display = 'block';  // Muestra la pantalla de detalles
});

// Evento para volver a la pantalla de inicio
backButton.addEventListener('click', () => {
    detailsScreen.style.display = 'none';  // Oculta la pantalla de detalles
    introScreen.style.display = 'block';  // Muestra la pantalla de introducción
});


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let isPaused = false; 
let gameInterval; // Variable para almacenar la referencia del intervalo
let gameStarted = false; // Variable para verificar si el juego ha comenzado
let boss = null;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 50, // Tamaño visual del jugador
    height: 50,
    speed: 10,
    hitboxX: 10, // Ajuste desde el borde izquierdo
    hitboxY: 10, // Ajuste desde el borde superior
    hitboxWidth: 30, // Ancho de la hitbox más pequeño
    hitboxHeight: 30, // Alto de la hitbox más pequeño
};

const bullets = [];// Función para generar enemigos
function spawnEnemy() {
    const fechaActual = Date.now();
    const tiempoTranscurrido = Math.floor((fechaActual - fechaInicial) / 1000); // Redondear a segundos

    const enemy = {
        x: Math.random() * (canvas.width - 80), // Ajustado para el nuevo tamaño
        y: -80, // Ajustado para el nuevo tamaño
        width: 80, // Tamaño visual aumentado
        height: 80,
        speed: 3 + tiempoTranscurrido * 0.5, // Aumentar la velocidad con el tiempo
        hitboxX: 20, // Ajuste desde el borde izquierdo
        hitboxY: 12, // Ajuste desde el borde superior
        hitboxWidth: 34.5, // Hitbox más pequeño en ancho
        hitboxHeight: 40, // Hitbox más pequeño en alto
    };
    enemies.push(enemy);
}
const enemies = [];
let fechaInicial = new Date();

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

// Dibuja el hitbox para propósitos de depuración (opcional)
function drawHitbox(x, y, width, height, color = 'transparent') { 
// con el drawHitbox, se le crea un area, pero se le puede dar color, muy util
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, width, height);
}

// Función para generar enemigos
function spawnEnemy() {
    const fechaActual = Date.now();
    const tiempoTranscurrido = Math.floor((fechaActual - fechaInicial) / 1000); // Redondear a segundos
    const enemy = {
        x: Math.random() * (canvas.width - 80), // Ajustado para el nuevo tamaño
        y: -80, // Ajustado para el nuevo tamaño
        width: 80, // Tamaño visual aumentado
        height: 80,
        speed: tiempoTranscurrido * 0.2, // Aumentar la velocidad con el tiempo
        hitboxX: 20, // Ajuste desde el borde izquierdo
        hitboxY: 12, // Ajuste desde el borde superior
        hitboxWidth: 34.5, // Hitbox más pequeño en ancho
        hitboxHeight: 40, // Hitbox más pequeño en alto
    };
    enemies.push(enemy);
}

// Creación de boss
function spawnBoss() {
    boss = {
        x: 300,
        y: -470,
        width: 700, // Tamaño visual del jefe
        height: 700,
        speed: 1,
        health: 20,
        hitboxX: 260, // Ajuste desde el borde izquierdo
        hitboxY: 280, // Ajuste desde el borde superior
        hitboxWidth: 200, // Ancho extremadamente pequeño
        hitboxHeight: 200, // Alto extremadamente pequeño
    };
}

// Función principal del juego que maneja la animación
function gameLoop() {
    if (isPaused || !gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo y jugador
    drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawImage(sunImage, player.x, player.y, player.width, player.height);
    drawHitbox(player.x + player.hitboxX, player.y + player.hitboxY, player.hitboxWidth, player.hitboxHeight); // Dibuja el hitbox del jugador (opcional)

    // Actualiza las balas
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullets.splice(i, 1); // evitamos que ocupe memoria
        } else {
            drawImage(heartImage, bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }

    // Genera enemigos /////// tenemos que generar una funcion para aumentar la cantidad segun el tiempo y que mejore la velocidad como parametro spawnEnemy
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
        drawHitbox(enemy.x + enemy.hitboxX, enemy.y + enemy.hitboxY, enemy.hitboxWidth, enemy.hitboxHeight); // Dibuja el hitbox del enemigo (opcional)

        // Verifica colisión con el jugador
        if (
            enemy.x + enemy.hitboxX < player.x + player.hitboxX + player.hitboxWidth &&
            enemy.x + enemy.hitboxX + enemy.hitboxWidth > player.x + player.hitboxX &&
            enemy.y + enemy.hitboxY < player.y + player.hitboxY + player.hitboxHeight &&
            enemy.y + enemy.hitboxY + enemy.hitboxHeight > player.y + player.hitboxY
        ) {
            gameOver();
            return;
        }

        // Verifica colisión con las balas
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];
            if (
                bullet.x < enemy.x + enemy.hitboxX + enemy.hitboxWidth &&
                bullet.x + bullet.width > enemy.x + enemy.hitboxX &&
                bullet.y < enemy.y + enemy.hitboxY + enemy.hitboxHeight &&
                bullet.y + bullet.height > enemy.y + enemy.hitboxY
            ) {
                bullets.splice(j, 1);
                enemies.splice(i, 1);
                score += 10;
                scoreElement.textContent = score;
                break; // mala practica revisar otra opcion
            }
        }
    }

    // Lógica del jefe
    if (score % 100 === 0 && score != 0) {
        spawnBoss(); // Genera al jefe
    }
    if (boss) {
        boss.y += boss.speed; // Movimiento del jefe
        drawImage(moonImage, boss.x, boss.y, boss.width, boss.height);
        drawHitbox(boss.x + boss.hitboxX, boss.y + boss.hitboxY, boss.hitboxWidth, boss.hitboxHeight); // Dibuja el hitbox del jefe (opcional)

        // Colisión del jefe con el jugador
        if (
            boss.x + boss.hitboxX < player.x + player.hitboxX + player.hitboxWidth &&
            boss.x + boss.hitboxX + boss.hitboxWidth > player.x + player.hitboxX &&
            boss.y + boss.hitboxY < player.y + player.hitboxY + player.hitboxHeight &&
            boss.y + boss.hitboxY + boss.hitboxHeight > player.y + player.hitboxY
        ) {
            gameOver();
            return;
        }

        // Colisión del jefe con las balas
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (
                bullet.x < boss.x + boss.hitboxX + boss.hitboxWidth &&
                bullet.x + bullet.width > boss.x + boss.hitboxX &&
                bullet.y < boss.y + boss.hitboxY + boss.hitboxHeight &&
                bullet.y + bullet.height > boss.y + boss.hitboxY
            ) {
                bullets.splice(i, 1);
                boss.health -= 1;

                // El jefe es derrotado
                if (boss.health <= 0) {
                    boss = null; // Elimina el jefe
                    score += 50; // Puntos adicionales por derrotar al jefe
                    scoreElement.textContent = score;
                }
                break;// mala practica 
            }
        }
    }

    gameInterval = requestAnimationFrame(gameLoop); // Llama al siguiente cuadro
}

function gameOver() {
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';

    // Tabla
    const scoreTable = document.getElementById("scoreTable").querySelector("tbody");
    
    // Agregar nueva fila
    const newRow = scoreTable.insertRow();
    const cellIndex = newRow.insertCell(0);
    const cellScore = newRow.insertCell(1);
    cellIndex.textContent = "Milu";
    cellScore.textContent = score;

    // Ordenar la tabla de mayor a menor por puntaje
    const rows = Array.from(scoreTable.rows); // Convertir las filas de la tabla a un array
    rows.sort((a, b) => {
        const scoreA = parseInt(a.cells[1].textContent, 10); // Obtener el puntaje de la celda 1
        const scoreB = parseInt(b.cells[1].textContent, 10);
        return scoreB - scoreA; // Ordenar de mayor a menor
    });

    // Vaciar la tabla y volver a agregar las filas ordenadas
    scoreTable.innerHTML = ""; 
    rows.forEach(row => scoreTable.appendChild(row));

    // Mostrar el botón de reinicio
    const restartButton = document.getElementById('restartButton');
    restartButton.style.display = 'block';

    const PuntajeFinal = document.getElementById("finalScore");
    PuntajeFinal.textContent = `Puntaje: ${score}`;

    // Asignar la acción de reinicio al botón
    restartButton.onclick = () => {
        document.getElementById('gameOver').style.display = 'none';
        restartButton.style.display = 'none'; // Ocultar el botón después de usarlo
        restartGame(); // Llama a la función para reiniciar el juego
    };
}


// Función para reiniciar el juego
function restartGame() {
    // Restablece el estado inicial del juego
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('score').textContent = '0'; // Reinicia el puntaje
    fechaInicial = new Date();
    boss='none';
    startGame(); // Llama a tu función principal para iniciar el juego
}


// Función para alternar la pausa
function togglePause() {
    if (!gameStarted) return; // No hacer nada si el juego no ha comenzado
    isPaused = !isPaused; // Cambiar el estado de pausa
    if (isPaused) {
        cancelAnimationFrame(gameInterval); // Detiene el bucle del juego
        pauseButton.style.display = 'none'; // Oculta el botón de pausa
        playButton.style.display = 'inline-block'; // Muestra el botón de play
    } else {
        gameLoop(); // Reanuda el bucle del juego
        pauseButton.style.display = 'inline-block'; // Muestra el botón de pausa
        playButton.style.display = 'none'; // Oculta el botón de play
    }
}
// Agrega eventos a los botones
pauseButton.addEventListener('click', togglePause);
playButton.addEventListener('click', togglePause);
startButton.addEventListener('click', startGame);


// Función para comenzar el juego
function startGame() {
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    introScreen.style.display = 'none';
    enemies.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    gameStarted = true;
    gameLoop();
}

// Agrega un evento al botón de pausa
pauseButton.addEventListener('click', togglePause);

// Agrega un evento al botón de inicio
startButton.addEventListener('click', startGame);

// Función para mover el jugador
document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    if (e.key === 'ArrowLeft') {
        player.x -= player.speed;
        if (player.x + player.width < 0) {
            player.x = canvas.width; // Aparece en el borde derecho
        }
    } else if (e.key === 'ArrowRight') {
        player.x += player.speed;
        if (player.x > canvas.width) {
            player.x = -player.width; // Aparece en el borde izquierdo
        }
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


// Comienza el juego
gameLoop();

