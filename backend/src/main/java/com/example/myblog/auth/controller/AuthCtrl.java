package com.example.myblog.auth.controller;

import com.example.myblog.auth.dto.SignupRequestDto;
import com.example.myblog.auth.service.AuthSvc;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthCtrl {

    @Autowired
    private AuthSvc authSvc;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDto dto) {
        //System.out.println(dto.getEmail());
        //System.out.println(dto.getPassword());
        authSvc.signup(dto);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/validateEmail")
    public ResponseEntity<?> validateEmail (@RequestParam String email){
        //System.out.println(email);
        if(authSvc.validateEmail(email)){
            return ResponseEntity.ok(Map.of("available", false));
        }
        return ResponseEntity.ok(Map.of("available", true));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SignupRequestDto dto) {
        //System.out.println(dto.getEmail());

        String token = authSvc.login(dto);
        if(token.equals("false")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }

        return ResponseEntity.ok(Map.of("token", token, "email", dto.getEmail()));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("token");

        Map<String, String> result = authSvc.loginWithGoogle(idToken);
        //System.out.println(jwt);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google 로그인 실패");
        }

        return ResponseEntity.ok(result);
    }
}