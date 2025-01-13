// // Пример JSON данных
// const usersData = [
//     { id: 1, username: "John", surname: "Doe", age: 30, email: "john.doe@example.com", role: "ADMIN" },
//     { id: 2, username: "Jane", surname: "Smith", age: 25, email: "jane.smith@example.com", role: "USER" },
//     { id: 3, username: "Alice", surname: "Brown", age: 28, email: "alice.brown@example.com", role: "USER" }
// ];
//
// // Функция для заполнения таблицы пользователей
// function populateUserTable(users) {
//     const tableBody = document.querySelector("#userTable tbody");
//     tableBody.innerHTML = ""; // Очищаем таблицу перед заполнением
//
//     users.forEach(user => {
//         const row = document.createElement("tr");
//
//         row.innerHTML = `
//             <td>${user.id}</td>
//             <td>${user.username}</td>
//             <td>${user.surname}</td>
//             <td>${user.age}</td>
//             <td>${user.email}</td>
//             <td>${user.role}</td>
//             <td>
//                 <button class="btn btn-primary btn-sm" onclick="openEditModal(${user.id})">Edit</button>
//             </td>
//             <td>
//                 <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${user.id})">Delete</button>
//             </td>
//         `;
//
//         tableBody.appendChild(row);
//     });
// }
//
// // Открыть модальное окно редактирования
// function openEditModal(userId) {
//     const user = usersData.find(u => u.id === userId);
//
//     if (user) {
//         document.getElementById("editId").value = user.id;
//         document.getElementById("editNameU").value = user.username;
//         document.getElementById("editLastName").value = user.surname;
//         document.getElementById("editAge").value = user.age;
//         document.getElementById("editEmail").value = user.email;
//         document.getElementById("editRole").value = user.role;
//
//         const editModal = new bootstrap.Modal(document.getElementById("editModal"));
//         editModal.show();
//     }
// }
//
// // Функция сохранения изменений
// function editUser() {
//     const userId = document.getElementById("editId").value;
//     const userIndex = usersData.findIndex(u => u.id === parseInt(userId));
//
//     if (userIndex !== -1) {
//         usersData[userIndex] = {
//             id: parseInt(userId),
//             username: document.getElementById("editNameU").value,
//             surname: document.getElementById("editLastName").value,
//             age: parseInt(document.getElementById("editAge").value),
//             email: document.getElementById("editEmail").value,
//             role: document.getElementById("editRole").value
//         };
//
//         populateUserTable(usersData);
//
//         const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
//         editModal.hide();
//     }
// }
//
// // Открыть модальное окно удаления
// function openDeleteModal(userId) {
//     const user = usersData.find(u => u.id === userId);
//
//     if (user) {
//         document.getElementById("name").value = user.username;
//         document.getElementById("lastName").value = user.surname;
//         document.getElementById("age").value = user.age;
//         document.getElementById("email").value = user.email;
//
//         const deleteModal = new bootstrap.Modal(document.getElementById("deleteUserModal"));
//         deleteModal.show();
//
//         // Сохранить ID пользователя для удаления
//         document.getElementById("deleteUserForm").onsubmit = function (e) {
//             e.preventDefault();
//             deleteUser(userId);
//         };
//     }
// }
//
// // Удаление пользователя
// function deleteUser(userId) {
//     const userIndex = usersData.findIndex(u => u.id === userId);
//
//     if (userIndex !== -1) {
//         usersData.splice(userIndex, 1);
//         populateUserTable(usersData);
//
//         const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteUserModal"));
//         deleteModal.hide();
//     }
// }
//
// // Заполнение таблицы при загрузке страницы
// document.addEventListener("DOMContentLoaded", () => {
//     populateUserTable(usersData);
// });

// Функция для загрузки пользователей с сервера
async function loadUsers() {
    try {
        const response = await fetch("/api/admin");
        if (!response.ok) throw new Error("Ошибка загрузки пользователей");
        const users = await response.json();
        populateUserTable(users);
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Функция для заполнения таблицы пользователей
function populateUserTable(users) {
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = ""; // Очищаем таблицу перед заполнением

    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.surname}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${user.id})">Edit</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${user.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Открыть модальное окно редактирования
async function openEditModal(userId) {
    try {
        const response = await fetch(`/api/admin/${userId}`);
        if (!response.ok) throw new Error("Ошибка получения данных пользователя");
        const user = await response.json();

        document.getElementById("editId").value = user.id;
        document.getElementById("editNameU").value = user.username;
        document.getElementById("editLastName").value = user.surname;
        document.getElementById("editAge").value = user.age;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editRole").value = user.role;

        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Функция сохранения изменений
async function editUser() {
    const userId = document.getElementById("editId").value;

    const updatedUser = {
        id: parseInt(userId),
        username: document.getElementById("editNameU").value,
        surname: document.getElementById("editLastName").value,
        age: parseInt(document.getElementById("editAge").value),
        email: document.getElementById("editEmail").value,
        role: document.getElementById("editRole").value
    };

    try {
        const response = await fetch(`/api/admin/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser)
        });
        if (!response.ok) throw new Error("Ошибка обновления пользователя");
        loadUsers(); // Обновляем таблицу
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Открыть модальное окно удаления
function openDeleteModal(userId) {
    document.getElementById("deleteUserForm").onsubmit = function (e) {
        e.preventDefault();
        deleteUser(userId);
    };

    const deleteModal = new bootstrap.Modal(document.getElementById("deleteUserModal"));
    deleteModal.show();
}

// Удаление пользователя
async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/admin/${userId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Ошибка удаления пользователя");
        loadUsers(); // Обновляем таблицу
        bootstrap.Modal.getInstance(document.getElementById("deleteUserModal")).hide();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Заполнение таблицы при загрузке страницы
document.addEventListener("DOMContentLoaded", loadUsers);
