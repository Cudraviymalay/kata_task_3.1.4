package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.DAO.UserDAO;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserDAO userDAO;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    @Lazy
    public UserServiceImpl(UserDAO userDAO, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userDAO.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        return user.get();
    }

    @Transactional
    @Override
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    @Transactional
    @Override
    public void save(User user) {
        userDAO.save(user);
    }

    @Transactional
    @Override
    public User getOne(Long id) {
        return userDAO.findById(id).get();
    }

    @Override
    public User oneUser(Principal principal) {
        return (User) ((Authentication) principal).getPrincipal();
    }

    @Transactional
    @Override
    public User createUser(User user, Set<Role> roles) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> setOfRoles = roles.stream()
                .map(role -> {
                    Role foundRole = roleService.findByName(role.getName());
                    if (foundRole == null) {
                        throw new EntityNotFoundException("Role " + role.getName() + " not found");
                    }
                    return foundRole;
                })
                .collect(Collectors.toSet());

        user.setRoles(setOfRoles);
        return user;
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        if (user.getId() == null) {
            throw new IllegalArgumentException("User null");
        }
        User existingUser = userDAO.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Юзер не найдер"));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isEmpty() &&
                !passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        existingUser.setRoles(user.getRoles());
        userDAO.save(existingUser);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        userDAO.deleteById(id);
    }

    @Transactional
    public Role getRole(String role) {
        return roleService.findByName(role);
    }
}