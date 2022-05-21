# Installer Site

<!-- 인테리어 -->

schema
title
createAt
그림그리고 완성버튼 -> [객체:{그림이름:String(url),위도,경도,색상}]
도면도 여부
도면도: 그림:String (url)
meta:
view
like

<!-- global -->

/
/join
/login

<!-- user -->

method:get /user/:id -> profile see
method:post /user/:id/edit -> profile edit
method:delete /user/:id/delete ->delete profile
/user/github/start ->social login(github)
/user/github/finish ->social login(github)
/user/kakao/finish ->social login(kakao)
/user/kakao/finish ->social login(kakao)

<!-- 도면X -->

/interior/:id -> see
/interior/:id/delete -> delete
/interior/:id/edit ->edit
method:get /interior/create -> create interior

<!-- 도면존재 -->

/interior/floor/:id ->see
/interior/floor/:id/delete -> delete
/interior/floor/:id/edit ->edit
/interior/floor/create -> create

<!-- ranking -->

/rank/
/rank/:id -> see

<!-- notice -->

/notice/upload
/notice/:id
/notice/:id/edit
/notice/:id/delete
/notice/:id/report ->신고기능
