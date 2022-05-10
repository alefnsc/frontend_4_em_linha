function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://localhost:5001/api/Tema/");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td><img width="150px"" src="'+object['urlTabuleiro']+'" class="avatar"></td>';
          trHTML += '<td>'+object['nome']+'</td>';     //alterar
          trHTML += '<td>'+object['nomePatrocinador']+'</td>';  //alterar
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+object['id']+')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+object['id']+')">Del</button></td>';
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
      }
    };
}

loadTable();

function buscarNomePatrocinador(id){
  //console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://localhost:5001/api/Patrocinador/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      /*var teste = objects['nome'];
      console.log(teste);*/

      return teste;
    }
  };
}


function showUserCreateBox() {
    Swal.fire({
      title: 'Criar Tema',
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      html:
        '<input id="Id" type="hidden">' +
        '<br><br><label >Nome:'+ '</label><br> ' +
        '<input id="Nome" class="swal2-input" placeholder="Nome">' +
        '<br><br><label >URL Tabuleiro:'+ '</label><br> ' +
        '<input id="UrlTabuleiro" class="swal2-input" placeholder="Url">' +
        '<br><br><hr> ' +
        '<p style="font-size: 14px; font-family: arial, sans-serif;">*Um tema deve conter no mínimo 2 peças</p>' +
        '<br><br><label >Nome da Peça 1:'+ '</label><br> ' +
        '<input id="NomePeca1" class="swal2-input" placeholder="Nome Peça 1">' +
        '<br><br><label >URL da Peça 1:'+ '</label><br> ' +
        '<input id="UrlPeca1" class="swal2-input" placeholder="URL Peça 1">' +
        '<br><br><label >Nome da Peça 2:'+ '</label><br> ' +
        '<input id="NomePeca2" class="swal2-input" placeholder="Nome Peça 2">' +
        '<br><br><label >URL da Peça 2:'+ '</label><br> ' +
        '<input id="UrlPeca2" class="swal2-input" placeholder="URL Peça 2">' +
        '<br><br><label >Patrocinador:'+ '</label><br> ' +
        '<select id="idPatrocinador" class="swal2-input" type="text" data-use-type="STRING">' +
        '<option value="" disabled selected>Selecione o Patrocinador:</option>' +
        '</select>',
      focusConfirm: false,
      didOpen: () => {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "https://localhost:5001/api/Patrocinador/");
        xhttp.send();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            var trHTML = ''; 
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
              const option = new Option(object['nome'], object['id']);
              //console.log(option);
              const element = document.querySelector("#idPatrocinador");
              element.add(option, undefined)
            }
          }
        };
      },  
      preConfirm: () => {
        Nome = document.getElementById('Nome').value;
        UrlTabuleiro = document.getElementById('UrlTabuleiro').value;
        NomePeca1 = document.getElementById('NomePeca1').value;
        NomePeca2 = document.getElementById('NomePeca2').value;
        UrlPeca1 = document.getElementById('UrlPeca1').value;
        UrlPeca2 = document.getElementById('UrlPeca2').value;
        idPatrocinador = document.getElementById('idPatrocinador').value;
 
       if( !Nome || !NomePeca1 || !UrlTabuleiro  || !NomePeca2 || !UrlPeca1 || !UrlPeca2 || !idPatrocinador ) {
        Swal.fire('Preencha todos os campos!');
       }
       else userCreate();
      }
    })
}

function userCreate() {
    const nome = document.getElementById("Nome").value;
    const urlTabuleiro = document.getElementById("UrlTabuleiro").value;
    const idPatrocinador = document.getElementById("idPatrocinador").value;
    const nomePeca1 = document.getElementById("NomePeca1").value;
    const urlPeca1 = document.getElementById("UrlPeca1").value;
    const nomePeca2 = document.getElementById("NomePeca2").value;
    const urlPeca2 = document.getElementById("UrlPeca2").value;
    
    console.log(JSON.stringify({ 
      "nomeTema": nome, "urlTabuleiro": urlTabuleiro, "idPatrocinador": idPatrocinador,
      "nomeFicha1": nomePeca1, "urlFicha1": urlPeca1,
      "nomeFicha2": nomePeca2, "urlFicha2": urlPeca2
    }))

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://localhost:5001/api/Tema/Fichas");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhttp.send(JSON.stringify({ 
      "nomeTema": nome, "urlTabuleiro": urlTabuleiro, "idPatrocinador": idPatrocinador,
      "nomeFicha1": nomePeca1, "urlFicha1": urlPeca1,
      "nomeFicha2": nomePeca2, "urlFicha2": urlPeca2
    }));

    xhttp.onreadystatechange = function() {
      if (xhttp) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['nomeTema'] + ' Adicionado com sucesso!');
        loadTable();
      }
    };
}

function userDelete(id) {

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter essa mudança",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("DELETE", "https://localhost:5001/api/Tema/"+id);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({ 
        "id": id
      }));
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          const objects = JSON.parse(this.responseText);
          swalWithBootstrapButtons.fire(
            objects['message'],
            '',
            'success'
          )
          loadTable();
        }
      };
      
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Tema não deletado',
        '',
        'error'
      )
      loadTable();
    }
  })


}

function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://localhost:5001/api/Tema/"+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        const user = objects;
        const idPatrocina = objects['idPatrocinador'];
        Swal.fire({
          title: 'Atualizar Tema',
          showCancelButton: true,
          confirmButtonText: 'Atualizar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          html:
            '<input id="id" type="hidden" value="'+user['id']+'">' +
            '<input style="display: block; margin: 0 auto; padding: 20px" type="image" width="200" height="auto" src="'+user['urlTabuleiro']+'">' +
            '<br><br><label >Nome:'+ '</label><br> ' +
            '<input id="Nome" class="swal2-input" placeholder="First" value="'+user['nome']+'">' +  
            '<br><br><label >URL Tabuleiro:'+ '</label><br> ' +          
            '<input id="UrlTabuleiro" class="swal2-input" placeholder="Last" value="'+user['urlTabuleiro']+'">' +
            '<br><br><label >Patrocinador:'+ '</label><br> ' +  
            '<select id="patrocinadores" class="swal2-input" type="text" data-use-type="STRING">' +
            '<option disabled value="' +
            objects['idPatrocinador'] + 
            '" selected>'+
            objects['nomePatrocinador'] +
            '</option>' +
            '</select>',
          focusConfirm: false,
          didOpen: () => {
            const xhttp = new XMLHttpRequest();
            xhttp.open("GET", "https://localhost:5001/api/Patrocinador/"); //url get Patrocinadores
            xhttp.send();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                var trHTML = ''; 
                const objects = JSON.parse(this.responseText);

                for (let object of objects) {
                  if (object['id'] != idPatrocina){
                  const option = new Option(object['nome'], object['id']);
                  const element = document.querySelector("#patrocinadores");
                  element.add(option, undefined)
                  }
                }
              }
            };
          },
          preConfirm: () => {
            userEdit();
          }
        })
      }
    };
}

function userEdit() {
    const id = document.getElementById("id").value;
    const Nome = document.getElementById("Nome").value;
    const UrlTabuleiro = document.getElementById("UrlTabuleiro").value;
    const idPatrocinador = document.getElementById("patrocinadores").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "https://localhost:5001/api/Tema/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "id": id, "nome": Nome, "urlTabuleiro": UrlTabuleiro, "idPatrocinador": idPatrocinador
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['nome']  + ' atualizado com sucesso!');
        loadTable();
      }
      else {
        Swal.fire('Nenhuma atualização realizada');
      }
    };
}
