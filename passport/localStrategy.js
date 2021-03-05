//* passport(로그인) - 로컬 로그인 전략

'use strict';

//! 패키지(미들웨어) 참조
const LocalStrategy = require('passport-local').Strategy; // 로컬 로그인 전략
const bcrypt = require('bcrypt'); // 암호화

const { User } = require('../models'); // user DB

//! 모듈 생성
module.exports = (passport) => {
  passport.use(new LocalStrategy({ // 전략 설정
    usernameField: 'email', // req.body.email (입력 email)
    passwordField: 'password',  // req.body.password (입력 password)
  }, 
  // routes/auth.js 로그인 라우터 passport.authenticated의 done() 콜백함수로 전달
  async (email, password, done) => { // 전략 수행 // 위에서 email, password 받음
    try { // 성공하면
      const exUser = await User.findOne({ where: { email } }); // DB 중 입력된 email이 있는 사용자 정보 찾음
      if (exUser) { // exUser가 있으면 (등록된 email이면)
        const result = await bcrypt.compare(password, exUser.password); // (암호화된) 입력된 비밀번호와 입력된 email이 있는 사용자 정보에 등록된 비밀번호 비교
        if (result) { // 🟠 있으면 (비밀번호가 일치하면)
          done(null, exUser); // null: 서버 에러 발생 시 사용 // 사용자 정보 전달
        } else { // 🟠 없으면 (비밀번호가 일치하지 않으면)
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); // 경고 메세지
        }
      } else { // 🟠 exUser가 없으면 (등록된 email 아니면)
        done(null, false, { message: '가입되지 않은 회원입니다.' }); // 경고 메시지
      }
    } catch (error) { // 실패하면
      console.error(error);
      done(error); // 서버 에러
    }
  }));
};
