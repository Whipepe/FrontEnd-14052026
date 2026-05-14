//Declarações dos elementos usando DOM(Document Object Model)
const videoElemeneto = document.getElementById("video");
const botaoEscanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//Função para habilitar a câmera
async function configurarCamera(){
    try{
        // Chama a API do navegador para solicitar acesso
        const midia = await navigator.mediaDevices.getUserMedia({
            // Habilita a câmera traseira
            video:{facingMode: "environment"},
            // O áudio não será capturado
            audio: false
        })
        // Recebe a função mídia para ser executada
        videoElemeneto.srcObject=midia;

        // Força a reprodução do vídeo
        videoElemeneto.play()
    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera", erro;
    }
}

// Executando a função
configurarCamera();

// Função para capturar o texto da câmera
botaoEscanear.onclick = async () =>{
    botaoEscanear.disabled = true // Habilitando a câmera
    resultado.innerText = "Fazendo a leitura do texto...aguarde";

    // Define o canvas para iniciar a leitura
    const contexto = canvas.getContext("2d");

    // Ajusta o tamanho do canvas para o tamanho real do vídeo
    canvas.width = videoElemeneto.videoWidth;
    canvas.height = videoElemeneto.videoHeight;

    // Aplica o filtro para melhorar o OCR
    contexto.filter = "contrast(1.2) grayscale(1)";

    // Desenha o vídeo no canvas

    contexto.drawImage(videoElemeneto, 0, 0, canvas.width, canvas.height);

    try{
        const {data:{ text}} = await Tesseract.recognize(
            canvas,
            'por' // Define o idioma
        )

        // Remove os espaços em branco
        const textoFinal = text.trim();

        // Estrutura condicional ternária (? if: else)
        resultado.innerText = textoFinal.length > 0 ?textoFinal: "Não foi possível identificar o texto"

    }catch(erro){

        resultado.innerText="Erro no processamento", erro;

    }finally{
        botaoEscanear.disabled = false; // Desabilita o botão
    }
}