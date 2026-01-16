package com.auctonix.controller;

import com.auctonix.dto.LoginRequest;
import com.auctonix.dto.RegisterRequest;
import com.auctonix.model.User;
import com.auctonix.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    //Register api
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request){
        User user=authService.register(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    //Login api
    @PostMapping("/login")
    public ResponseEntity<User> login(@Valid @RequestBody LoginRequest request){
        User user=authService.login(request);
        return ResponseEntity.ok(user);
    }
}
