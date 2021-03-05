//todo MySQL table <-> sequelize model
//* DB 관계 정의하기 - model들의 관계를 시퀄라이즈에 등록

'use strict';

// 자동 생성
const Sequelize = require('sequelize'); // 참조할 패키지
const env = process.env.NODE_ENV || 'development'; // 시스템 환경 = node 환경 or 개발 환경
const config = require('../config/config')[env]; // 참조할 경로 (config)
const db = {}; // db 객체 생성

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
//

//! 파일 참조
db.User = require('./user')(sequelize, Sequelize); // user model(table)
db.Post = require('./post')(sequelize, Sequelize); // post model(table)
db.Hashtag = require('./hashtag')(sequelize, Sequelize); // hashtag model(table)

//! model들 관계 등록
//! 최종 등록 모델 : user, post, hashtag, PostHashtag, Follow
//? user : post = 1 : N
db.User.hasMany(db.Post); // hasmany
db.Post.belongsTo(db.User); // belongsto // post model에 userID 컬럼 추가 (시퀄라이즈가 자동으로)

//? post : hashtag = N : M (다대다)
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // belongsToMany // PostHashtag 모델 생성 (postID, hashtagID 컬럼 추가)
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); // belongsToMany // PostHashtag 모델 생성 (postID, hashtagID 컬럼 추가)

//? (user model 내) user(팔로잉) : user(팔로워) = N : M (다대다)
// 팔로잉
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers', // 시퀄라이즈가 JSON 작업 시 사용하는 이름
  through: 'Follow', // Follow 모델 생성 (followingId, followerId 컬럼 추가)
});
// 팔로워
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings', // 시퀄라이즈가 JSON 작업 시 사용하는 이름
  through: 'Follow', // Follow 모델 생성 (followingId, followerId 컬럼 추가)
});

//? (user model 내) user(좋아요) : post(좋아요) = N : M (다대다)
// (게시글) 좋아요
db.User.belongsToMany(db.Post, {
  through: 'Like' // Like 모델 생성 (postID, userID 컬럼 추가)
});
// (게시글) 좋아요 취소
db.Post.belongsToMany(db.User, {
  as: 'Liker', // 시퀄라이즈가 JSON 작업 시 사용하는 이름
  through: 'Like' // Like 모델 생성 (postID, userID 컬럼 추가)
});

//! DB 모듈 생성
module.exports = db;
