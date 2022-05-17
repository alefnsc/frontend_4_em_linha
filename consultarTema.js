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
        '<input id="UrlTabuleiro" required type="file"  class="swal2-input" placeholder="Url">' +
        '<br><br><hr>'+
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
        idPatrocinador = document.getElementById('idPatrocinador').value;
 
       if( !Nome || !UrlTabuleiro  || !idPatrocinador ) {
        Swal.fire('Preencha todos os campos!');
       }
       else {
        salvarImagemFirebase();
         userCreate();
         
       }
      }
    })
}

async function salvarImagemFirebase(){
  var firebase = {
    apiKey:'AIzaSyC5U5VOzR9KPsgdoApExXRpvDmMCssw8c',
    authDomain:'<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: 'gs://quatro-em-linha.appspot.com/'
  };
  firebase.initializeApp(firebaseConfig);

  let storage = firebase.storage();

  const nomeImagem = document.getElementById("Nome").value;
  upload = storage.ref().child("ImagensProjeto").child(nomeImagem+".png").put(document.getElementById("UrlLogo").files[0]);

  upload.on("state_changed",function(){
    upload.snapshot.ref.getDownloadURL().then(function(url_imagem){
      console.log("URL: "+url_imagem)
      userCreate(url_imagem);
    })
  }
  )
}

function userCreate(url_imagem) {
    const nome = document.getElementById("Nome").value;
    const urlTabuleiro = url_imagem;
    const idPatrocinador = document.getElementById("idPatrocinador").value;
    
    console.log(JSON.stringify({ 
      "nomeTema": nome, "urlTabuleiro": urlTabuleiro, "idPatrocinador": idPatrocinador
    }))

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://localhost:5001/api/Tema");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhttp.send(JSON.stringify({ 
      "nomeTema": nome, "urlTabuleiro": urlTabuleiro, "idPatrocinador": idPatrocinador
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
            '<input id="UrlTabuleiro" required type="file" class="swal2-input" placeholder="Last" value="'+user['urlTabuleiro']+'">' +
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
            userEdit(url_imagem);
            salvarImagemFirebase();
          }
        })
      }
    };
}

function userEdit(url_imagem) {
    const id = document.getElementById("id").value;
    const Nome = document.getElementById("Nome").value;
    const UrlTabuleiro = url_imagem;
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
