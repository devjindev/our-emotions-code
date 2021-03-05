//* passport(로그인) - serialize, deserialize

'use strict';

//! 파일 참조
const local = require('./localStrategy'); // 로컬 로그인 전략
const kakao = require('./kakaoStrategy'); // 카카오 로그인 전략
const { User } = require('../models'); // DB

//app.use(passport.session()); // 요청(로그인) 인증 // req.session 객체에 passport 정보를 저장함

//! 모듈 생성
module.exports = (passport) => {
  // routes/auth.js 로그인 라우터 passport.authenticated의 done() 콜백함수로 전달
  // done() : 로그인 시 사용
  //? 왜하냐? 세션에 사용자 정보를 모두 저장하면 용량이 커지므로 아이디만 저장하려고
  
  // req.session 객체에 어떤 데이터(passport 정보)를 저장할지 선택
  // 사용자 정보 객체를 세션에 ID로 저장
  passport.serializeUser((user, done) => { // 사용자 정보를 받음
    done(null, user.id); // null: 서버 에러 발생 시 사용 // 사용자 ID 전달
  });
  
  // 위에서 저장된 사용자 ID를 받아 DB에서 사용자 정보 조회
  // 세션에 저장한 ID를 통해 사용자 정보 객체를 불러옴
  passport.deserializeUser((id, done) => { // 위에서 사용자 ID를 받음
    User.findOne({ // user DB 중 받은 사용자 ID가 있는 사용자 정보 찾음
      where: { id },
      include: [ // 아래사항 포함
        {
          model: User, // user DB의
          attributes: ['id', 'nick'], // ID, 닉네임
          as: 'Followers', // 팔로워
        }, 
        {
          model: User, // user DB의
          attributes: ['id', 'nick'], // ID, 닉네임
          as: 'Followings', // 팔로잉
        }
      ],
    })
      .then(user => done(null, user)) // 성공하면 사용자 정보 전달
      .catch(err => done(err));  // 실패하면 에러 처리 (서버 에러)
  });

  //! 메소드 호출
  local(passport); // 로컬 로그인 전략
  kakao(passport); // 카카오 로그인 전략
};
