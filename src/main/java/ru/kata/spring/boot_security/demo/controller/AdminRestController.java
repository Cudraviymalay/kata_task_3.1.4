package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    final UserService userService;
    final RoleService roleService;

    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    // Получение всех ролей
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    // Получение всех пользователей
    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Получение пользователя по ID
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getOne(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Создание нового пользователя
    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<HttpStatus> createUser(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Обновление существующего пользователя
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<HttpStatus> updateUser(@PathVariable Long id, @RequestBody User user) {
        User existingUser = userService.getOne(id);
        if (existingUser != null) {
            user.setId(id);
            userService.updateUser(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Удаление пользователя
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        User user = userService.getOne(id);
        if (user != null) {
            userService.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}


//package ru.kata.spring.boot_security.demo.controller;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import ru.kata.spring.boot_security.demo.models.Role;
//import ru.kata.spring.boot_security.demo.models.User;
//import ru.kata.spring.boot_security.demo.service.RoleService;
//import ru.kata.spring.boot_security.demo.service.UserService;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin")
//public class AdminRestController {
//
//    private final UserService userService;
//    private final RoleService roleService;
//
//    public AdminRestController(UserService userService, RoleService roleService) {
//        this.userService = userService;
//        this.roleService = roleService;
//    }
//
//    // Получение всех ролей
//    @GetMapping("/roles")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<List<Role>> getAllRoles() {
//        return ResponseEntity.ok(roleService.getAllRoles());
//    }
//
//    // Получение всех пользователей
//    @GetMapping("")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<List<User>> getAllUsers() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }
//
//    // Получение пользователя по ID
//    @GetMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
//        User user = userService.getOne(id);
//        if (user != null) {
//            return ResponseEntity.ok(user);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//
//    // Создание нового пользователя
//    @PostMapping("")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<HttpStatus> createUser(@RequestBody User user) {
//        userService.save(user);
//        return ResponseEntity.status(HttpStatus.CREATED).build();
//    }
//
//    // Обновление существующего пользователя
//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<HttpStatus> updateUser(@PathVariable Long id, @RequestBody User user) {
//        User existingUser = userService.getOne(id);
//        if (existingUser != null) {
//            user.setId(id);
//            userService.updateUser(user);
//            return ResponseEntity.ok().build();
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//
//    // Удаление пользователя
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
//        User user = userService.getOne(id);
//        if (user != null) {
//            userService.delete(id);
//            return ResponseEntity.ok().build();
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//}