function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://localhost:44347/api/Patrocinador");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td><img width="50px" src="'+object['urlLogo']+'" class="avatar"></td>';
          trHTML += '<td>'+object['nome']+'</td>';
          trHTML += '<td>'+object['email']+'</td>';
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+object['id']+')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+object['id']+')">Del</button></td>';
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
      }
    };
}

loadTable();

// function showUserCreateBox() {
//     Swal.fire({
//       title: 'Create user',
//       html:
//         '<input id="id" type="hidden">' +
//         '<input id="fname" class="swal2-input" placeholder="First">' +
//         '<input id="lname" class="swal2-input" placeholder="Last">' +
//         '<input id="username" class="swal2-input" placeholder="Username">' +
//         '<input id="email" class="swal2-input" placeholder="Email">',
//       focusConfirm: false,
//       preConfirm: () => {
//         userCreate();
//       }
//     })
// }

// function userCreate() {
//     const fname = document.getElementById("fname").value;
//     const lname = document.getElementById("lname").value;
//     const username = document.getElementById("username").value;
//     const email = document.getElementById("email").value;
      
//     const xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "https://www.mecallapi.com/api/users/create");
//     xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhttp.send(JSON.stringify({ 
//       "fname": fname, "lname": lname, "username": username, "email": email, 
//       "avatar": "https://i.pinimg.com/736x/0d/d2/0e/0dd20ebf2a8737a2d9740be6d5877b8b.jpg"
//     }));
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         const objects = JSON.parse(this.responseText);
//         Swal.fire(objects['message']);
//         loadTable();
//       }
//     };
// }

function userDelete(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "https://localhost:44347/api/Patrocinador/"+id);
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
    xhttp.open("GET", "https://localhost:44347/api/Patrocinador/"+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        const user = objects;
        console.log(user);
        Swal.fire({
          title: 'Edit User',
          html:
            '<input id="id" type="hidden" value='+user['id']+'>' +
            '<input id="nome" class="swal2-input" placeholder="Nome" value="'+user['nome']+'">' +
            '<input id="website" class="swal2-input" placeholder="Website" value="'+user['website']+'">' +
            '<input id="email" class="swal2-input" placeholder="Email" value="'+user['email']+'">' +
            '<input id="celular" class="swal2-input" placeholder="Celular" value="'+user['celular']+'">' +
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
    xhttp.open("PUT", "https://localhost:44347/api/Patrocinador/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "id": id, "nome": nome, "website": website, "email": email, "celular": celular, 
      "urlLogo": urlLogo
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      }
    };
}
