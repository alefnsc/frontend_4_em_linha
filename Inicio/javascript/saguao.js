GetPartidas()
function GetPartidas() {
    const id = window.sessionStorage.getItem('id');
    if (id != null) {
        const xhttp = new XMLHttpRequest();
        
        xhttp.open("GET", "https://localhost:44347/api/Usuario/" + id);
        xhttp.send();
    
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const objects = JSON.parse(this.responseText);
                document.getElementById('numeroPartidas').innerText = objects['numeroPartidas']
                document.getElementById('numeroVitorias').innerText = objects['numeroVitorias']
                document.getElementById('nomeUsuario').innerText = objects['nomeUsuario']
            }
        }
    }

}