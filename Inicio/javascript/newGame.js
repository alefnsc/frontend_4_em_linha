const audio = document.querySelector('audio')
audio.currentTime = 0
const screen = document.getElementById('screen')
const tabHelper = document.getElementById('helper')
const tabJog = document.getElementById('vezJogador')
const largura = 7
const altura = 6
const tabuleiro = altura * largura
const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44347/jogo").build();
var campos = []
var vez = 0

for(let i = 0; i < altura * largura; i++)
{
    campos[i] = 0
}
start()
async function start() {
    try {
        await connection.start();
        connection.invoke('ConectarSala',connection.connectionId,"batata")
        connection.invoke('DistribuiArray',campos,1,1,0,0,connection.connectionId,0)
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};
function marcar(player, X) {
    // trazer array campos do back
    if(vez == connection.connectionId){
        return false
    }
    if (X > largura || player == 0) {
        return false
    }
    for (let i = 0; true; i++) {
        var ultimoDaAltura = altura * largura - (largura * (i + 1)) + X
        if (ultimoDaAltura < 0) {
            return false
        }
        if (campos[ultimoDaAltura] == 0) {
            campos[ultimoDaAltura] = player == 1 ? 1 : 2;
            var Y = altura - (i + 1);
            connection.invoke('DistribuiArray',campos,ultimoDaAltura,player == 1 ? 2 : 1,X,Y,connection.connectionId,0)
            mostraTabela(ultimoDaAltura, player == 1 ? 2 : 1);
            return false
        }
    }
}
function mostraTabela(atual, player) {
   // Vez Jogador
   var vez = " Vez do Jogador " + player
   tabJog.innerHTML = vez

   //Marcador ficha
   var helper = "<table id='PlayerActionTable'><tr>";
   for (let i = 0; i < largura; i++) {
       helper += "<td class='playerActionTd'>"
       helper += "<div class='playerAction playerAction" + player + "' onClick='marcar(" + player + "," + i + ")'></div>"
       helper += "</td>"
   }
   helper += "</tr></table>"
   tabHelper.innerHTML = helper
   //trazer array campos back
   var html = "<table class='tabelaPrincipal'>"
   for (let i = 0; i < tabuleiro / largura; i++) {
       html += "<tr>"
       for (let j = 0; j < tabuleiro / altura; j++) {
           if (campos[i * largura + j] == 0) {
               html += "<td> <div player='0' id='" + (i * largura + j) + "' class='white campo'></div>"
           }
           else if (campos[i * largura + j] == 1) {
               html += "<td> <div player='1' id='" + (i * largura + j) + "' class='red campo'></div>"
           }
           else {
               html += "<td> <div player='2' id='" + (i * largura + j) + "' class='blue campo'></div>"
           }

           html += "</td>"
       }
       html += "</tr>"
   }
   html += "</table>"
   screen.innerHTML = html

   if (atual != -1) {
       let deslocar = Math.floor(atual / largura) * 100
       document.getElementById(atual).setAttribute("style", "transform: translateY(-" + deslocar + "px);animation: peca 2s forwards'")
   }
}
    //Juka implementations

    var divisao = document.querySelector('#popup');
    var acc = document.querySelector('#helper');

    function ApresentaMensagem(player) {
        divisao.style.display = 'block';
        acc.style.visibility = 'hidden';
        document.getElementById('popup').innerHTML = ("Player " + player + " é o vencedor!\n<button id='botao' onclick='window.location.reload(true)'> Jogar novamente </button> \n<button id='botao_2' onclick=location.href='saguao.html'> Saguão </button>");
    }
    //----------------------

        connection.on("DistribuiArray", (retorno, ultimo, player,x, y, vezdequem, encerrada) => {
            campos = retorno
            vez = vezdequem
            mostraTabela(ultimo,player)

            if(encerrada != 0)
                console.log("Jogador " + player + " venceu!!!");

            if(vez == connection.connectionId){
                document.getElementById('PlayerActionTable').style.visibility="hidden";
            }else{
                document.getElementById('PlayerActionTable').style.visibility="normal";
            }
        });
        connection.on("InicioPartida", (retorno) => {
            console.log(retorno)
        });
        