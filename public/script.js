// public/script.js
const API_BASE_URL = 'http://127.0.0.1:3000/api';

const welcomeMessage = document.getElementById('welcomeMessage');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const logoutBtn = document.getElementById('logoutBtn');
const adminLink = document.getElementById('adminLink');
const messageDiv = document.getElementById('message');

function showMessage(msg, type = 'success') {
    if (messageDiv) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

async function fetchTodos() {
    const todoList = document.getElementById('todoList');
    if (!todoList) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const todos = await response.json();
            todoList.innerHTML = '';
            if (todos.length === 0) {
                todoList.innerHTML = '<p>Brak zadań. Dodaj pierwsze!</p>';
                return;
            }
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = todo.completed ? 'completed' : '';
                li.dataset.id = todo._id;
                li.innerHTML = `
                    <span>
                        <strong>${todo.title}</strong>
                        ${todo.description ? `<br><small>${todo.description}</small>` : ''}
                    </span>
                    <div class="todo-actions">
                        <button class="toggle-complete">${todo.completed ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}</button>
                        <button class="edit">Edytuj</button>
                        <button class="delete">Usuń</button>
                    </div>
                `;
                todoList.appendChild(li);
            });
        } else {
            const errorData = await response.json();
            showMessage(errorData.message || 'Błąd ładowania zadań.', 'error');
        }
    } catch (error) {
        console.error('Fetch todos error:', error);
        showMessage('Błąd sieci podczas ładowania zadań.', 'error');
    }
}

async function fetchUsers() {
    const userList = document.getElementById('userList');
    if (!userList) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const users = await response.json();
            userList.innerHTML = '';
            if (users.length === 0) {
                userList.innerHTML = '<p>Nie znaleziono użytkowników.</p>';
                return;
            }
            users.forEach(user => {
                const li = document.createElement('li');
                li.dataset.id = user._id;
                li.innerHTML = `
                    <span>
                        <strong>${user.username}</strong> (Rola: ${user.role})
                    </span>
                    <div class="user-actions">
                        <button class="change-role" data-current-role="${user.role}">${user.role === 'admin' ? 'Uczyń użytkownikiem' : 'Uczyń administratorem'}</button>
                        <button class="delete-user">Usuń</button>
                    </div>
                `;
                userList.appendChild(li);
            });
        } else {
            const errorData = await response.json();
            showMessage(errorData.message || 'Błąd ładowania użytkowników.', 'error');
            const adminSection = document.getElementById('adminSection');
            if (adminSection) adminSection.style.display = 'none';
            const notAdminMessage = document.getElementById('notAdminMessage');
            if (notAdminMessage) notAdminMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Fetch users error:', error);
        showMessage('Błąd sieci podczas ładowania użytkowników.', 'error');
        const adminSection = document.getElementById('adminSection');
        if (adminSection) adminSection.style.display = 'none';
        const notAdminMessage = document.getElementById('notAdminMessage');
        if (notAdminMessage) notAdminMessage.style.display = 'block';
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const user = await response.json();
            welcomeMessage.textContent = `Witaj, ${user.username}!`;
            welcomeMessage.style.display = 'inline';
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            logoutBtn.style.display = 'inline';

            if (user.role === 'admin') {
                adminLink.style.display = 'inline';
            } else {
                adminLink.style.display = 'none';
            }

            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                document.getElementById('todoSection').style.display = 'block';
                document.getElementById('notLoggedInMessage').style.display = 'none';
                fetchTodos();
            }
            if (window.location.pathname === '/admin.html') {
                if (user.role === 'admin') {
                    document.getElementById('adminSection').style.display = 'block';
                    document.getElementById('notAdminMessage').style.display = 'none';
                    fetchUsers();
                } else {
                    document.getElementById('adminSection').style.display = 'none';
                    document.getElementById('notAdminMessage').style.display = 'block';
                }
            }

        } else {
            welcomeMessage.style.display = 'none';
            loginLink.style.display = 'inline';
            registerLink.style.display = 'inline';
            logoutBtn.style.display = 'none';
            adminLink.style.display = 'none';

            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                const todoSection = document.getElementById('todoSection');
                if (todoSection) todoSection.style.display = 'none';
                const notLoggedInMessage = document.getElementById('notLoggedInMessage');
                if (notLoggedInMessage) notLoggedInMessage.style.display = 'block';
            }
            if (window.location.pathname === '/admin.html') {
                const adminSection = document.getElementById('adminSection');
                if (adminSection) adminSection.style.display = 'none';
                const notAdminMessage = document.getElementById('notAdminMessage');
                if (notAdminMessage) notAdminMessage.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        welcomeMessage.style.display = 'none';
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        logoutBtn.style.display = 'none';
        adminLink.style.display = 'none';
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            const todoSection = document.getElementById('todoSection');
            if (todoSection) todoSection.style.display = 'none';
            const notLoggedInMessage = document.getElementById('notLoggedInMessage');
            if (notLoggedInMessage) notLoggedInMessage.style.display = 'block';
        }
        if (window.location.pathname === '/admin.html') {
            const adminSection = document.getElementById('adminSection');
            if (adminSection) adminSection.style.display = 'none';
            const notAdminMessage = document.getElementById('notAdminMessage');
            if (notAdminMessage) notAdminMessage.style.display = 'block';
        }
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (response.ok) {
                showMessage('Pomyślnie wylogowano.', 'success');
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                showMessage(errorData.message || 'Błąd wylogowania.', 'error');
            }
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('Błąd sieci podczas wylogowania.', 'error');
        }
    });
}

if (window.location.pathname === '/register.html') {
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message, 'success');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 1500);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Błąd sieci podczas rejestracji.', 'error');
            }
        });
    }
}

if (window.location.pathname === '/login.html') {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message, 'success');
                    window.location.href = '/';
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Błąd sieci podczas logowania.', 'error');
            }
        });
    }
}

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const todoTitleInput = document.getElementById('todoTitle');
    const todoDescriptionInput = document.getElementById('todoDescription');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', async () => {
            const title = todoTitleInput.value.trim();
            const description = todoDescriptionInput.value.trim();

            if (!title) {
                showMessage('Nazwa zadania nie może być pusta.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/todos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, description }),
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage('Zadanie dodano pomyślnie!', 'success');
                    todoTitleInput.value = '';
                    todoDescriptionInput.value = '';
                    fetchTodos();
                } else {
                    showMessage(data.message || 'Błąd dodawania zadania.', 'error');
                }
            } catch (error) {
                console.error('Add todo error:', error);
                showMessage('Błąd sieci podczas dodawania zadania.', 'error');
            }
        });
    }

    if (todoList) {
        todoList.addEventListener('click', async (e) => {
            const target = e.target;
            const listItem = target.closest('li');
            if (!listItem) return;

            const todoId = listItem.dataset.id;

            if (target.classList.contains('toggle-complete')) {
                const currentCompleted = listItem.classList.contains('completed');
                try {
                    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ completed: !currentCompleted }),
                        credentials: 'include'
                    });

                    const data = await response.json();
                    if (response.ok) {
                        showMessage('Status zadania zaktualizowano.', 'success');
                        fetchTodos();
                    } else {
                        showMessage(data.message || 'Błąd aktualizacji statusu zadania.', 'error');
                    }
                } catch (error) {
                    console.error('Toggle complete error:', error);
                    showMessage('Błąd sieci podczas aktualizacji statusu zadania.', 'error');
                }
            } else if (target.classList.contains('edit')) {
                const titleSpan = listItem.querySelector('span strong');
                const descriptionSmall = listItem.querySelector('span small');
                const currentTitle = titleSpan.textContent;
                const currentDescription = descriptionSmall ? descriptionSmall.textContent : '';

                const newTitle = prompt('Wprowadź nową nazwę zadania:', currentTitle);
                if (newTitle === null) return;

                const newDescription = prompt('Wprowadź nowy opis zadania (pozostaw puste, aby usunąć):', currentDescription);
                if (newDescription === null) return;

                try {
                    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title: newTitle.trim(), description: newDescription.trim() }),
                        credentials: 'include'
                    });

                    const data = await response.json();
                    if (response.ok) {
                        showMessage('Zadanie zaktualizowano pomyślnie!', 'success');
                        fetchTodos();
                    } else {
                        showMessage(data.message || 'Błąd aktualizacji zadania.', 'error');
                    }
                } catch (error) {
                    console.error('Edit todo error:', error);
                    showMessage('Błąd sieci podczas edycji zadania.', 'error');
                }
            } else if (target.classList.contains('delete')) {
                if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include'
                        });

                        const data = await response.json();
                        if (response.ok) {
                            showMessage(data.message, 'success');
                            fetchTodos();
                        } else {
                            showMessage(data.message || 'Błąd usuwania zadania.', 'error');
                        }
                    } catch (error) {
                        console.error('Delete todo error:', error);
                        showMessage('Błąd sieci podczas usuwania zadania.', 'error');
                    }
                }
            }
        });
    }
}

if (window.location.pathname === '/admin.html') {
    const userList = document.getElementById('userList');

    if (userList) {
        userList.addEventListener('click', async (e) => {
            const target = e.target;
            const listItem = target.closest('li');
            if (!listItem) return;

            const userId = listItem.dataset.id;

            if (target.classList.contains('change-role')) {
                const currentRole = target.dataset.currentRole;
                const newRole = currentRole === 'admin' ? 'user' : 'admin';
                if (confirm(`Czy na pewno chcesz zmienić rolę użytkownika na "${newRole}"?`)) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ role: newRole }),
                            credentials: 'include'
                        });

                        const data = await response.json();
                        if (response.ok) {
                            showMessage(data.message, 'success');
                            fetchUsers();
                        } else {
                            showMessage(data.message || 'Błąd zmiany roli użytkownika.', 'error');
                        }
                    } catch (error) {
                        console.error('Change role error:', error);
                        showMessage('Błąd sieci podczas zmiany roli użytkownika.', 'error');
                    }
                }
            } else if (target.classList.contains('delete-user')) {
                if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include'
                        });

                        const data = await response.json();
                        if (response.ok) {
                            showMessage(data.message, 'success');
                            fetchUsers();
                        } else {
                            showMessage(data.message || 'Błąd usuwania użytkownika.', 'error');
                        }
                    } catch (error) {
                        console.error('Delete user error:', error);
                        showMessage('Błąd sieci podczas usuwania użytkownika.', 'error');
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);