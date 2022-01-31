/* ------------------------- Event listener buttons ------------------------- */
$(function () {
  $("#buscar").click((e) => {
    buscarPersonaje();
  });

  $("#limpiar").click((e) => {
    limpiar();
  });

  $(document).keydown((e) => {
    if (e.keyCode === 13) {
    event.preventDefault();//evita refresh de navegador con tecla enter
    buscarPersonaje();
    }
  });
});

/* ---------------------- Validando input de formulario --------------------- */


function validacion(id) { //valida solo inputs de números entre 1 a 3 dígitos
  var expresion = /^\d{1,3}$/;

  if (expresion.test(id)) {
    return true;
  }
  return false;
}

function errorInput() {
  alert("Input invalido, ingrese un número del 1 al 731");
  $("#input_busqueda").focus();
}

function buscarPersonaje() {
  limpiar();
  var id_personaje = $("#input_busqueda").val();
  if (validacion(id_personaje) == false) {
    errorInput();
    return;
  }
  getPersonaje(id_personaje);
}



function getPersonaje(id) {
  $.ajax({
    type: "GET",
    url: `https://superheroapi.com/api/10228114363548003/${id}`,
    dataType: "json",
    success: function (personaje) {
      console.log(personaje);

      $("#card").append(generarCard(personaje));
      generarGrafico(personaje);
    },
  });
}

/* ----------------------------- Datos personaje ---------------------------- */

function generarCard(personaje) {
  var card = `
    
    <div class="card mb-3">
    <h3 class="text-center pt-4">SuperHero Encontrado</h3>
    <div class="col-md-16"> 
            <img src="${personaje.image["url"]}" class="card-img-top" alt="...">
            <div class="card-body justify-content-center">
                <h5 class="card-title">${personaje.name}</h5>
                <p class="card-text"> <b>Conexiones:</b> ${personaje.connections["group-affiliation"]}</p><br>
                <p class="card-text"> <b>Publicado por:</b> ${personaje.biography.publisher} </p><br>
                <p class="card-text"> <b>Ocupación:</b> ${personaje.work.occupation}</p><br>
                <p class="card-text"> <b>Primera aparición:</b> ${personaje.biography["first-appearance"]} </p><br>
                <p class="card-text"> <b>Altura:</b>  ${personaje.appearance["height"]}</p><br>
                <p class="card-text"> <b>Peso:</b> ${personaje.appearance["weight"]}</p><br>
                <p class="card-text"> <b>Alianzas:</b> ${personaje.biography["aliases"]}</p><br>
            </div>
    </div>      
    </div>`;

  return card;
}

/* --------------------------- Estructura gráfico --------------------------- */

function personajeGrafico(personaje) {
  var powerstats = personaje.powerstats;
  var nuevoObjeto = [ //Crea un nuevo objeto
  ];


  for (const key in powerstats) {
    //Obtención de datos para nuevo objeto
    var datos = {};
    datos.label = key;
    datos.y = powerstats[key] == "null" ? 0 : parseInt(powerstats[key]); //Elimina error de dato null
    nuevoObjeto.push(datos); //Envia los datos a nuevoObjeto
  }

  return nuevoObjeto;
}


function generarGrafico(personaje) {
  var arrayPuntos = personajeGrafico(personaje);
  var chart = new CanvasJS.Chart("stats", {
    theme: "light2", 
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: `Estadísticas de poder para ${personaje.name}`,
    },
    data: [
      {
        type: "pie",
        startAngle: 25,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: arrayPuntos,
      },
    ],
  });
  chart.render();
}


/* ------------------- Limpieza de información en pantalla ------------------ */
function limpiar() {
  $("#card").empty();
  $("#input_busqueda").focus();
  $("#stats").empty();
}
