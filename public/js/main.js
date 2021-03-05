//? header
window.addEventListener('load', () => { // 윈도우 로드되면
    setTimeout(() => { // 1초 뒤에 body에 'before-start' class 삭제
        document.body.classList.remove('before-start');
    }, 1000);
});

//? hambuger
const hambuger = document.querySelector('.hambuger');
const profile = document.querySelector('.leftSide');
if(hambuger){
    hambuger.addEventListener('click', () => { // hambuger click 하면
        profile.classList.toggle('hambuger-click'); // leftside에 'hambuger-click' class toggle
    });
}


//* /views/write.html (게시글 쓰기)

//? img
if (document.getElementById('img')) { // #img
    // id에 img 있는 것을 change(click...)하면
    document.getElementById('img').addEventListener('change', function (e) {
        var formData = new FormData(); // fromData 객체 생성 // form 태그(input) 데이터를 동적으로 제어
        console.log(this, this.files); // 이미지 파일들 출력
        formData.append('img', this.files[0]); // fromData.append(key, value) // 이미지 파일들 하나씩 저장
        var xhr = new XMLHttpRequest(); // AJAX(=> JSON 사용) 객체 생성
        xhr.onload = function () { // 요청
            if (xhr.status === 200) { // 상태 코드가 200이면 (성공)
            var url = JSON.parse(xhr.responseText).url; // 응답 메세지를 object -> JOSN // JSON url 객체 생성
            document.getElementById('img-url').value = url; // #img-url.value(값) = JSON url
            document.getElementById('img-preview').src = url; // #img-preview.src(경로) = JSON url
            document.getElementById('img-preview').style.display = 'inline'; // #img-preview.style.display = inline
            } else { // 그 외면 (실패)
                console.error(xhr.responseText); // error 출력
            }
        };
        xhr.open('POST', '/post/img'); // 요청 설정 // HTTP 요청 메서드(JSON 사용) : POST(등록), 주소 : /post/img
        xhr.send(formData); // 요청(from 태그 데이터) 전송
    });
}

//* /views/main.html (게시글 목록)

//? 팔로잉
document.querySelectorAll('.follow').forEach(function (tag) { // 팔로우하기 버튼들 배열로 생성해서 모두 선택 // 하나씩 가져와서 tag에 담음 (반복)
    tag.addEventListener('click', function () { // 팔로우하기 버튼 클릭 하면
        var isLoggedIn = document.querySelector('#my-id'); // user의 id
        if (isLoggedIn) { // user의 id가 있으면 (로그인 한 상태이면)
            if(tag.parentNode.querySelector('#twit-user-id')){
                var twitUserId = tag.parentNode.querySelector('#twit-user-id').value; // 팔로우하기 버튼이 있는 게시글 작성자의 id value
            }
            var userId = isLoggedIn.value; // user의 id value
            // if(twitUserId !== undefined){
                if (twitUserId !== userId) { // 게시글 작성자 ID != 사용자 ID
                    if (confirm('팔로잉 하시겠습니까?')) { // 확인창 출력
                        var xhr = new XMLHttpRequest(); // AJAX(=> JSON 사용) 객체 생성
                        xhr.onload = function () { // 요청
                            if (xhr.status === 200) { // 상태 코드가 200이면 (성공)
                                location.reload(); // 새로고침
                            } else { // 그 외면 (실패)
                                console.error(xhr.responseText); // error 출력
                            }
                        };
                        xhr.open('POST', '/user/' + twitUserId + '/follow'); // 요청 설정 // HTTP 요청 메서드(JSON 사용) : POST(등록), 주소 : /user/twittwitUserId/follow
                        xhr.send(); // 요청 전송
                    }
                }
            // }
        }
    });
});
//? 언팔로우
document.querySelectorAll('.unfollow').forEach(function (tag) { // 팔로우하기 버튼들 배열로 생성해서 모두 선택 // 하나씩 가져와서 tag에 담음 (반복)
    tag.addEventListener('click', function () { // 팔로우하기 버튼 클릭 하면
        var isLoggedIn = document.querySelector('#my-id'); // user의 id
        if (isLoggedIn) { // user의 id가 있으면 (로그인 한 상태이면)
            if(tag.parentNode.querySelector('#twit-user-id')){
                var twitUserId = tag.parentNode.querySelector('#twit-user-id').value; // 팔로우하기 버튼이 있는 게시글 작성자의 id value
            }
            var userId = isLoggedIn.value; // user의 id value
            // if(twitUserId !== undefined){
                if (twitUserId !== userId) { // 게시글 작성자 ID != 사용자 ID
                    if (confirm('팔로잉을 취소하시겠습니까?')) { // 확인창 출력
                        var xhr = new XMLHttpRequest(); // AJAX(=> JSON 사용) 객체 생성
                        xhr.onload = function () { // 요청
                            if (xhr.status === 200) { // 상태 코드가 200이면 (성공)
                                location.reload(); // 새로고침
                            } else { // 그 외면 (실패)
                                console.error(xhr.responseText); // error 출력
                            }
                        };
                        xhr.open('POST', '/user/' + twitUserId + '/unfollow'); // 요청 설정 // HTTP 요청 메서드(JSON 사용) : POST(등록), 주소 : /user/twittwitUserId/follow
                        xhr.send(); // 요청 전송
                    }
                }
            // }
        }
    });
});

//? 좋아요
document.querySelectorAll('.like').forEach((tag) => { // 좋아요 버튼들 배열로 생성해서 모두 선택 // 하나씩 가져와서 tag에 담음 (반복)
    tag.addEventListener('click', () => { // 좋아요 버튼 클릭하면
        tag.classList.toggle('like-click'); // 'like-click' class toggle
    });
});

// 좋아요
// document.querySelectorAll('.like').forEach(function (tag) { // 좋아요 버튼들 배열로 생성해서 모두 선택 // 하나씩 가져와서 tag에 담음 (반복)
//     tag.addEventListener('click', function () { // 좋아요 버튼 클릭 하면
//         var isLoggedIn = document.querySelector('#my-id'); // user의 id
//         var twitId = tag.parentNode.querySelector('#twit-id').value; // 좋아요 버튼이 있는 게시글의 id value
//         if (isLoggedIn) { // user의 id가 있으면 (로그인 한 상태이면)
//             var xhr = new XMLHttpRequest(); // AJAX(=> JSON 사용) 객체 생성
//             xhr.onload = function () { // 요청
//             if (xhr.status === 200) { // 상태 코드가 200이면 (성공)
//                 location.reload(); // 새로고침
//             } else { // 그 외면 (실패)
//                 console.error(xhr.responseText); // error 출력
//             }
//             };
//             xhr.open('POST', '/post/' + twitId + '/like'); // 요청 설정 // HTTP 요청 메서드(JSON 사용) : POST(등록), 주소 : /user/twitID/like
//             xhr.send(); // 요청 전송
//         }
//     });
// });
// 좋아요 취소
// document.querySelectorAll('.unlike').forEach(function (tag) { // 좋아요 취소 버튼들 배열로 생성해서 모두 선택 // 하나씩 가져와서 tag에 담음 (반복)
//     tag.addEventListener('click', function () { // 좋아요 취소 버튼 클릭 하면
//         var isLoggedIn = document.querySelector('#my-id'); // user의 id
//         var twitId = tag.parentNode.querySelector('#twit-id').value; // 좋아요 취소 버튼이 있는 게시글의 id value
//         if (isLoggedIn) { // user의 id가 있으면 (로그인 한 상태이면)
//             var xhr = new XMLHttpRequest(); // AJAX(=> JSON 사용) 객체 생성
//             xhr.onload = function () { // 요청
//             if (xhr.status === 200) { // 상태 코드가 200이면 (성공)
//                 location.reload(); // 새로고침
//             } else { // 그 외면 (실패)
//                 console.error(xhr.responseText); // error 출력
//             }
//             };
//             xhr.open('DELETE', '/post/' + twitId + '/like'); // 요청 설정 // HTTP 요청 메서드(JSON 사용) : DELETE(삭제), 주소 : /user/twitID/like
//             xhr.send(); // 요청 전송
//         }
//     });
// });

//? 게시글 삭제
document.querySelectorAll('.delete').forEach(function (tag) { // 삭제하기 버튼들 배열로 생성해서 모두 선택 // 하나씩 가져와서 tag에 담음 (반복)
    tag.addEventListener('click', function () { // 삭제하기 버튼 클릭 하면
        var isLoggedIn = document.querySelector('#my-id'); // user의 id
        if(tag.parentNode.querySelector('#twit-id')){
            var twitId = tag.parentNode.querySelector('#twit-id').value; // 삭제하기 버튼이 있는 게시글의 id value
        }
        if (isLoggedIn) { // user의 id가 있으면 (로그인 한 상태이면)
            if(tag.parentNode.querySelector('#twit-user-id')){
                var twitUserId = tag.parentNode.querySelector('#twit-user-id').value; // 삭제하기 버튼이 있는 게시글 작성자의 id value
            }
            var userId = isLoggedIn.value; // user의 id value
            if (twitUserId === userId) { // 게시글 작성자 ID == 사용자 ID (내 게시글에서만 삭제하기 버튼이 보여야 됨)
                if (confirm('게시글 삭제하시겠습니까?')) { // 확인창 출력
                    var xhr = new XMLHttpRequest(); // AJAX(=> JSON 사용) 객체 생성
                    xhr.onload = function () { // 요청
                        if (xhr.status === 200) { // 상태 코드가 200이면 (성공)
                            location.reload(); // 새로고침
                        } else { // 그 외면 (실패)
                            console.error(xhr.responseText); // error 출력
                        }
                    };
                    xhr.open('DELETE', '/post/' + twitId); // 요청 설정 // HTTP 요청 메서드(JSON 사용) : DELETE(삭제), 주소 : /post/twitID
                    xhr.send(); // 요청 전송
                }
            }
        }
    });
});
