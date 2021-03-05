//* router - isAuthenticated() 로그인 인증 (접근 권한 제한) => page에 사용 (❗ 라우터 내 미들웨어)
// isAuthenticated() = 요청이 인증 됐으면 true, 인증 안 됐으면 false => 로그인 여부 파악

'use strict';

//? 로그인 한 상태 => isAuthenticated() === true
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { // isAuthenticated() === true면
    next(); // 다음으로 넘어감
  } else { // 그 외면
    res.status(403).send('로그인 필요'); // 상태 코드(403(금지됨)) 요청 전송
  }
};

//? 로그인 안 한 상태 => isAuthenticated() === false
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) { // isAuthenticated() === false면
    next(); // 다음으로 넘어감
  } else { // 그 외면
    res.redirect('/'); // Home으로 페이지 이동
  }
};
