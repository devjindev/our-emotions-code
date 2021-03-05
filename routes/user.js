//* router - 팔로우하기, 팔로우끊기

'use strict';

//! 모듈 참조 - 패키지(미들웨어)
const express = require('express');

const { isLoggedIn } = require('./middlewares'); // 로그인 한 상태
const { User } = require('../models'); // user DB

//! 라우터 객체 생성
const router = express.Router();

//? 팔로우하기
router.post('/:id/follow', isLoggedIn, async (req, res, next) => { // /:id/follow로 post(등록) 요청하면 // 로그인 한 상태
  try { // 성공하면
    const user = await User.findOne({ where: { id: req.user.id } }); // user DB 중 팔로우할 user id가 있는 user 찾음
    await user.addFollowing(parseInt(req.params.id, 10)); // 찾은 user에 팔로우 하기 // user : 팔로우 할 user 관계를 Follow에 넣음 // 팔로우할 user id 받아와서 정수(10진수)로 변환
    res.send('success'); // 요청 전송
  } catch (error) { // 실패하면
    console.error(error);
    next(error);
  }
});

//? 팔로우끊기
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => { // /:id/follow로 post(등록) 요청하면 // 로그인 한 상태
  try { // 성공하면
    const user = await User.findOne({ where: { id: req.user.id } }); // user DB 중 팔로우할 user id가 있는 user 찾음
    await user.removeFollowing(parseInt(req.params.id, 10));  // 찾은 user에 팔로우 끊기 //  user : 팔로우 할 user 관계를 Follow에 넣음 // 팔로우할 user id 받아와서 정수(10진수)로 변환
    res.send('success'); // 요청 전송
  } catch (error) { // 실패하면
    console.error(error);
    next(error);
  }
});

//? 닉네임 변경하기
router.post('/profile', async(req, res, next) => { // /profile로 post(등록) 요청하면
  try{ // 성공하면
    await User.update({nick: req.body.nick}, { // user DB 수정 // 닉네임을 입력받은 닉네임으로 수정
      where: {id: req.user.id} // 입력 받은 ID(email) 에서
    });
    res.redirect('/profile'); // /profile로 페이지 이동
  }catch(error){ // 실패하면
    console.error(error);
    next(error);
  }
});

//! router 모듈 생성
module.exports = router;
