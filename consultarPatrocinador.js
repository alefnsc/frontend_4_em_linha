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
        '<input required type="url" id="UrlLogo" class="swal2-input" placeholder="http://exemplo.com.br/img.png">' +
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
       else userCreate();
      }
    })
} 

function userCreate() {
    const Nome = document.getElementById("Nome").value;
    const Email = document.getElementById("Email").value;
    const UrlLogo = document.getElementById("UrlLogo").value;
    const Website = document.getElementById("Website").value;
    const Celular = document.getElementById("Celular").value;

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
          '<input id="urlLogo" class="swal2-input" placeholder="UrlLogo" value="'+user['urlLogo']+'">',
        focusConfirm: false,
        preConfirm: () => {
          userEdit();
        }
      })
    }
  };
}

function userEdit() {
  const id = document.getElementById("id").value;
  const nome = document.getElementById("nome").value;
  const website = document.getElementById("website").value;
  const email = document.getElementById("email").value;
  const celular = document.getElementById("celular").value;
  const urlLogo = document.getElementById("urlLogo").value;
    
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
  };
}
