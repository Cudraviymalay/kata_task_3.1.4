const apiUrl = 'http://localhost:8080/api/admin/users';

/**
 * Получение всех пользователей из API и отображение в таблице
 */
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();

        // Заполнение таблицы пользователями
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const roles = user.roles
                ? user.roles.map(role => role.name.substring(5)).join(', ')
                : 'No roles';

            tableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">Edit</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
    }
}

// Вызов функции для загрузки данных пользователей при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUsers);


// Добавление пользователя
async function addUser(user) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        fetchUsers(); // Перезагрузка таблицы
    } catch (error) {
        console.error('Ошибка при добавлении пользователя:', error);
    }
}

// Редактирование пользователя
async function updateUser(user) {
    try {
        await fetch(`${API_URL}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        fetchUsers();
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
    }
}

// Удаление пользователя
async function deleteUser(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchUsers();
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
    }
}

// Пример использования функций
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Загрузить пользователей при загрузке страницы

    // Пример добавления пользователя
    document.getElementById('addUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const newUser = {
            username: document.getElementById('username').value,
            surname: document.getElementById('surname').value,
            age: +document.getElementById('age').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: Array.from(document.getElementById('roles').selectedOptions).map((option) => option.value),
        };
        await addUser(newUser);
        event.target.reset();
    });
});