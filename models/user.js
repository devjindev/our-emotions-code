//* DB 모델 정의하기 - user(사용자 정보)

'use strict';

//! 모듈 생성
module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', 
  // 테이블 컬럼 설정
  {
    // 사용자 정보
    // 이메일(ID)
    email: {
      type: DataTypes.STRING(40), // 길이 0~40 문자열
      allowNull: true, // 빈칸 허용 O
      unique: true, // 해당 값이 고유해야 됨
    },
    // 닉네임
    nick: {
      type: DataTypes.STRING(15), // 길이 0~15 문자열
      allowNull: false, // 빈칸 허용 X
    },
    // 비밀번호
    password: {
      type: DataTypes.STRING(100), // 길이 0~100 문자열
      allowNull: true, // 빈칸 허용 O
    },
    // (SNS 로그인) 제공자
    provider: {
      type: DataTypes.STRING(10), // 길이 0~10 문자열
      allowNull: false, // 빈칸 허용 X
      defaultValue: 'local', // 기본값: 로컬 로그인
    },
    // (SNS 로그인) SNS ID
    snsId: {
      type: DataTypes.STRING(30), // 길이 0~30 문자열
      allowNull: true, // 빈칸 허용 O
    },
  },
  // 테이블 설정 
  {
    timestamps: true, // createdAt와 updatedAt 컬럼 추가 // 로우가 생성, 수정될 때 시간이 자동 입력됨
    paranoid: true, // deletedAt 컬럼 추가 // 로우가 삭제될 때 시간이 자동 입력됨
  })
);
