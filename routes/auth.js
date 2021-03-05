//* router - 회원가입, 로그인, 로그아웃 인증
// isLoggedIn: 로그아웃
// isNotLoggedIn: 회원가입, 로그인

'use strict';

//! 모듈 참조 - 패키지(미들웨어)
const express = require('express');
const passport = require('passport'); // 로그인 인증
const bcrypt = require('bcrypt'); // 암호화

//! 모듈 참조 - 파일
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 접근 권한 제한 (로그인 여부 파악)
const { User } = require('../models'); // DB

//! 라우터 객체 생성
const router = express.Router();

//! 라우터
//? 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => { // /join으로 post(등록) 요청하면 // 로그인 안 한 상태
  const { email, nick, password } = req.body; // 이메일, 닉네임, 비밀번호 객체 생성 // req.body에 등록
  try { // 성공하면
    const exUser = await User.findOne({ where: { email } }); // user DB 중 입력 받은 email 있는거 찾음
    if (exUser) { // 🟠 exUser가 있으면 (이미 등록된 email이면)
      req.flash('joinError', '이미 가입된 이메일입니다.'); // joinError 메세지 출력
      return res.redirect('/join'); // join으로 페이지 이동(되돌려 보냄)
    }
    // 🟠 exUser 없으면 (회원가입 성공)
    const hash = await bcrypt.hash(password, 12); // 비밀번호 해시 암호화 // 12번 반복
    await User.create({ // 새로운 user DB 로우(객체) 생성 (저장) // 이메일, 닉네임, 비밀번호(해시)
      email,
      nick,
      password: hash,
    });
    return res.redirect('/'); // /home으로 페이지 이동
  } catch (error) { // 실패하면
    console.error(error);
    return next(error);
  }
});

//? 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => { // /login으로 post(등록) 요청하면 // 로그인 안 한 상태
  // 미들웨어 내의 미들웨어
  passport.authenticate('local', (authError, user, info) => { // 로컬 로그인 인증 전략 수행
    if (authError) { // authError값 있으면 (서버 에러)
      console.error(authError);
      return next(authError);
    }
    if (!user) { // 🟠 user값 없으면 (로그인 실패하면)
      req.flash('loginError', info.message); // 로그인 에러 출력
      return res.redirect('/'); // /home으로 페이지 이동
    }
    // 🟠 user값 있으면 (로그인 성공하면)
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

//? 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => { // /logout get 요청하면 // 로그인 한 상태
  req.logout(); // req.user 객체 제거
  req.session.destroy(); // req.session 객체 내용 제거
  res.redirect('/'); // /home으로 페이지 이동
});

//? 카카오 로그인 라우터
router.get('/kakao', passport.authenticate('kakao')); // /kakao로 get 요청 // 카카오 로그인 인증 전략 시작
// 위에 카카오(에서 주는) 인증 결과를 받을 라우터 주소
router.get('/kakao/callback', passport.authenticate('kakao', { // /kakao/callback로 get 요청하면 // 카카오 로그인 인증 전략 수행
  failureRedirect: '/', // 실패하면  /home으로 페이지 이동
}), (req, res) => { // 성공하면
  res.redirect('/'); // /home으로 페이지 이동
});

//! router 모듈 생성
module.exports = router;
