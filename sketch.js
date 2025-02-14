// Variáveis globais para armazenar dados do modelo, imagem e controle da animação
let modelData;
let bgImage;
let animFrame = 0; // Contador para a animação da imagem
let useTexture = false; // Define se a cabaça terá textura aplicada
let imageSize; // Tamanho atual da imagem
let minSize = 2; // Tamanho mínimo da imagem
let maxSize; // Tamanho máximo da imagem (definido no setup)
let aspectRatio; // Proporção da imagem
let animationDuration = 500; // Tempo total da animação da imagem (em frames)
let shrinking = true; // Indica se a imagem está diminuindo
let rotating = false; // Indica se a cabaça está girando antes de crescer
let rotationComplete = false; // Indica se a rotação de 360° foi concluída
let rotationProgress = 0; // Progresso da rotação antes de crescer
let rotationDuration = 100; // Duração da rotação da cabaça antes da imagem crescer

// Pré-carrega os arquivos do modelo 3D e a textura da imagem
function preload() {
  modelData = loadModel('https://raw.githubusercontent.com/Milena2712/artech/refs/heads/main/tinker.obj', true);
  bgImage = loadImage('https://raw.githubusercontent.com/Milena2712/artech/main/sketch1739498717530 (1).png');
}

// Configuração inicial da tela e valores padrão
function setup() {
  createCanvas(500, 800, WEBGL);
  aspectRatio = bgImage.width / bgImage.height; // Calcula a proporção da imagem
  maxSize = width; // Define o tamanho máximo da imagem com base na largura do canvas
  imageSize = maxSize; // Começa com o tamanho máximo
}

// Função principal que roda continuamente para desenhar a cena
function draw() {
  // Define o fundo como preto quando a textura está aplicada, senão cinza claro
  background(useTexture ? 0 : 220);
  
  push();
  translate(0, 0, 50); // Move o modelo um pouco para frente

  // Controle da rotação da cabaça
  if (rotating) {
    let rotationAmount = easeOutQuad(rotationProgress / rotationDuration) * (2 * PI);
    rotateX(rotationAmount); // Faz a cabaça girar suavemente
  } else if (!rotationComplete) {
    // Se a rotação foi completada, a cabaça fica parada na posição correta
    rotateY(frameCount * 0.02); // Rotação normal enquanto a animação ocorre
    rotateX(frameCount * 0.01);
  }

  // Aplica textura na cabaça quando a imagem desaparece completamente
  if (useTexture) {
    texture(bgImage);
      translate(0, 0, -100); // Move o modelo para trás

  } else {
    noFill();
    stroke(160, 100, 50); // Cor da linha do modelo 3D quando sem textura
  }
  model(modelData);
  pop();

  // Se a cabaça não está girando, a imagem continua sua animação normal
  if (!rotating) {
    let progress = map(animFrame, 0, animationDuration, 1, 0);

    // Se estiver diminuindo, a imagem encolhe suavemente
    if (shrinking) {
      imageSize = easeOutQuad(progress) * (maxSize - minSize) + minSize;
    } else { // Se estiver crescendo, a imagem expande suavemente
      imageSize = easeInQuad(1 - progress) * (maxSize - minSize) + minSize;
    }

    // Quando a imagem atinge o tamanho mínimo, ativa a textura e inicia a rotação
    if (imageSize <= minSize) {
      useTexture = true;
      rotating = true; // Começa a rotação de 360°
      rotationProgress = 0; // Reseta o contador de rotação
      rotationComplete = false; // Resetando para uma nova rotação
      translate(10, 0, -3000); // Move o modelo para trás
      
    } 
    
     // Quando a imagem cresce completamente, volta à rotação normal
    // else if (imageSize >= maxSize/5) {
    //   noStroke()
    // }

    // Quando a imagem cresce completamente, volta à rotação normal
    else if (imageSize >= maxSize) {
      rotationComplete = false; // Permite que a cabaça volte a girar normalmente
      useTexture = false
      
    }
  } else {
    // Se estiver girando, aumenta o progresso da rotação
    rotationProgress++;
    if (rotationProgress >= rotationDuration) {
      rotating = false; // Para a rotação
      rotationComplete = true; // Marca que a rotação de 360° foi concluída
      animFrame = 0; // Reseta o contador da animação
      shrinking = false; // Inicia o crescimento da imagem
      useTexture = false
    }
  }
  
  // Desenha a imagem com base no tamanho calculado
  push();
  imageMode(CENTER);
  image(bgImage, 0, 0, imageSize, imageSize / aspectRatio);
  pop();

  // Se não estiver girando, continua a animação normalmente
  if (!rotating) {
    animFrame++;
    if (animFrame >= animationDuration) {
      animFrame = 0;
      shrinking = !shrinking; // Alterna entre diminuir e crescer
    }
  }
}

// Função de easing para suavizar a diminuição
function easeOutQuad(x) {
  return x * (2 - x);
}

// Função de easing para suavizar o crescimento
function easeInQuad(x) {
  return x * x;
} 
