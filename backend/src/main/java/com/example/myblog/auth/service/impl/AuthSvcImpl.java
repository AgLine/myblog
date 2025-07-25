package com.example.myblog.auth.service.impl;

import com.example.myblog.auth.dto.SignupRequestDto;
import com.example.myblog.auth.entity.User;
import com.example.myblog.auth.repository.UserRepository;
import com.example.myblog.auth.service.AuthSvc;
import com.example.myblog.auth.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AuthSvcImpl implements AuthSvc, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public void signup(SignupRequestDto dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setProvider("local");
        userRepository.save(user);
    }

    @Override
    public boolean validateEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public String login(SignupRequestDto dto) {
        Optional <User> userOptional = userRepository.findByEmail(dto.getEmail());
        if (userOptional.isEmpty()) {
            return "false"; // 사용자 없음
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return "false"; // 비밀번호 불일치
        }

        return jwtUtil.generateToken(user.getEmail());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }
}
