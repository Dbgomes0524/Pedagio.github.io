// scripts.js

const distancia = 120;  // Distância entre as paradas A e B
const valorPedagio = 20; // Valor fixo do pedágio

let carros = [];  // Array para armazenar os dados dos veículos
let horaInicio = null; // Hora de início do processamento
let horaFinal = null;  // Hora de finalização do processamento

// Função para registrar o veículo
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const placa = document.getElementById('placa').value;
    const horaEntrada = document.getElementById('horaEntrada').value;
    const horaSaida = document.getElementById('horaSaida').value;

    // Registra a hora de início e fim do processamento
    if (horaInicio === null) {
        horaInicio = horaEntrada;  // Primeira entrada, define o início
    }

    horaFinal = horaSaida;  // Atualiza a hora final a cada novo registro

    // Calcula o tempo de viagem
    const tempo = calcularTempo(horaEntrada, horaSaida);
    
    // Calcula a velocidade média
    const velocidade = calcularVelocidade(tempo);

    // Calcula o valor do pedágio com desconto
    const valorPago = calcularValorPago(velocidade);

    // Armazena os dados do veículo no array
    carros.push({ placa, horaEntrada, horaSaida, tempo, velocidade, valorPago });

    // Gera o ticket de cobrança
    gerarTicket(placa, horaEntrada, horaSaida, tempo, velocidade, valorPago);
    
    // Limpa os campos do formulário
    document.getElementById('placa').value = '';
    document.getElementById('horaEntrada').value = '';
    document.getElementById('horaSaida').value = '';
});

// Função para calcular o tempo em horas
function calcularTempo(horaEntrada, horaSaida) {
    const entrada = new Date(`1970-01-01T${horaEntrada}:00`);
    const saida = new Date(`1970-01-01T${horaSaida}:00`);
    const tempoEmHoras = (saida - entrada) / (1000 * 60 * 60);
    return tempoEmHoras;
}

// Função para calcular a velocidade média
function calcularVelocidade(tempo) {
    return distancia / tempo;
}

// Função para calcular o valor do pedágio com desconto
function calcularValorPago(velocidade) {
    let desconto = 0;
    if (velocidade <= 60) {
        desconto = 0.15;  // 15% de desconto
    } else if (velocidade > 60 && velocidade <= 100) {
        desconto = 0.10;  // 10% de desconto
    }
    return valorPedagio * (1 - desconto);
}

// Função para gerar o ticket de cobrança
function gerarTicket(placa, horaEntrada, horaSaida, tempo, velocidade, valorPago) {
    const ticketHTML = `
        <div class="ticket">
            <p><strong>Placa:</strong> ${placa}</p>
            <p><strong>Hora de Entrada:</strong> ${horaEntrada}</p>
            <p><strong>Hora de Saída:</strong> ${horaSaida}</p>
            <p><strong>Tempo Gasto:</strong> ${tempo.toFixed(2)} horas</p>
            <p><strong>Velocidade Média:</strong> ${velocidade.toFixed(2)} km/h</p>
            <p><strong>Valor do Pedágio:</strong> R$ ${valorPago.toFixed(2)}</p>
        </div>
    `;
    document.getElementById('tickets').innerHTML += ticketHTML;
}

// Função para gerar o relatório do turno
function gerarRelatorio() {
    if (carros.length === 0) {
        alert('Nenhum veículo registrado para gerar o relatório.');
        return;
    }

    // Calcular os valores do relatório
    const velocidades = carros.map(car => car.velocidade);
    const valores = carros.map(car => car.valorPago);

    const menorVelocidade = Math.min(...velocidades);
    const maiorVelocidade = Math.max(...velocidades);
    const mediaVelocidade = velocidades.reduce((acc, vel) => acc + vel, 0) / velocidades.length;
    const totalValores = valores.reduce((acc, val) => acc + val, 0);

    const relatorioHTML = `
        <h2>Relatório do Turno</h2>
        <p><strong>Menor Velocidade:</strong> ${menorVelocidade.toFixed(2)} km/h</p>
        <p><strong>Maior Velocidade:</strong> ${maiorVelocidade.toFixed(2)} km/h</p>
        <p><strong>Média das Velocidades:</strong> ${mediaVelocidade.toFixed(2)} km/h</p>
        <p><strong>Total de Valores Cobrados:</strong> R$ ${totalValores.toFixed(2)}</p>
        <p><strong>Hora de Início:</strong> ${horaInicio}</p>
        <p><strong>Hora de Fim:</strong> ${horaFinal}</p>
    `;
    
    document.getElementById('tickets').innerHTML += relatorioHTML;

    // Reseta os dados após fechar o caixa
    carros = [];
    horaInicio = null;
    horaFinal = null;
}
