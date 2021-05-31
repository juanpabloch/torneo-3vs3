const $nav = document.querySelector('nav ul');
const usuario = document.cookie.split('=')[1];

if(usuario){
    const li = document.createElement('li');
    li.innerHTML = `
        <a class="links" href="/logout">logout</a>
    `
    $nav.appendChild(li);
}

