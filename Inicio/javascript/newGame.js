const audio = document.querySelector('audio')
audio.currentTime = 0
const screen = document.getElementById('screen')
const tabHelper = document.getElementById('helper')
const tabJog = document.getElementById('vezJogador')
const largura = 7
const altura = 6
const tabuleiro = altura * largura

function marcar(player, X) {

    // trazer array campos do back

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
            setCampos(campos, player, X, Y);
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
   var helper = "<table><tr>";
   for (let i = 0; i < largura; i++) {
       helper += "<td class='playerActionTd'>"
       helper += "<div class='playerAction playerAction" + player + "' onClick='marcar(" + player + "," + i + ")'></div>"
       helper += "</td>"
   }
   helper += "</tr></table>"
   tabHelper.innerHTML = helper

   //trazer array campos back
   campos = getCampos();

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