document.getElementById('admin-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dataEnvio = getCurrentDate();

    // Validação do email
    const result = validateEmail(email);
    if (result !== 'valid') {
        alert(result);
        return;
    }

    addUser(nome, email, dataEnvio);
    nome.value = '';
    email.value = '';

    document.getElementById('admin-form').reset();
});

function addUser(nome, email, dataEnvio) {
    const usuario = { dataEnvio: dataEnvio, nome: nome, email: email };
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuário cadastrado com sucesso!');
    renderUserlist();
}

function renderUserlist(keyword = '') {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
    
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.length === 0) {
            const noUsersMessage = document.createElement('li');
            noUsersMessage.textContent = 'Sem usuários cadastrados.';
            userList.appendChild(noUsersMessage);
            userList.style.display = 'flex';
            userList.style.alignItems = 'center';
            userList.style.justifyContent = 'center';
            userList.style.flexDirection = 'column';
            return;
        }
    
        keyword = keyword.toString().toLowerCase();
        usuarios.forEach((usuario, index) => {
            if (usuario.nome.toLowerCase().includes(keyword) || usuario.email.toLowerCase().includes(keyword)) {
                const li = document.createElement('li');
                li.textContent = `Data: ${usuario.dataEnvio} | Nome: ${usuario.nome} | E-mail: ${usuario.email}`;
                
                const deleteButton = document.createElement('button');
                deleteButton.setAttribute('id', 'delete-button');
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', function() {
                    deleteUser(index);
                });
    
                li.appendChild(deleteButton);
                userList.appendChild(li);
            }
        });
};

function deleteUser(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    renderUserlist();
}

function deleteAllUsers() {
    localStorage.clear();
    renderUserlist();
}

document.getElementById('delete-all').addEventListener('click', function() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar se a lista de usuários é vazia
    if (!usuarios || usuarios.length === 0) { 
        alert('Nenhum usuário encontrado.'); 
        return;
    } else {
        if (confirm('Tem certeza que deseja excluir todos os usuários?')) {
            deleteAllUsers();
        }
    }
});

function validateEmail(email) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
        return 'Insira um e-mail válido.';
    }
    for (let i = 0; i < usuarios.length; i++) {
        if (email === usuarios[i].email) {
            return 'Este e-mail já está cadastrado, insira outro.';
        }
    }
    return 'valid';
}

// Limpar os campos do form
document.getElementById('clear-fields').addEventListener('click', () => document.getElementById('admin-form').reset());

// Pesquisar itens da lista
document.getElementById('search').addEventListener('input', function() {
    const keyword = this.value;
    renderUserlist(keyword);
});

// Exibir a lista de usuários ao carregar a página
document.addEventListener('DOMContentLoaded', renderUserlist());

// Obter a data em que foi enviado os campos do form
function getCurrentDate(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let year = date.getFullYear();
    let dateString = day + "/" + month + "/" + year;
    return dateString;
}