/* lista de equipos */
const $equipos = document.querySelector('#equipos');
const $jugadores = document.querySelector('#jugadores')

const renderListaJugadores = (lista, equipo)=>{
    $jugadores.innerHTML = `<h2>${equipo}</h2>`
    
    lista.forEach(jugador => {
        const li = document.createElement('li');
        li.textContent = jugador.nombre;
        $jugadores.appendChild(li);
    });
}

const getJugadores = async(equipo_id, equipo, render)=>{
    const response = await fetch(`/api/jugadores/${equipo_id}/jugadores`);
    if(response.status === 200){
        const data = await response.json();
        render(data, equipo);
    }
}

const accionBotones = ()=>{
    $equipos.addEventListener('click', e=>{
        if(e.target.classList[0] === 'btn'){
            const equipo = e.target.dataset.equipo
            const id = e.target.dataset.id
            getJugadores(id, equipo, renderListaJugadores)
        }
        
    })
}


const renderListaEquipos = (lista)=>{
    $equipos.innerHTML = ''
    lista.forEach(equipo => {
        const button = document.createElement('button')
        const li = document.createElement('li');
        button.classList.add('btn');
        button.textContent = equipo.nombre;
        button.dataset.id = equipo.id;
        button.dataset.equipo = equipo.nombre;
        li.appendChild(button);
        $equipos.appendChild(li);
    });
}

const getEquipos = async(render)=>{
    const response = await fetch('/api/equipos/');
    if(response.status === 200){
        const data = await response.json()
        console.log(data)
        render(data);
        accionBotones()
    }
}

getEquipos(renderListaEquipos);


/* lista jugadores */
