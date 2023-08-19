const $tabla = document.querySelector('tbody');


const renderJugadores = async(lista)=>{
    $tabla.innerHTML = ''
    let numero = 1;
    lista.forEach(jugador => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${numero}</td>
        <td>${jugador.nombre}</td>
        <td>${jugador.email}</td>
        <td>${jugador.team}</td>
        `
        $tabla.appendChild(tr);
        numero++
    });
}

const getJugadores = async()=>{
    const respuesta = await fetch('api/jugadores/jugadorEquipo');
    if(respuesta.status === 200){
        const data = await respuesta.json()
        renderJugadores(data)
    }
}

getJugadores()