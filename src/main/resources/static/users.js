const apiUrl = 'http://localhost:8080/api/admin';

/**
 * Получение списка всех пользователей из API и отображение в таблице
 */
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();

        // Заполнение таблицы информацией о пользователях
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';  // Очищаем таблицу перед добавлением новых данных

        // Добавляем каждого пользователя в таблицу
        users.forEach(user => {
            const roles = user.roles ? user.roles.map(role => role.name.substring(5)).join(', ') : 'No roles';
            tableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                    <td><button class="btn btn-warning" onclick="editUser(${user.id})">Edit</button></td>
                    <td><button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        alert('Ошибка при получении списка пользователей');
    }
}

/**
 * Редактирование пользователя
 */
async function editUser(userId) {
    // Получаем текущие данные пользователя для редактирования
    const user = await getUserById(userId);
    if (!user) return;

    // Заполняем форму редактирования
    document.getElementById("editId").value = user.id;
    document.getElementById("editNameU").value = user.username;
    document.getElementById("editLastName").value = user.surname;
    document.getElementById("editAge").value = user.age;
    document.getElementById("editEmail").value = user.email;

    const roleOptions = document.getElementById("editRole").options;
    for (let option of roleOptions) {
        option.selected = user.roles.some(role => role.name.substring(5) === option.value);
    }

    // Показываем модальное окно
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

/**
 * Удаление пользователя
 */
async function deleteUser(userId) {
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
        try {
            const response = await fetch(`${apiUrl}/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Пользователь удален');
                fetchUsers();  // Перезагружаем список пользователей
            } else {
                alert('Ошибка при удалении пользователя');
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            alert('Ошибка при удалении пользователя');
        }
    }
}

// Вызов функции для загрузки списка пользователей при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUsers);

// Обработчик отправки формы добавления пользователя
document.getElementById('addUserForm').addEventListener('submit', addUser);

// Обработчик кнопки сохранения изменений пользователя
document.getElementById('modalEdit').addEventListener('submit', function(event) {
    event.preventDefault();
    saveUserEdit();
});
