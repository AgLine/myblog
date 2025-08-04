package com.example.myblog.auth.service.impl;

import com.example.myblog.auth.dto.SignupRequestDto;
import com.example.myblog.auth.entity.User;
import com.example.myblog.auth.repository.UserRepository;
import com.example.myblog.auth.service.AuthSvc;
import com.example.myblog.auth.util.JwtUtil;

import com.google.api.client.auth.openidconnect.IdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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

    @Override
    public String loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(List.of("433451591816-rt2olvmo0ghreepvil468pikvp38c2dp.apps.googleusercontent.com")) // ★ 클라이언트 ID 입력
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                IdToken.Payload payload = idToken.getPayload();

                String email = (String) payload.get("email");
                boolean emailVerified = (Boolean) payload.get("email_verified");

                if (!emailVerified) return null;

                // 이미 있는 유저인지 확인
                Optional<User> userOptional = userRepository.findByEmail(email);
                User user;
                if (userOptional.isEmpty()) {
                    // 없으면 자동 회원가입
                    user = new User();
                    user.setEmail(email);
                    user.setPassword(""); // 비밀번호 없음
                    user.setProvider("google");

                    //System.out.println(user.getEmail());
                    userRepository.save(user);
                } else {
                    user = userOptional.get();
                }

                return jwtUtil.generateToken(user.getEmail());
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
