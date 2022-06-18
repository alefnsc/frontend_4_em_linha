const inputs = document.querySelectorAll('.input');
const button = document.querySelector('.login__button_cad');
document.getElementById('nomeUsuario').innerText = window.sessionStorage.getItem('nomeUsuario');

const handleFocus = ({ target }) => {
    const span = target.previousElementSibling;
    span.classList.add('span-active');
}

const handleFocusOut = ({ target }) => {
    if(target.value == '') {
        const span = target.previousElementSibling;
        span.classList.remove('span-active');
    }
}

const handleChange = ({  }) => {
    const [username_cad, password_cad, email_cad] = inputs;

    if (username_cad.value && password_cad.value.length >= 8 && email_cad.value) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
}

inputs.forEach((input) => input.addEventListener('focus', handleFocus));
inputs.forEach((input) => input.addEventListener('focusout', handleFocusOut));
inputs.forEach((input) => input.addEventListener('input', handleChange));


GetPartidas()
function GetPartidas() {

    const xhttp = new XMLHttpRequest();
    const id = window.sessionStorage.getItem('id');
    xhttp.open("GET", "https://localhost:44347/api/Usuario/" + id);
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            document.getElementById('numeroPartidas').innerText = objects['numeroPartidas']
            document.getElementById('numeroVitorias').innerText = objects['numeroVitorias']
        }
    }
}

function sair() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você será desconectado",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sair'
      }).then((result) => {
        if (result.isConfirmed) {
            window.sessionStorage.clear();
            location.href='index.html';
        }
      })
}