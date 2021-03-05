//* passport(로그인) - 카카오 로그인 전략
// 처음 로그인할 때는 회원가입 처리 필요, 두 번째 로그인부터는 회원가입 처리 필요 X (바로 로그인 처리)

'use strict';

//! 패키지(미들웨어) 참조
const KakaoStrategy = require('passport-kakao').Strategy; // 카카오 로그인 전략

const { User } = require('../models'); // user DB

//! 모듈 생성
module.exports = (passport) => {
  passport.use(new KakaoStrategy({ // 전략 설정
    clientID: process.env.KAKAO_ID, // 카카오(에서 발급해주는) ID // 비밀키
    callbackURL: '/auth/kakao/callback', // 카카오(에서 주는) 인증 결과를 받을 라우터 주소
  },
  // routes/auth.js 로그인 라우터 passport.authenticated의 done() 콜백함수로 전달 
  async (accessToken, refreshToken, profile, done) => { // 전략 수행 // 위에서 accessToken, refreshToken, profile 받음
    try { // 성공하면
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } }); // DB 중 입력된 profile.id가 있는 사용자 정보 찾음
      if (exUser) { // 🟠 exUser가 있으면 (등록된 profile.id이면) => 첫 번째 로그인 이후
        done(null, exUser); // null: 서버 에러 발생 시 사용 // 사용자 정보 전달
      } else { //  🟠 exUser가 없으면 => 첫 번째 로그인 (회원가입 필요)
        const newUser = await User.create({  // 새로운 user DB 로우(객체) 생성
          // profile
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser); // 새로운 사용자 정보 전달
      }
    } catch (error) { // 실패하면
      console.error(error);
      done(error); // 서버 에러
    }
  }));
};
