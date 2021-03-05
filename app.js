'use strict';

//! 모듈 참조 - 패키지(미들웨어)
const favicon = require('serve-favicon'); // favicon
const express = require('express');
const cookieParser = require('cookie-parser'); // 요청에 동봉된 쿠키 해석
const morgan = require('morgan'); // 요청에 대한 정보를 콘솔에 기록
const path = require('path'); // 파일 및 폴더 경로 쉽게 조작
const session = require('express-session'); // 세션 관리
const nunjucks = require('nunjucks');
const flash = require('connect-flash'); // 일회성 메세지 출력
const passport = require('passport'); // 요청(로그인) 인증
require('dotenv').config(); // 쿠키 비밀키

//! 모듈 참조 - 파일
const pageRouter = require('./routes/page'); //? (로그인) page 라우터
const authRouter = require('./routes/auth'); //? (로그인) 인증 라우터
const postRouter = require('./routes/post'); //? 게시글 업로드 라우터
const userRouter = require('./routes/user'); //? 팔로우하기 라우터
const { sequelize } = require('./models'); //? DB
const passportConfig = require('./passport'); //? 로그인

//! 메소드 호출
const app = express();
sequelize.sync(); //? sequelize를 통해 model을 mySQL(DB=서버)에 연결 // 서버 실행 시 알아서 mySQL에 연결
passportConfig(passport); //? 요청(로그인) 인증 // 경로 <-> 패키지

//! app 설정
// app.set('views', path.join(__dirname, 'views')); // views 폴더 지정
// app.set('view engine', 'pug'); // view engine을 pug로 지정
app.set('view engine', 'html'); // view engine을 html으로 지정
nunjucks.configure('views', { // views 폴더 지정
  express: app,
  watch: true,
});
app.set('port', process.env.PORT || 8001); // port // 포트 번호 : 포트 비밀키 or 8001

//! favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

//! 이미지 연결
app.use('/logoLoading', express.static(path.join(__dirname, 'public/images', 'logo_01.png'))); // loading logo
app.use('/snsKakao', express.static(path.join(__dirname, 'public/images', 'sns_01.png'))); // loginArea kakao
app.use('/logoHeader', express.static(path.join(__dirname, 'public/images', 'logo_02.png'))); // header logo

//! app에 패키지(미들웨어) 연결(사용)
app.use(morgan('dev')); // morgan // 요청에 대한 정보를 콘솔에 기록
// static // 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public'))); // public 폴더 지정
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // uploads 폴더 내 img들이 /img 주소로 제공
// body-parser // 요청 본문 해석
app.use(express.json()); // json 형식의 데이터 전달 방식 
app.use(express.urlencoded({ extended: false })); // 주소 형식의 데이터 전달 방식 // querystring 모듈 사용
app.use(cookieParser(process.env.COOKIE_SECRET)); // 요청에 동봉된 쿠키 해석 // 해석된 쿠키들 req.cookies에 들어감 // 쿠키 비밀키 (복호화 할 때 사용하는 키)
app.use(session({ // 세션 관리
  resave: false, // 세션에 수정사항 없어도 다시 저장할거냐? no
  saveUninitialized: false, // 세션에 저장할 사항 없어도 저장할거냐? no
  secret: process.env.COOKIE_SECRET, // 쿠키 비밀키
  cookie: { // 쿠키 설정
    httpOnly: true, // 클라이언트에서 쿠키 못보게? yes
    secure: false, // https가 아닌 환경에서 사용할 수 없게? no
  },
}));
app.use(flash()); // 일회성 메세지 출력 // req.flash(key, value) 생성
app.use(passport.initialize()); // 요청(로그인) 인증 // req(요청) 객체에 passport 설정을 심음
app.use(passport.session()); // 요청(로그인) 인증 // req.session 객체에 passport 정보를 저장함 // deserializeUser() 호출

app.use('/', pageRouter); //? 라우터 연결 // 주소가 /로 시작하면, routes/page 호출
app.use('/auth', authRouter); //? 라우터 연결 // 주소가 /auth로 시작하면, routes/auth 호출
app.use('/post', postRouter); //? 라우터 연결 // 주소가 /post로 시작하면, routes/post 호출
app.use('/user', userRouter); //? 라우터 연결 // 주소가 /user로 시작하면, routes/user 호출

//? 라우터가 요청 처리 실패하면 (요청된 주소를 찾을 수 없으면)
app.use((req, res, next) => { // 404 처리 미들웨어
  const err = new Error('Not Found'); // 에러 객체 생성
  err.status = 404; // 에러 상태
  next(err); // 404(찾을 수 없음) 에러 상태코드를 에러 핸들러로 넘김
});

app.use((err, req, res, next) => { // 에러 핸들러
  res.locals.message = err.message; // 응답 메세지 = 에러 메세지
  // app.get(key) => app.set(key)으로 설정한 것을 가져옴
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // 시스템 환경 === 개발 환경? 맞으면 error 아니면 ok
  res.status(err.status || 500); // 응답 상태 = 에러 상태 or 500(내부 서버 오류) 
  res.render('error'); // 에러 응답
});

//! app에 port 연결
app.listen(app.get('port'), () => { // app.set('port') 받아옴
  console.log(app.get('port'), '번 포트에서 대기중');
});
