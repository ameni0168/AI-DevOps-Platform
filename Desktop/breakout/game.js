const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = "10px solid #842E1B";
ctx.lineWidth = 1;
let leftarrow = false;
let rightarrow = false;
let life = 10;
let score = 0;
let level = 1;
let gameOverFlag = false;
let bricksDestroyed = 0; // Compteur de briques détruites
let ispaused=false;
let isPaddleWidened=false;
// Les constantes appropriées pour la raquette
const paddle_width = 100;
const paddle_margin_bottom = 20;
const paddle_height = 10;
const ball_radius = 10;
const scoU = 10;
const maxlevel = 3;
// Propriétés de la raquette
const paddle = {
  x: canvas.width / 2 - paddle_width / 2,
  y: canvas.height - paddle_margin_bottom - paddle_height,
  w: paddle_width,
  h: paddle_height,
  dx: 8
};

// Propriétés de la balle
const ball = {
  x: canvas.width / 2,
  y: paddle.y - ball_radius,
  radius: ball_radius,
  velocity: 3,
  // Initialisez ball.dx pour s'assurer que la balle se déplace horizontalement
  dx: 3 * (Math.random() * 2 - 1), 
  dy: -3,
  isFireBall: false,
  isBlocked: false, 
};

// Dessiner la raquette
function drawpaddle() {
  // Effacer l'ancienne raquette
  ctx.clearRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.beginPath();
  ctx.fillStyle = "#842E1B";
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.strokeStyle = "#842E1B";
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.stroke();
  ctx.closePath();
}

// Mise en place des touches de contrôle
document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft" || e.key == "Left") {
    leftarrow = true;
  } else if (e.key == "ArrowRight" || e.key == "Right") {
    rightarrow = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key == "ArrowLeft" || e.key == "Left") {
    leftarrow = false;
  } else if (e.key == "ArrowRight" || e.key == "Right") {
    rightarrow = false;
  }
});

function movepaddle() {
  if (leftarrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  } else if (rightarrow && paddle.x + paddle.w < canvas.width) {
    paddle.x += paddle.dx;
  }
}

// Dessiner la balle
function drawball() {
  ctx.beginPath();
  if (ball.isFireBall) {
    let gradient = ctx.createRadialGradient(
      ball.x,
      ball.y,
      ball.radius / 4,
      ball.x,
      ball.y,
      ball.radius
    );
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(0.5, "orange");
    gradient.addColorStop(1, "darkred");
    ctx.fillStyle = gradient;
  } else {
    // Désactiver l'effet de lueur pour une balle normale
    ctx.shadowBlur = 0;
    ctx.fillStyle = "black";
  }

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

// Déplacer la balle
function moveball() {
  ball.x += ball.dx; // Mise à jour de la position horizontale
  ball.y += ball.dy; // Mise à jour de la position verticale
}

// Collision balle / murs
function bwcollision() {
  // Collision sur l'axe des X (bords gauche et droit)
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius <= 0) {
    wall_hit.play();
    ball.dx *= -1; // Inverser la direction horizontale
  }

  // Collision sur l'axe des Y (mur supérieur)
  if (ball.y - ball.radius < 0) {
    wall_hit.play();
    ball.dy *= -1; // Inverser la direction verticale
  }

  // Collision avec le mur inférieur (si la balle touche le bas)
  if (ball.y + ball.radius > canvas.height) {
    life_lost.play();
    life--;
    resetball();
    resetpaddle();
  }
}

// Réinitialiser la balle
function resetball() {
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ball_radius;
  ball.dx = 3 * (Math.random() * 2 - 1); // Re-générer une direction aléatoire pour ball.dx
  ball.dy = -3; // Réinitialiser la direction verticale
}
// proprite des briques
const brickprop = {
  row: 3,
  column: 13,
  w: 35,
  h: 10,
  padding: 3,
  offsetx: 55,
  offsety: 40,
  fillColor: "#842E1B",
  visible: true,
};
// creation de toutes les brique
let bricks = [];
function createbrick() {
  for (let r = 0; r < brickprop.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickprop.column; c++) {
      bricks[r][c] = {
        x: c * (brickprop.w + brickprop.padding) + brickprop.offsetx,
        y: r * (brickprop.h + brickprop.padding) + brickprop.offsety,
        status: true,
        ...brickprop,
      };
    }
  }
}
createbrick();
//dessiner les briques
function drawbrick() {
  bricks.forEach((column) =>
    column.forEach((brick) => {
      if (brick.status) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.fillColor;
        ctx.fill();
        ctx.closePath();
      }
    })
  );
}
drawbrick();

// Initialiser les bonus
let bonuses = [
    {
      x: 100,
      y: 50,
      active: true,
      type: "fireBall",
      angle: Math.PI / 4,
    },
    {
      x: 200,
      y: 100,
      active: true,
      type: "block",
      angle: Math.PI / 8,
    },
    {
      x: 300,
      y: 150,
      active: true,
      type: "extraLife",
      angle: Math.PI / 2,
    },
];
  
// Dessiner les bonus
function drawBonuses() {
for (let i = 0; i < bonuses.length; i++) {
    const bonus = bonuses[i];
    if (bonus.active) {
        // Afficher un emoji pour chaque type de bonus sans carré
        ctx.fillStyle = "white"; // Couleur du texte (emoji)
        ctx.font = "30px sans-serif"; // Police standard plus grande pour les emojis
        ctx.textAlign = "center"; // Centrer le texte horizontalement
        ctx.textBaseline = "middle"; // Centrer verticalement
  
        if (bonus.type === "fireBall") {
          ctx.fillText("🔥", bonus.x + 10, bonus.y + 10); // Afficher l'emoji de feu
        } else if (bonus.type === "block") {
          ctx.fillText("🔒", bonus.x + 10, bonus.y + 10); // Afficher l'emoji cadenas
        } else if (bonus.type === "extraLife") {
          ctx.fillText("❤️", bonus.x + 10, bonus.y + 10); // Afficher l'emoji cœur
        }
      }
    }
}
    
// Mettre à jour les bonus
function updateBonuses() {
    for (let i = bonuses.length - 1; i >= 0; i--) {
        let bonus = bonuses[i];
        if (bonus.active) {
            bonus.y += 2; // Déplace le bonus vers le bas

            // Vérifie si le bonus atteint la raquette
            if (
                bonus.y + 20 >= paddle.y && // Bas du bonus touche le haut de la raquette
                bonus.x + 10 >= paddle.x && // Droite du bonus touche la gauche de la raquette
                bonus.x <= paddle.x + paddle.w // Gauche du bonus touche la droite de la raquette
                ) {
                    applyBonus(bonus); // Applique l'effet du bonus
                    bonus.active = false; // Désactive le bonus
                    bonuses.splice(i, 1); // Supprime le bonus du tableau
                    continue; // Passe au bonus suivant pour éviter un conflit
                    }
  
        // Supprime les bonus qui sortent de l'écran
            if (bonus.y > canvas.height) {
                bonuses.splice(i, 1);
            }
        }
    }
}
  
// Appliquer le bonus
function applyBonus(bonus) {
try {
    if (bonus.type === "fireBall") {
    console.log("Activation du bonus : Balle en feu");
    // Activer le mode feu
    ball.isFireBall = true;
    setTimeout(() => {
        ball.isFireBall = false; // Désactiver après 8 secondes
        console.log("Désactivation du bonus : Balle en feu");
    }, 8000);
} else if (bonus.type === "block" && bricksDestroyed >= 8) {
    // Appliquer le bonus de raquette élargie
    console.log("Activation du bonus : Raquette élargie");
    if (!isPaddleWidened) {
        paddle.w *= 2; // Augmenter la taille de la raquette
        isPaddleWidened = true; // Marquer l'agrandissement comme activé
        // Redessiner la raquette après changement
        drawpaddle();
  
        setTimeout(() => {
        // Rétablir la taille normale après 8 secondes
        paddle.w /= 2;
        isPaddleWidened = false; // Désactiver l'effet agrandissement
        console.log("Désactivation du bonus : Raquette taille normale");
        drawpaddle(); // Redessiner la raquette avec la taille normale
        }, 8000);
    }
} else if (bonus.type === "block") {
    ball.isBlocked = true; // Blocage de la balle
    setTimeout(() => {
        ball.isBlocked = false;
    }, 9000); 
} else if (bonus.type === "extraLife") {
    life++;
    console.log("Bonus de vie supplémentaire activé");
}
} catch (error) {
    console.error("Erreur lors de l'application du bonus :", error);
}
}
// Fonction pour vérifier les collisions de la balle avec les briques
function checkBallCollisionWithBricks() {
    for (let r = 0; r < brickprop.row; r++) {
      for (let c = 0; c < brickprop.column; c++) {
        let brick = bricks[r][c];
        if (brick.status) {
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.w &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.h
          ) {
            brick_hit.play().catch((error) => {
              console.error("Erreur de lecture du son:", error);
            });
            brick.status = false; // Marquer la brique comme détruite
            score += scoU;
            bricksDestroyed++; // Incrémenter le compteur de briques détruites
            console.log(
              "Brique détruite, total briques détruites : " + bricksDestroyed
            );
            ball.dy = -ball.dy; // Changer la direction de la balle
  
            // Chance aléatoire de générer un bonus
            if (Math.random() < 0.3) {
              // 30% de chance de générer un bonus
              generateBonus(brick.x + brick.w / 2, brick.y + brick.h / 2);
            }
          }
        }
      }
    }
  }
  
  
  // Fonction pour générer un bonus à une position spécifique
  function generateBonus(x, y) {
    const bonusTypes = ["fireBall", "block", "extraLife"];
    const randomType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
  
    // Crée un nouveau bonus avec un type aléatoire
    const newBonus = {
      x: x,
      y: y,
      active: true,
      type: randomType,
      angle: Math.random() * Math.PI * 2, // Angle aléatoire
    };
  
    bonuses.push(newBonus); // Ajouter le bonus au tableau
    console.log(`Bonus généré: ${randomType} à (${x}, ${y})`);
}
  
  
  
// afficher les statistique du jeu
function showstat(img, iPOSx, iPOSy, text, tPOSx, tPOSy) {
  ctx.fillStyle = "#fff";
  ctx.font = "20px italic";
  ctx.fillText(text, tPOSx, tPOSy);
  ctx.drawImage(img, iPOSx, iPOSy, (width = 20), (height = 20));
}
function gameover() {
  if (life <= 0) {
    showEndInfo("lose");
    gameOverFlag = true;
  }
}
function isLevelComplete() {
    return bricks.every(row => row.every(brick => !brick.status));
  }
  
  function nextlevel() {
    if (isLevelComplete()) {
      console.log("Niveau terminé ! Passage au suivant.");
      win.play();
  
      if (level >= maxlevel) {
        win.play();
        showEndInfo(); // Affichage de la fin du jeu
        gameOverFlag = true;
        return;
      }
  
      // Augmenter la difficulté
      brickprop.row += 1; // Ajouter des lignes de briques
      createbrick(); // Créer de nouvelles briques
      ball.velocity += 0.5; // Augmenter la vitesse de la balle
      resetball(); // Réinitialiser la balle
      resetpaddle(); // Réinitialiser la palette
      level++; // Passer au niveau suivant
    }
  }
  
// Réinitialiser la raquette
function resetpaddle() {
  paddle.x = canvas.width / 2 - paddle_width / 2;
  paddle.y = canvas.height - paddle_margin_bottom - paddle_height;
}

// Collision balle / raquette
function bpcollision() {
  if (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.w &&
    ball.y + ball.radius > paddle.y
  ) {
    paddle_hit.play();
    let collidepoint = ball.x - (paddle.x + paddle.w / 2);
    collidepoint = collidepoint / (paddle.w / 2);
    let angle = (collidepoint * Math.PI) / 3;
    console.log(collidepoint);
    console.log(angle);
    ball.dy = -ball.velocity * Math.sin(angle); // Inverser la direction verticale de la balle
    ball.dx = ball.velocity * Math.cos(angle);
  }
}
let gameStarted = false;
// Boucle de jeu
function loop() {
  if (!gameStarted) return; // EmpÃªche la boucle de s'exÃ©cuter si le jeu n'est pas dÃ©marrÃ©

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(!ispaused){
    drawpaddle();

    movepaddle();

    drawball();
    drawbrick();

    drawBonuses();

    showstat(score_img, canvas.width - 100, 5, score, canvas.width - 65, 22);
    showstat(life_img, 35, 5, life, 70, 22);
    showstat(level_img, canvas.width / 2 - 25, 5, level, canvas.width / 2, 22);

    moveball();

    bwcollision();

    bpcollision();
    checkBallCollisionWithBricks();
    updateBonuses();
    if (isLevelComplete()){
        nextlevel();
    };
    gameover();
    
  }
  if (!gameOverFlag) {
    requestAnimationFrame(loop);
  }
}
loop();
//la gestion des element audio
sound=document.getElementById("sound");
sound.addEventListener("click", audiomanager);
function audiomanager(){
    let imgsrc = sound.getAttribute('src');
    let sound_img = imgsrc == 'img/sound_on.png' ? 'img/mute.png' : 'img/sound_on.png';
    sound.setAttribute('src', sound_img);
    wall_hit.muted = !wall_hit.muted;
    paddle_hit.muted = !paddle_hit.muted;
    life_lost.muted = !life_lost.muted;
    brick_hit.muted = !brick_hit.muted;
    win.muted = !win.muted;
}
//importation des ements de DOM
const rules = document.getElementById("rules");
const rulesbtn = document.getElementById("rules-btn");
const closebtn = document.getElementById("close-btn");
const game_over = document.getElementById("game-over");
const youwon = document.getElementById("you-won");
const youlose = document.getElementById("you-lose");
const restart = document.getElementById("restart");

// Affichage des règles
rulesbtn.addEventListener("click", () => {
  rules.classList.add("show");
  ispaused=true;
});

closebtn.addEventListener("click", () => {
  rules.classList.remove("show");
  ispaused=false;
});

function showEndInfo(type = "win") {
  game_over.style.visibility = "visible";
  game_over.style.opacity = "1";
  if (type == "win") {
    youwon.style.visibility = "visible";
    youlose.style.visibility = "hidden";
    youlose.style.opacity = "0";
  } else {
    youlose.style.visibility = "visible";
    youwon.style.visibility = "hidden";
    youwon.style.opacity = "0";
  }
}
restart.addEventListener('click', () => {
    location.reload();
});
