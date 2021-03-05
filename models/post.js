//* DB 모델 정의하기 - post(게시글 내용, 이미지 경로)

'use strict';

//! 모듈 생성
module.exports = (sequelize, DataTypes) => (
  sequelize.define('post', 
  // 테이블 컬럼 설정
  {
    // 게시글 내용 (게시글 작성자 ID는 자동 생성)
    content: {
      type: DataTypes.STRING(140), // 길이 0~140 문자열
      allowNull: false, // 빈칸 허용 X
    },
    // 이미지 경로
    img: {
      type: DataTypes.STRING(200), // 길이 0~200 문자열
      allowNull: true, // 빈칸 허용 X
    },
  }, 
  // 테이블 설정
  {
    timestamps: true, // createdAt와 updatedAt 컬럼 추가 // 로우가 생성, 수정될 때 시간이 자동 입력됨
    paranoid: true, // deletedAt 컬럼 추가 // 로우가 삭제될 때 시간이 자동 입력됨
  })
);
