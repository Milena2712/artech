// Variáveis globais para armazenar dados do modelo, imagem e controle da animação
let modelData;
let bgImage;
let animFrame = 0; // Contador para a animação da imagem
let useTexture = false; // Define se a cabaça terá textura aplicada
let imageSize; // Tamanho atual da imagem
let minSize = 2; // Tamanho mínimo da imagem
let maxSize; // Tamanho máximo da imagem (definido dinamicamente)
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

// Função para calcular o tamanho máximo da imagem baseado no tamanho da tela
function calculateMaxSize() {
  // Calcula o tamanho máximo baseado na menor dimensão da tela
  // Isso garante que a imagem sempre caiba na tela
  let maxDimension = min(windowWidth, windowHeight);
  // Usa 80% da menor dimensão para dar uma margem
  return maxDimension * 0.8;
}

// Configuração inicial da tela e valores padrão
function setup() {
  // Cria canvas que ocupa toda a janela
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Calcula a proporção da imagem
  aspectRatio = bgImage.width / bgImage.height;
  
  // Calcula o tamanho máximo baseado no tamanho atual da tela
  maxSize = calculateMaxSize();
  imageSize = maxSize; // Começa com o tamanho máximo
}

// Função chamada quando a janela é redimensionada
function windowResized() {
  // Redimensiona o canvas para o novo tamanho da janela
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalcula o tamanho máximo da imagem
  let newMaxSize = calculateMaxSize();
  
  // Ajusta o tamanho atual da imagem proporcionalmente
  if (maxSize > 0) {
    let scale = newMaxSize / maxSize;
    imageSize = imageSize * scale;
  }
  
  maxSize = newMaxSize;
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
    else if (imageSize >= maxSize) {
      rotationComplete = false; // Permite que a cabaça volte a girar normalmente
      useTexture = false;
    }
  } else {
    // Se estiver girando, aumenta o progresso da rotação
    rotationProgress++;
    if (rotationProgress >= rotationDuration) {
      rotating = false; // Para a rotação
      rotationComplete = true; // Marca que a rotação de 360° foi concluída
      animFrame = 0; // Reseta o contador da animação
      shrinking = false; // Inicia o crescimento da imagem
      useTexture = false;
    }
  }
  
  // Desenha a imagem com base no tamanho calculado, mantendo as proporções
  push();
  imageMode(CENTER);
  // Calcula a largura e altura da imagem mantendo a proporção
  let imageWidth = imageSize;
  let imageHeight = imageSize / aspectRatio;
  image(bgImage, 0, 0, imageWidth, imageHeight);
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
