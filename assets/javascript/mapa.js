let map;
let marker;

// Por enquanto inutilizado, mas pode ser utilizado
// pra deletar os marcadores no futuro
let newMarkers = [];

let center = {
  lat: -6.888463202449027,
  lng: -38.558930105104125
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  // Marcador principal
  marker = new google.maps.Marker({
      map: map,
      position: center,
      draggable: true
  });

  loadAllMarkers(map);

  map.addListener("click", (evt) => {
    addMarker(evt);
  });

  marker.addListener('position_changed', ()=>{
      map.setCenter(marker.position);
  });

  const botao = document.getElementById('btn');
  botao.addEventListener('click', () => {
    salvar(marker, map);
  })

 /*  const contentString = 
    '<div id="content">'
    '<h1> Uluru</h1>';
    "</div>"
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
    const marker = new google.maps.Marker({
      position: uluru,
      map,
      title: "Uluru (Ayers Rock)",
    });
  
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
} */


function addMarker(evt){
    marker.setPosition(evt.latLng);
}

// Carrega todos os marcadores já existentes no banco de dados
// assim que o site é aberto.
async function loadAllMarkers(map) {

  const evento = await fetch("//localhost:3003/eventos",{
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
  }).then(response => response.json());  
  // Cria um marcador para cada ponto no banco de dados
  for (let i = 0; i < evento.length; i++) {
    createNewMarker(
      map,
      evento[i].lat,
      evento[i].lng,
      evento[i].nome
      )
}
function createNewMarker(map, lat, lng, name) {

  let pos = {
    lat: lat,
    lng: lng
  };

  // Marcador dos Evento no mapaS
  markerPoints = new google.maps.Marker({
    map: map,
    position: pos,
    draggable: false,
    title: name
  });

  // Salva os marcadores em uma array, mas por enquanto
  // Não serve pra nada (Util pra remover os marcadores no futuro)
  newMarkers.push(markerPoints);
  return marker;
}

async function salvar(marker, map){

    const obj = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('desc').value,
        local: document.getElementById('local').value,
        dataDeInicio: document.getElementById('data-inicio').value,
        dataDeTermino: document.getElementById('data-termino').value,
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    };

    console.log(obj);
    await fetch("//localhost:3003/eventos",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
     });

     // Cria um marcador novo toda vez que o usuário adiciona um ponto
     // no banco de dados.
    createNewMarker(
      map,
      obj.lat,
      obj.lng,
      obj.nome
    )
}}
//Cria balão de informação de cada evento no mapa

/* let arrayInfoWindow = [];

function createMarker(item, id) {
    const lat = item.geometry.coordinates[0];
    const lng = item.geometry.coordinates[1];
    const point = new google.maps.LatLng(lat, lng);
    markerArray.push(
        new google.maps.Marker({
        position: point,
        map: map,
        nome: item.nome,
        descricao: item.descricao,
        local: item.local,
        dataDeInicio: item.dataDeInicio,
        dataDeTermino: item.dataDeTermino
    })
    );
    arrayInfoWindow.push(
        new google.maps.InfoWindow({
            content: `<div class="infoWindow-content">
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <p>${item.local}</p>
                <p>${item.dataDeInicio}</p>
                <p>${item.dataDeTermino}</p>
            </div>`,
        })
    );
    markerArray[id].addListener("click", () => {
        arrayInfoWindow[id].open({
            anchor: markerArray[id],
            map
        });
    });
}
 */
    //Validação do formulário
    if(document.getElementById('nome').value == "" ||
       document.getElementById('nome').value.length < 1) {
        // Caso o campo de nome esteja com um valor inválido
        alert( "Preencha campo NOME corretamente!" );

    } else if(document.getElementById('desc').value== "" ||
              document.getElementById('desc').value.length < 1) {
        // Caso o campo de descricao esteja com um valor inválido
        alert( "Preencha campo DESCRIÇÃO corretamente!" );

    } else if(document.getElementById('local').value== "" ||
              document.getElementById('local').value.length < 1) {
        // Caso o campo de local esteja com um valor inválido
        alert( "Preencha campo LOCAL corretamente!" );

     // Todos os campos foram preechidos corretamente
    } else alert("Salvo com sucesso");
}