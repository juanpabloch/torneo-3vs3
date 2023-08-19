const $addJugador = document.querySelector('#addJugador');
const $formulario = document.querySelector('#formulario');
const $listaInput = document.querySelector('#listaInput');
const $errores = document.querySelector('.errores ul');


$addJugador.addEventListener('click', e=>{
    e.preventDefault();
    $errores.innerHTML = '';
    if($listaInput.children.length >= 6){
        const li = document.createElement('li');
        li.textContent = 'No se pueden agregar mas de 6 jugadores';
        $errores.appendChild(li);
        return
    }; 

    const numero = $listaInput.children.length + 1;
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="text" name="nombreJugador${numero}" id="nombreJugador" placeholder="Nombre">
        <input type="email" name="emailJugador${numero}" id="emailJugador" placeholder="Email">
    `
    $listaInput.appendChild(li);
})


$formulario.addEventListener('submit', async (e)=>{
    e.preventDefault()
    try {
        const equipo = {nombre: e.target.nombreEquipo.value}
        let result = await registerTeam("api/equipos/", equipo)
        
        const team_id = result.id

        const jugadores = []
        for (let i = 0; i < 6; i++) {
            if (e.target[`nombreJugador${i+1}`] !== undefined && e.target[`nombreJugador${i+1}`].value !== '') {
                jugadores.push({
                    nombre: e.target[`nombreJugador${i+1}`].value,
                    email: e.target[`emailJugador${i+1}`].value,
                    equipo_id: team_id
                })
            }
        }

        for (const item of jugadores) {
            const result = await registerPlayer('api/jugadores', item);
        }

        $formulario.reset()
        window.location.reload();
    } catch (error) {
        console.error(`Error registering team: ${error}`)
        e.preventDefault()
    }
})

const registerTeam = async(url="", data={})=>{
    // fetch /api/equipos/
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    
    return response.json(); // parses JSON response into native JavaScript objects
    // let query = 'INSERT INTO basquet_equipo(nombre) VALUES ($1)'
    // let respuesta = await qy(query, [data.nombreEquipo]);
    // console.log(respuesta)
    // const equipo_id = respuesta[0].id

    // const addJugador = async(numero)=>{
    //     if(!data[`nombreJugador${numero}`]){
    //         return;
    //     };
    //     const jugador = {
    //         nombre: data[`nombreJugador${numero}`],
    //         email: data[`emailJugador${numero}`],
    //         equipo_id
    //     };
        
    //     query = 'INSERT INTO basquet_jugador(nombre, email, equipo_id) VALUES($1, $2, $3)'
    //     respuesta = await qy(query, [jugador]);

    // };

    // for (let i = 0; i < 6; i++) {
    //     addJugador(i);
    // };
}

const registerPlayer = async (url="", data={})=>{
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json();
}