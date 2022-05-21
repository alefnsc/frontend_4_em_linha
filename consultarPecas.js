function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://localhost:5001/api/Ficha/"); //ajustar para receber a lista de fichas (AJUSTAR NOME DE PARAMETROS )
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        trHTML += '<tr>';
        trHTML += '<td><img width="50px" src="' + object['urlFicha'] + '" class="avatar"></td>';
        trHTML += '<td>' + object['nome'] + '</td>';
        trHTML += '<td>' + object['nomeTema'] + '</td>';
        trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox(' + object['id'] + ')">Edit</button>';
        trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete(' + object['id'] + ')">Del</button></td>';
        trHTML += "</tr>";
      }
      document.getElementById("mytable").innerHTML = trHTML;
    }
  };
}

loadTable();

function buscarNomeTema(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://localhost:5001/api/Tema/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      return objects['nome'];
    }
  };
}


function showUserCreateBox() {
  Swal.fire({
    title: 'Criar Ficha',
    showCancelButton: true,
    confirmButtonText: 'Criar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    html:
      '<input  id="id" type="hidden">' +
      '<br><br><label >Nome:'+ '</label><br> ' +
      '<input  id="name" class="swal2-input" placeholder="Nome da Ficha">' +
      '<br><br><label >URL Ficha:'+ '</label><br> ' +
      '<input  id="image" required type="file" class="swal2-input" placeholder="Url de Imagem">' +
      '<br><br><label >Tema:'+ '</label><br> ' +
      '<select  id="theme" class="swal2-input" type="text" data-use-type="STRING">' +
      '<option value="" disabled selected>Selecione um Tema</option>' +
      '</select>',
    focusConfirm: false,
    didOpen: () => {
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", "https://localhost:5001/api/Tema/"); //url de get tema
      xhttp.send();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //console.log(this.responseText);
          var trHTML = '';
          const objects = JSON.parse(this.responseText);
          for (let object of objects) {
            const option = new Option(object['nome'], object['id']); //ajustar para denominação de nome das fichas (para as opções)
            const element = document.querySelector("#theme");
            element.add(option, undefined)
          }
        }
      };
    },
    preConfirm: () => {

        Nome = document.getElementById('name').value;
        image = document.getElementById('image').value;
        theme = document.getElementById('theme').value;
 
       if( !Nome || !image || !theme) {
        Swal.fire('Preencha todos os campos!');
       }
       else {
        salvarImagemFirebase(theme);

        }
    }
  })
}

async function salvarImagemFirebase(idTema) {
  const firebaseConfig = {
    apiKey: "AIzaSyCKU6lw0J2J8_pUyEBgSPrT4l2yptnBPZQ",
    authDomain: "forline-4ef2b.firebaseapp.com",
    projectId: "forline-4ef2b",
    storageBucket: "forline-4ef2b.appspot.com",
    messagingSenderId: "475759422512",
    appId: "1:475759422512:web:ca8405d44016448cf0d1f5",
    measurementId: "G-BQV4FC6PW1"
  };
  firebase.initializeApp(firebaseConfig);

  var storage = firebase.storage();

  var file = document.querySelector("#image").files[0];

  /* var date = new Date();x

  var name = date.getDate() + '_' + date.getMonth + '_' + date.getFullYear + '-' + nomeImagem;*/

  var date = new Date().toLocaleDateString();
  console.log(date);
  var date = date.replace(/\//g, "_");
  console.log(date);


  var nomeImagem = document.getElementById("name").value;

  var nomeImagemF =  nomeImagem + '_' + date;

  const metadata = {
    contentType:file.type
  }

  const ext = file.type.substring(file.type.indexOf('/')+1);

  upload = storage.ref().child("ImagensFicha").child(nomeImagemF + '.' + ext).put(file, metadata);

  upload.on("state_changed", function () {
    upload.snapshot.ref.getDownloadURL().then(function (url_imagem) {
      userCreate(url_imagem, nomeImagem, idTema);
    })
  }
  )
}

function userCreate(url_imagem, img, idTema) {
  const name = img;
  const image = url_imagem;
  const Tema = idTema;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://localhost:5001/api/Ficha/");  //url de post ficha
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "nome": name, "urlFicha": image, "idTema": Tema
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['nome'] + ' criada com sucesso!');
      loadTable();
    }
    else {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
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
      xhttp.open("DELETE", "https://localhost:5001/api/Ficha/" + id); //url delete peca (Id no json)
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({
        "id": id
      }));
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          const objects = JSON.parse(this.responseText);
          Swal.fire(objects['message']);
          loadTable();
        }
      };
      
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Ficha não deletada',
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
  xhttp.open("GET", "https://localhost:5001/api/Ficha/" + id); //url de get Ficha especifica através de Id
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const peca = JSON.parse(this.responseText);
      const idTema = peca['idTema'];
      console.log(peca);
      Swal.fire({
        title: 'Atualizar Ficha',
        showCancelButton: true,
        confirmButtonText: 'Atualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        html:
          '<input id="id" type="hidden" value="'+peca['id']+'">' +
          '<input style="display: block; margin: 0 auto; padding: 20px" type="image" width="200" height="auto" src="'+peca['urlFicha']+'">' +
          '<br><br><label >Nome:'+ '</label><br> ' +
          '<input id="name" class="swal2-input" placeholder="Nome" value="' + peca['nome'] + '">' +
          '<br><br><label >URL Ficha:'+ '</label><br> ' +
          '<input id="image" required type="file"  class="swal2-input" placeholder="UrlImagem" value="' + peca['urlFicha'] + '">' +
          '<br><br><label >Tema:'+ '</label><br> ' +
          '<select id="theme" class="swal2-input" type="text" data-use-type="STRING">' +
          '<option value="' +
          peca['idTema'] + 
          '" selected>'+
          peca['nomeTema'] +
          '</option>' +
          '</select>',
        focusConfirm: false,
        didOpen: () => {
          const xhttp = new XMLHttpRequest();
          xhttp.open("GET", "https://localhost:5001/api/Tema/"); //url get tema
          xhttp.send();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              console.log(this.responseText);
              var trHTML = '';
              const objects = JSON.parse(this.responseText);
              for (let object of objects) {
                if (object['id'] != idTema){
                const option = new Option(object['nome'], object['id']);
                console.log(object['id'])
                const element = document.querySelector("#theme");
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
  const nome = document.getElementById("name").value;
  const image = url_imagem;
  const theme = document.getElementById("theme").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "https://localhost:5001/api/Ficha/");    //url de update fichas
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id": id, "nome": nome, "urlFicha": image, "idTema": theme
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['nome'] + ' atualizada com sucesso!');
      loadTable();
    }
    else {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}
