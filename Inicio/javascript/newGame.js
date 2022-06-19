const audio = document.querySelector('audio')
const screen = document.getElementById('screen')
const tabHelper = document.getElementById('helper')
const tabJog = document.getElementById('vezJogador')
const largura = 7
const altura = 6
const tabuleiro = altura * largura

const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44347/jogo").withAutomaticReconnect().build();
var campos = []
var vez = 0
const nomeUsuario = window.sessionStorage.getItem('nomeUsuario');

function voltar() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "A partida será contabilizada como derrota!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sair'
      }).then((result) => {
        if (result.isConfirmed) {
            disconnected();
            location.href='saguao.html';
        }
      })
}

for(let i = 0; i < altura * largura; i++)
{
    campos[i] = 0
}

jogarNovamente();

function jogarNovamente() {
    const urlParams = new URLSearchParams(window.location.search);
    const jogar = urlParams.get('jogarNovamente');
    if (jogar == 1) {
        document.getElementById("botaoJogar").click();
    }
}

async function start() {
    try {
        await connection.start();
        connection.invoke('ConectarSala',connection.connectionId, nomeUsuario)
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function carregarTabuleiro() {
    const connectonIdOld = window.sessionStorage.getItem("connectionId");
    console.log(connectonIdOld);

    await connection.start();
    await connection.invoke("ConsertaConnectionId", connection.connectionId, connectonIdOld);

    window.sessionStorage.setItem("connectionId", connection.connectionId);

    await connection.invoke('DistribuiArray',campos,1,1,null,null,connection.connectionId,0);
    await connection.invoke('SolicitarDadosPartida', connection.connectionId);
}

connection.on("obterDadosPartida", (jogador1, jogador2, dadosPatrocinador) => {
    document.getElementById("jogador1").innerText = jogador1['nickName'];
    document.getElementById("jogador2").innerText = jogador2['nickName'];
    console.log(jogador1);
    console.log(jogador2);
    console.log(dadosPatrocinador);
});

async function disconnected() {
    await connection.invoke('DesconectarSala', connection.connectionId);
    window.sessionStorage.removeItem("connectionId");
    await connection.stop();
}

connection.on("adversarioDesistiu", (retorno) => { // fazer modal falando que jogador adiversario desistiu
    alert(retorno);
});

function testeObjetoSignalR() {
    const jogador = {
        'IdJogador': '34',
        'NickName': 'Fabiano'
    };

    // var str = JSON.stringify(objTest); // enviar string

    connection.send('testObject', jogador);
}

function marcar(player, X) {
    // trazer array campos do back
    if(vez == connection.connectionId){
        console.log('test')
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Não é sua vez',
            timer: 2000,
            timerProgressBar: true,
        })
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

    if(vez == connection.connectionId){
        tabJog.innerHTML =  'Vez do adversário '
        }
    else {
        tabJog.innerHTML =  'Sua vez'
    }
   //Marcador ficha
   var helper = "<center><table style='border: none;' id='PlayerActionTable'><tr>";

   for (let i = 0; i < largura; i++) {
       helper += "<td class='playerActionTd'>"
       helper += "<div class='playerAction playerAction" + player + "' onClick='marcar(" + player + "," + i + ")'></div>"
       helper += "</td>"
   }
   helper += "</tr></table></center>"
   tabHelper.innerHTML = helper
   //trazer array campos back
   var html = "<center><table class='tabelaPrincipal' style='border: none;'>"
   for (let i = 0; i < tabuleiro / largura; i++) {
       html += "<tr>"
       for (let j = 0; j < tabuleiro / altura; j++) {
           if (campos[i * largura + j] == 0) {
               html += "<td style='border: none;'> <div style='border: none;' player='0' id='" + (i * largura + j) + "' class='white campo'></div>"
           }
           else if (campos[i * largura + j] == 1) {
               html += "<td style='border: none;'> <div style='border: none;' player='1' id='" + (i * largura + j) + "' class='red campo'></div>"
           }
           else {
               html += "<td style='border: none;'> <div style='border: none;' player='2' id='" + (i * largura + j) + "' class='blue campo'></div>"
           }

           html += "</td>"
       }
       html += "</tr>"
   }
   html += "</table></center>"
   screen.innerHTML = html

   if (atual != -1) {
       let deslocar = Math.floor(atual / largura) * 100
       document.getElementById(atual).setAttribute("style", "transform: translateY(-" + deslocar + "px);animation: peca 2s forwards'")
   }
}

        connection.on("DistribuiArray", (retorno, ultimo, player, vezdequem, encerrada) => {
            campos = retorno
            vez = vezdequem
            mostraTabela(ultimo,player)

            if (encerrada != 0 && encerrada != 3)
            {
                Swal.fire({
                    icon: 'info',
                    title: "Jogador " + document.getElementById("jogador" + player).innerText + " venceu!!!",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Jogar Novamente',
                    cancelButtonText: 'Voltar para o saguão',
                    reverseButtons: true
                    }).then((result) => {
                        window.sessionStorage.removeItem("connectionId");
                        if (result.isConfirmed) {
                            location.href='saguao.html?jogarNovamente=1';
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            location.href='saguao.html';
                        }
                    })
            }

            if (encerrada == 3)
            {
                Swal.fire({
                    icon: 'info',
                    title: "Empate",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Jogar Novamente',
                    cancelButtonText: 'Voltar para o saguão',
                    reverseButtons: true
                    }).then((result) => {
                        window.sessionStorage.removeItem("connectionId");
                        if (result.isConfirmed) {
                            location.href='saguao.html?jogarNovamente=1';
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            location.href='saguao.html';
                        }
                    })
            }

            if(vez == connection.connectionId){
                document.getElementById('PlayerActionTable').style.visibility="hidden";
            }else{
                document.getElementById('PlayerActionTable').style.visibility="normal";
            }
        });

        connection.on("InicioPartida", (retorno) => {
            window.sessionStorage.setItem("connectionId", connection.connectionId);
            location.href = "game.html";
        });

$(function () {
  var timerId = 0;
  var ctr=0;
  var max=10;

  timerId = setInterval(function () {
    // interval function
    ctr++;
    $('#blips > .progress-bar').attr("style","width:" + ctr*max + "%");

    // max reached?
    if (ctr==max){
      clearInterval(timerId);
      ctr=0;
      $('#blips > .progress-bar').attr("style","width:" + ctr*max + "%");

    }

  }, 1500);


  $('.btn-default').click(function () {
    clearInterval(timerId);
  });

});

