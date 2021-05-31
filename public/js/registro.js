const $formularioRegistro = document.querySelector('#formulario-login');

const errores = document.querySelector('.errores-registro ul');



$formularioRegistro.addEventListener('submit', (e)=>{
    errores.innerHTML = '';

    try {
        if($formularioRegistro.userName.value.length < 3)throw new Error('nombre debe ser mayor a 3 caracteres');
        if($formularioRegistro.password.value.length < 5)throw new Error('el password debe tener mas de 5 caracteres');
        if($formularioRegistro.password.value !== $formularioRegistro.password2.value)throw new Error('error confirmacion password');
    } catch (err) {
        e.preventDefault()
        const li = document.createElement('li');
        li.textContent = err.message
        errores.appendChild(li);
    }
})
