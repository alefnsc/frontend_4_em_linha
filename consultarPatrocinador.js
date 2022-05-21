function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://localhost:5001/api/Patrocinador");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td><img width="50px" src="'+object['urlLogo']+'" class="avatar"></td>';
          trHTML += '<td>'+object['nome']+'</td>';
          trHTML += '<td>'+object['website']+'</td>';
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+object['id']+')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+object['id']+')">Del</button></td>';
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
      }
    };
}

loadTable();

function showUserCreateBox() {
    Swal.fire({
      title: 'Criar Patrocinador',
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      html:
        '<input id="Id" type="hidden">' +
        '<br><br><label >Nome:'+ '</label><br> ' +
        '<input required type="text" id="Nome" class="swal2-input" placeholder="Nome">' +
        '<br><br><label >Email:'+ '</label><br> ' +
        '<input required type="email" id="Email" class="swal2-input" placeholder="exemplo@mail.com">' +
        '<br><br><label >URL Logo:'+ '</label><br> ' +
        '<input required type="file" id="UrlLogo" class="swal2-input" placeholder="http://exemplo.com.br/img.png">' +
        '<br><br><label >URL Website:'+ '</label><br> ' +
        '<input required type="url" id="Website" class="swal2-input" placeholder="http://exemplo.com.br">' +
        '<br><br><label >Celular:'+ '</label><br> ' +
        '<input required type="tel" id="Celular" maxlength="17" class="swal2-input js-field-personal_phone" placeholder="(11) 99999-9999">' ,
      focusConfirm: false,
      preConfirm: () => {
        NomePat = document.getElementById('Nome').value;
        Email = document.getElementById('Email').value;
        UrlLogo = document.getElementById('UrlLogo').value;
        Website = document.getElementById('Website').value;
        Celular = document.getElementById('Celular').value;
 
       if( !NomePat || !Email || !UrlLogo  || !Website || !Celular ) {
        Swal.fire('Preencha todos os campos!');
       }
       else {
           salvarImagemFirebase();
       }
      }
    })
} 
async function salvarImagemFirebase(){
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

  let storage = firebase.storage();


  var file = document.querySelector("#UrlLogo").files[0];

  /* var date = new Date();x

  var name = date.getDate() + '_' + date.getMonth + '_' + date.getFullYear + '-' + nomeImagem;*/

  var date = new Date().toLocaleDateString();
  console.log(date);
  var date = date.replace(/\//g, "_");
  console.log(date);


  var nomeImagem = document.getElementById("Nome").value;
  var Em = document.getElementById('Email').value;
  var Web = document.getElementById('Website').value;
  var Cel = document.getElementById('Celular').value;

  var nomeImagemF =  nomeImagem + '_' + date;

  const metadata = {
    contentType:file.type
  }

  const ext = file.type.substring(file.type.indexOf('/')+1);

  upload = storage.ref().child("ImagensPatrocinador").child(nomeImagemF + '.' + ext).put(file, metadata);

  upload.on("state_changed", function () {
    upload.snapshot.ref.getDownloadURL().then(function (url_imagem) {
      userCreate(url_imagem, Em, Web, Cel, nomeImagem);
    })
  }
  )
}
function userCreate(url_imagem, email, web, celular, nome) {
    const Nome = nome;
    const Email = email;
    const UrlLogo = url_imagem;
    const Website = web;
    const Celular = celular;

   //alert()
    
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://localhost:5001/api/Patrocinador/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "nome": Nome, "email": Email,"urlLogo": UrlLogo, "website": Website, "celular": Celular
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 201) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['nome'] + ' criado com sucesso!');
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
      xhttp.open("DELETE", "https://localhost:5001/api/Patrocinador/"+id);
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
        'Patrocinador não deletado',
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
  xhttp.open("GET", "https://localhost:5001/api/Patrocinador/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const user = objects;
      Swal.fire({
        title: 'Atualizar Patrocinador',
        showCancelButton: true,
        confirmButtonText: 'Atualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        html:
          '<input id="id" type="hidden" value='+user['id']+'>' +
          '<input style="display: block; margin: 0 auto; padding: 20px" type="image" width="200" height="auto" src="'+user['urlLogo']+'">' +
          '<br><br><label >Nome:'+ '</label><br> ' +
          '<input id="nome" class="swal2-input" placeholder="Nome" value="'+user['nome']+'">' +
          '<br><br><label >Email:'+ '</label><br> ' +
          '<input id="email" class="swal2-input" placeholder="Email" value="'+user['email']+'">' +
          '<br><br><label >Celular:'+ '</label><br> ' +
          '<input id="celular" class="swal2-input" placeholder="Celular" value="'+user['celular']+'">' +
          '<br><br><label >URL Website:'+ '</label><br> ' +
          '<input id="website" class="swal2-input" placeholder="Website" value="'+user['website']+'">' +
          '<br><br><label >URL Logo:'+ '</label><br> ' +
          '<input id="urlLogo" required type="file" class="swal2-input" placeholder="UrlLogo" value="'+user['urlLogo']+'">',
        focusConfirm: false,
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
  const nome = document.getElementById("nome").value;
  const website = document.getElementById("website").value;
  const email = document.getElementById("email").value;
  const celular = document.getElementById("celular").value;
  const urlLogo = url_imagem;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "https://localhost:5001/api/Patrocinador/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "id": id, "nome": nome, "website": website, "email": email, "celular": celular, 
    "urlLogo": urlLogo
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['nome'] + ' atualizado com sucesso!');
      loadTable();
    }
    else {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}
