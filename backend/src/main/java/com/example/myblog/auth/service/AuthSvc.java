package com.example.myblog.auth.service;

import com.example.myblog.auth.dto.SignupRequestDto;

public interface AuthSvc {
    //회원가입
    public void signup(SignupRequestDto dto);
    //email중복확인
    public boolean validateEmail(String email);
    //로그인
    public String login(SignupRequestDto dto);

}
