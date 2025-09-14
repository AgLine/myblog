package com.example.myblog.auth.service;

import com.example.myblog.auth.dto.SignupRequestDto;

import java.util.Map;

public interface AuthSvc {
    //회원가입
    public void signup(SignupRequestDto dto);
    //email중복확인
    public boolean validateEmail(String email, String provider);
    //userId 중복확인
    public boolean validateUserId(String userId, String provider);
    //로그인
    public SignupRequestDto login(SignupRequestDto dto);
    //구글로그인
    Map<String, String> loginWithGoogle(String idToken);

}
