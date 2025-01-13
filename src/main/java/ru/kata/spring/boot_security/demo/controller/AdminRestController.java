package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    final UserService userService;
    final RoleService roleService;

    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public ResponseEntity<Iterable<User>> getUsers(Principal principal) {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUser(Principal principal) {
        return ResponseEntity.ok(userService.oneUser(principal));
    }

    @PostMapping("/new")
    public ResponseEntity<User> addUser(@RequestBody User user, @RequestParam(value = "role") Set<Role> roles) {
        userService.save(userService.createUser(user, roles));
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/update")
    public ResponseEntity<User> update(@RequestBody User user,
                                       @RequestParam(value = "role", required = false) Set<Role> roleNames,
                                       @RequestParam(value = "id") long id) {
        User updatedUser = userService.update(id, userService.updateUser(id, user, roleNames));
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestParam("id") long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}