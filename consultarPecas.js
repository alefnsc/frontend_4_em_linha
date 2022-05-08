function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.mecallapi.com/api/users"); //ajustar para receber a lista de fichas (AJUSTAR NOME DE PARAMETROS )
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td><img width="50px" src="'+object['urlFicha']+'" class="avatar"></td>';
          trHTML += '<td>'+object['name']+'</td>';
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
       title: 'Criar Peça',
       html:
         '<input id="id" type="hidden">' +
         '<input id="name" class="swal2-input" placeholder="Nome da Peça">' +
         '<input id="image" class="swal2-input" placeholder="Url de Imagem">' +
         '<select id="theme" class="swal2-input" type="text" data-use-type="STRING">' +
         '<option value="" disabled selected>Selecione um Tema</option>' +
         '</select>',
       focusConfirm: false,
       didOpen: () => {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "https://www.mecallapi.com/api/users"); //url de get tema
        xhttp.send();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = ''; 
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
              const option = new Option(object['fname'], object['id']); //ajustar para denominação de nome das fichas (para as opções)
              const element = document.querySelector("#theme");
              element.add(option, undefined)
            }
          }
        };
      }, 
       preConfirm: () => {
         userCreate();
         alert(document.getElementById("name")+"criado com sucesso")
       }
     })
 }

 function userCreate() {
     const name = document.getElementById("name").value;
     const image = document.getElementById("image").value;
     const idTema = document.getElementById("theme").value;
      
     const xhttp = new XMLHttpRequest();
     xhttp.open("POST", "https://www.mecallapi.com/api/users/create");  //url de post ficha
     xhttp.send(JSON.stringify({ 
       "name": name, "image": image, "idTema": idTema
     }));
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
         loadTable();
       }
     };
 }

function userDelete(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "https://www.mecallapi.com/api/users/delete"); //url delete peca (Id no json)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "id": id
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      } 
    };
}

function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.mecallapi.com/api/users/"+id); //url de get peça especifica através de Id
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        const peca = objects['user'];
        console.log(peca);
        Swal.fire({
          title: 'Editar Peça',
          html:
            '<input id="id" type="hidden" value="'+peca['id']+'">'  +
            '<input id="name" class="swal2-input" placeholder="Nome" value="'+peca['nome']+'">' +
            '<input id="image" class="swal2-input" placeholder="UrlImagem" value="'+peca['image']+'">' +
            '<select id="theme" class="swal2-input" type="text" data-use-type="STRING">' +
            '<option value="" disabled selected>Selecione um Tema</option>' +
            '</select>',
          focusConfirm: false,
          didOpen: () => {
            const xhttp = new XMLHttpRequest();
            xhttp.open("GET", "https://www.mecallapi.com/api/users"); //url get tema
            xhttp.send();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                var trHTML = ''; 
                const objects = JSON.parse(this.responseText);
                for (let object of objects) {
                  const option = new Option(object['NomeTema'], object['id']);
                  const element = document.querySelector("#theme");
                  element.add(option, undefined)
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
    const nome = document.getElementById("name").value;
    const image = document.getElementById("image").value;
    const theme = document.getElementById("theme").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "https://www.mecallapi.com/api/users/update");    //url de update fichas
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "id": id, "nome": nome, "image": image, "idTema": theme
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      }
    };
}
