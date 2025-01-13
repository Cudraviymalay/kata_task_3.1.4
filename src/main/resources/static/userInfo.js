const url = 'http://localhost:8088/api/admin';

async function getCurrentUser() {
    fetch('http://localhost:8088/api/user')
        .then(res => res.json())
        .then(user => {
            document.getElementById('usernamePlaceholder').textContent = user.username;
            document.getElementById('userRoles').textContent = user.roles ? user.roles.map(role => role.role.substring(5)).join(', ') : "";

            // Обновим таблицу с данными пользователя
            const tableBody = document.getElementById('userTableBody');
            tableBody.innerHTML = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.surname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.roles ? user.roles.map(role => role.role.substring(5)).join(', ') : ''}</td>
                    </tr>
                `;
        });
}

getCurrentUser(); // Вызов функции для получения данных пользователя

// Инициализация вкладок
document.addEventListener('DOMContentLoaded', function () {
    var tab = new bootstrap.Tab(document.querySelector('.nav-link.active'));  // Инициализация активной вкладки
    tab.show();  // Показ активной вкладки
});