// Массив для хранения данных пользователей (замените на API-запросы, если данные берутся с сервера)
const usersData = [
    {
        id: 1,
        username: "admin",
        surname: "admin",
        age: 28,
        email: "admin@mail.ru",
        roles: ["ADMIN"],
    },
    {
        id: 2,
        username: "user",
        surname: "user",
        age: 25,
        email: "user@mail.ru",
        roles: ["USER"],
    },
];

let currentEditId = null; // ID текущего редактируемого пользователя

// Функция для отображения пользователей в таблице
function populateUserTable() {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    usersData.forEach((user) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.surname}</td>
      <td>${user.age}</td>
      <td>${user.email}</td>
      <td>${user.roles.join(", ")}</td>
      <td><button class="btn btn-warning" onclick="openEditModal(${user.id})">Edit</button></td>
      <td><button class="btn btn-danger" onclick="openDeleteModal(${user.id})">Delete</button></td>
    `;

        tableBody.appendChild(row);
    });
}

// Функция для добавления нового пользователя
function addUser(event) {
    event.preventDefault();

    const form = document.getElementById("addUserForm");
    const newUser = {
        id: usersData.length ? usersData[usersData.length - 1].id + 1 : 1,
        username: form.username.value,
        surname: form.surname.value,
        age: parseInt(form.age.value, 10),
        email: form.email.value,
        roles: Array.from(form.roles.selectedOptions).map((option) => option.text),
    };

    usersData.push(newUser);
    form.reset();
    populateUserTable();
    alert("User added successfully!");
}

// Функция для открытия модального окна редактирования
function openEditModal(id) {
    currentEditId = id;
    const user = usersData.find((user) => user.id === id);

    if (user) {
        document.getElementById("editId").value = user.id;
        document.getElementById("editNameU").value = user.username;
        document.getElementById("editLastName").value = user.surname;
        document.getElementById("editAge").value = user.age;
        document.getElementById("editEmail").value = user.email;

        const roleSelect = document.getElementById("editRole");
        Array.from(roleSelect.options).forEach((option) => {
            option.selected = user.roles.includes(option.text);
        });

        const modal = new bootstrap.Modal(document.getElementById("editModal"));
        modal.show();
    }
}

// Функция для сохранения изменений после редактирования
function editUser() {
    const user = usersData.find((user) => user.id === currentEditId);

    if (user) {
        user.username = document.getElementById("editNameU").value;
        user.surname = document.getElementById("editLastName").value;
        user.age = parseInt(document.getElementById("editAge").value, 10);
        user.email = document.getElementById("editEmail").value;
        user.roles = Array.from(document.getElementById("editRole").selectedOptions).map((option) => option.text);

        populateUserTable();
        alert("User updated successfully!");
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    modal.hide();
}

// Функция для открытия модального окна удаления
function openDeleteModal(id) {
    currentEditId = id;
    const user = usersData.find((user) => user.id === id);

    if (user) {
        document.getElementById("deleteUserForm").onsubmit = (event) => {
            event.preventDefault();
            deleteUser(id);
        };

        const modal = new bootstrap.Modal(document.getElementById("deleteUserModal"));
        modal.show();
    }
}

// Функция для удаления пользователя
function deleteUser(id) {
    const userIndex = usersData.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
        usersData.splice(userIndex, 1);
        populateUserTable();
        alert("User deleted successfully!");
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("deleteUserModal"));
    modal.hide();
}

// Обработчик для формы добавления пользователя
document.getElementById("addUserForm").addEventListener("submit", addUser);

// Инициализация таблицы при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    populateUserTable();
});
