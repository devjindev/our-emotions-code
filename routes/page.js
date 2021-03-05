//* router - 로그인 page layout

'use strict';

//! 모듈 참조 - 패키지(미들웨어)
const express = require('express');

//! 모듈 참조 - 파일
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 로그인 한, 안 한 상태
const { Post, User } = require('../models'); // post, user DB

//! 라우터 객체 생성
const router = express.Router();

router.use((req, res, next) => {
  //? 팔로잉
  // 사용자 팔로잉들(배열)을 사용자 팔로잉들 ID(새로운 배열)로 만듬
  res.locals.followingsIdList = req.user && req.user.Followings.map(f => f.id);
  next();
});

//? join (회원가입 페이지)
router.get('/join', isNotLoggedIn, (req, res) => { // /join로 get 요청하면 // 로그인 안 한 상태
  res.render('join', { // 응답(렌더링)
    title: 'JOIN - 우리의 감성',
    user: req.user,
    joinError: req.flash('joinError'), // 회원가입 error
  });
});

//? profile (팔로잉, 팔로워 목록 페이지)
router.get('/profile', isLoggedIn, (req, res) => { // /profile로 get 요청하면 // 로그인 한 상태
  res.render('profile', {  // 응답(렌더링)
    title: 'PROFILE - 우리의 감성', 
    user: req.user
  });
});

//? write (글쓰기 페이지)
router.get('/write', isLoggedIn, (req, res) => { // /profile로 get 요청하면 // 로그인 한 상태
  res.render('write', {  // 응답(렌더링)
    title: 'WRITE - 우리의 감성', 
    user: req.user 
  });
});

//? home (메인 페이지 + 게시글 목록)
router.get('/', (req, res, next) => { // /home로 get 요청하면
  Post.findAll({ // post DB에서 게시글(로우) 조회
    include: [ // 아래 포함해서 조회
      { // 게시글 작성자
        model: User, // user DB의
        attributes: ['id', 'nick'], // user ID(이메일), 닉네임
      },
      { // 좋아요 한 게시글 작성자
        model: User, // user DB의
        attributes: ['id', 'nick'], // user ID(이메일), 닉네임
        as: 'Liker'
      }
    ],
    order: [['createdAt', 'DESC']],  // 내림차순(최신순)으로 정렬 (게시글 순서)
  })
    .then((posts) => { // 성공하면
      res.render('main', { // 응답(렌더링)
        title: '우리의 감성',
        twits: posts, // twits에 posts 넣음
        user: req.user,
        loginError: req.flash('loginError'), // 로그인 error
      });
    })
    .catch((error) => { // 실패하면
      console.error(error);
      next(error);
    });
});

//! router 모듈 생성
module.exports = router;
