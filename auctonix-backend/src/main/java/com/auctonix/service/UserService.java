package com.auctonix.service;

import com.auctonix.exception.CustomException;
import com.auctonix.model.User;
import com.auctonix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    //get user by id
    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(()->new CustomException("User Not Found"));
    }

    //get all users
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    //update user status
    public void updateUserStatus(Long id,boolean active){
        User user=getUserById(id);
        user.setActive(active);
        userRepository.save(user);
    }
}
