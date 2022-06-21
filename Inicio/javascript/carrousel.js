function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://localhost:44347/api/Patrocinador");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        var trHTML = ''; 
        console.log(objects);
        for (let object of objects) {
            if (object == 0)
                trHTML += '<div class="carousel-item active">';
            else
            trHTML += '<div class="carousel-item">';
          trHTML += '<img class="d-block w-100" src='+object['urlLogo']+' alt='+object['nome']+'>';
          trHTML += '</div>';
        }
        document.getElementById("carousel").innerHTML = trHTML;
      }
    };
}

loadTable();