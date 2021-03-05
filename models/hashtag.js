//* DB 모델 정의하기 - hashtag(해시태그) for 검색

'use strict';

//! 모듈 생성
module.exports = (sequelize, DataTypes) => (
  // 테이블 컬럼 설정
  sequelize.define('hashtag',
  {
    // 해시태그명
    title: {
      type: DataTypes.STRING(15), // 길이 0~15 문자열
      allowNull: false, // 빈칸 허용 X
      unique: true, // 해당 값이 고유해야 됨
    },
  }, 
  { // 테이블 설정
    timestamps: true, // createdAt와 updatedAt 컬럼 추가 // 로우가 생성, 수정될 때 시간이 자동 입력됨
    paranoid: true, // deletedAt 컬럼 추가 // 로우가 삭제될 때 시간이 자동 입력됨
  })
);
