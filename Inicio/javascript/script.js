const inputs = document.querySelectorAll('.input');
const button = document.querySelector('.login__button');

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
    const [username, password, name] = inputs;

    if (username.value && password.value.length >= 8) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
}

inputs.forEach((input) => input.addEventListener('focus', handleFocus));
inputs.forEach((input) => input.addEventListener('focusout', handleFocusOut));
inputs.forEach((input) => input.addEventListener('input', handleChange));

async function PostLogin() {
    var nome = document.getElementById('nome').value;
    console.log(nome)
    var senha = document.getElementById('senha').value;
    console.log(senha)
    await new Promise(r => setTimeout(r, 2000));
    // const response = await fetch(api_url, {
    //     method: 'POST',
    //     headers: {}, //O erro de CORS ocorria quando preenchia o Headers com Access-Control-Allow-Origin e Content-Type-application/json
    
    //     //Convertemos antes os valores de lat e lng pois estavam vindo como string, mas no console pareciam ser inteiros, para não dar erro de tipo
    //     body: JSON.stringify(
    //       {
    //         nome: nome,
    //         senha: senha
    //       }
    //     )
    //   })
    window.location.href = "saguao.html";
}


