//* router - post(게시글 업로드)
// single(하나의 이미지 있는 게시글 업로드), none(이미지 없는 게시글 업로드)

'use strict';

//! 모듈 참조 - 패키지(미들웨어)
const express = require('express');
const multer = require('multer'); // 파일 업로드
const path = require('path'); // 파일 및 폴더 경로 쉽게 조작
const fs = require('fs'); // 파일 및 폴더 CRUD

//! 모듈 참조 - 파일
const { Post, Hashtag, User } = require('../models'); // post, hashtag, user DB
const { isLoggedIn } = require('./middlewares'); // 로그인 한 상태

//! 라우터 객체 생성
const router = express.Router();

// 폴더 Read(읽기)
fs.readdir('uploads', (error) => { // uploads 폴더 읽음
  if (error) { // 에러 있으면 (uploads(이미지 업로드 할) 폴더 없으면)
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 Create(생성)
  }
});

//? 이미지 있는 게시글 업로드 미들웨어 객체
// cb(): 파일 업로드 시 사용
const upload = multer({
  // 이미지 업로드 옵션 설정
  storage: multer.diskStorage({ // 파일 저장 방식: 서버 디스크
    destination(req, file, cb) { // 파일 저장 경로(폴더): uploads/
      cb(null, 'uploads/'); // null: 서버 에러 발생 시 사용
    },
    filename(req, file, cb) { // 파일명: 기존 파일명 + 업로드 날짜 + 기존 확장자
      const ext = path.extname(file.originalname); // 기존 확장자
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 이미지 파일 용량 허용치 (10MB)
});

//? 이미지 있는 게시글 업로드 라우터
// single: 하나의 이미지 있는 게시글 업로드할 때 사용 (이미지 => req.file, 나머지 정보 => req.body)
// single(req.body 속성)
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // /img로 post(등록) 요청하면 // 로그인 한 상태
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` }); // url 요청 전송
});

//? 이미지 없는 게시글 업로드 미들웨어 객체
const upload2 = multer();

//? 이미지 없는 게시글 업로드 라우터
// none: 이미지 없는 게시글 업로드할 때 사용 (모든 정보 => req.body)
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => { // /로 post(등록) 요청하면 // 로그인 한 상태
  try { // 성공하면
    const post = await Post.create({ // 새로운 post DB 로우 생성 (저장)
      content: req.body.content, // 게시글 내용
      img: req.body.url, // 게시글 이미지(이미지 데이터 온게 아니라 주소 온거)
      userId: req.user.id, // 게시글 작성자 ID
    });
    const hashtags = req.body.content.match(/#[^\s]*/g); // 게시글 내용 내 해시태그 추출
    if (hashtags) { // 해시태그 있으면
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({ // hashtag DB에 저장 // 배열 모두 한 번에 저장 // 새로운 배열 map
        where: { title: tag.slice(1).toLowerCase() }, // title: tag명에서 맨 첫번째꺼(#) 삭제, 모두 소문자로 해시태그 재설정 (에서)
      })));
      await post.addHashtags(result.map(r => r[0])); // post : hashtag 관계를 PostHashtag에 넣음
    }
    res.redirect('/'); // /home으로 페이지 이동
  } catch (error) { // 실패하면
    console.error(error);
    next(error);
  }
});

//? 게시글 삭제 라우터
router.delete('/:id', async(req, res, next) => { // /:id로 delete 요청하면
  try{ // 성공하면
    await Post.destroy({where: {id: req.params.id, userId: req.user.id}}); // post DB 중 삭제할 게시글 id와 삭제할 게시글 user id 찾아서 삭제
    res.send('OK'); // 요청 전송
  }catch(error){ // 실패하면
    console.error(error);
    return next(error);
  }
});

//? 해시태그 검색 라우터
router.get('/hashtag', async (req, res, next) => { // /hashtag로 get 요청하면
  const query = req.query.hashtag; // 입력된 해시태그명(문자열) 받아옴
  if (!query) { // 해시태그명 없으면 (빈 문자열이면)
    return res.redirect('/'); // /home으로 페이지 이동(돌려보냄)
  }
  try { // 성공하면
    const hashtag = await Hashtag.findOne({ where: { title: query } }); // hashtag DB 중 입력받은 해시태그명 있는거 찾음
    let posts = []; // 게시글들
    if (hashtag) { // 해시태그명 있으면 (등록된 해시태그명이면)
      posts = await hashtag.getPosts({ include: [{ model: User }] }); // 해시태그명 포함한 게시글들 가져옴 (user DB 포함)
    }
    return res.render('main', { // 응답 (렌더링)
      title: `${query} | My Used Market 🏠`,
      user: req.user,
      twits: posts, // twits에 해시태그명 포함한 게시글들 넣음
    });
  } catch (error) { // 실패하면
    console.error(error);
    return next(error);
  }
});

//? 좋아요 라우터
// 좋아요
router.post('/:id/like', async(req, res, next) => { // /:id/like로 post(등록) 요청하면
  try{ // 성공하면
    const post = await Post.findOne({where: {id: req.params.id}}); // post DB 중 좋아요한 post id가 있는 post 찾음
    await post.addLiker(req.user.id); // 찾은 post에 좋아요 누른 user id 추가
    res.send('OK'); // 요청 전송
  }catch (error) { // 실패하면
    console.error(error);
    return next(error);
  }
});
// 좋아요 취소
//! router 모듈 생성
router.delete('/:id/like', async(req, res, next) => { // /:id/like로 delete(삭제) 요청하면
  try{ // 성공하면
    const post = await Post.findOne({where: {id: req.params.id}}); // post DB 중 좋아요 취소할 post id가 있는 post 찾음
    await post.removeLiker(req.params.id); // 찾은 post에 좋아요 삭제
    res.send('OK'); // 요청 전송
  }catch (error) { // 실패하면
    console.error(error);
    return next(error);
  }
});
module.exports = router;
