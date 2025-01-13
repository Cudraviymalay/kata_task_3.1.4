package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.security.Principal;
import java.util.List;
import java.util.Set;

public interface UserService {

    List<User> getAllUsers();

    void save(User user);

    User getOne(Long id);

    User createUser(User user, Set<Role> roles);

    public void updateUser(User user);

    void delete(Long id);

    public User oneUser(Principal principal);
}