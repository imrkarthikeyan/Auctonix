package com.auctonix.service;

import com.auctonix.dto.LoginRequest;
import com.auctonix.dto.RegisterRequest;
import com.auctonix.exception.CustomException;
import com.auctonix.model.Role;
import com.auctonix.model.User;
import com.auctonix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor     //only final fields
public class AuthService {
    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    //Register user
    public User register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new CustomException("Email already registered");
        }
        if(userRepository.existsByPhone(request.getPhone())){
            throw new CustomException("Phone number already registered");
        }

        User user=User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .active(true)
                .build();

        return userRepository.save(user);

    }


    //Login user
    public User login(LoginRequest request){
        User user=userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new CustomException("Invalid email or password"));

        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new CustomException("Invalid email or password");
        }

        if(!user.isActive()){
            throw new CustomException("User account is disabled");
        }

        return user;
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
