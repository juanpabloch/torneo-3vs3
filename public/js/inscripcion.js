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
