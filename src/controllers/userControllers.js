import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

const ErrorStatusCode = 400;
const ErrorStatusCode2 = 404;
const ConfirmStatusCode = 201;

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const getJoin = (req, res) => {
  return res.render("user/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const {
    body: { id, password, password1, email, username },
  } = req;
  const pageTitle = "Join";
  const joinPath = "user/join";
  //   password 확인
  if (password !== password1) {
    return res
      .status(ErrorStatusCode)
      .render(joinPath, { pageTitle, errorMessage: "Disaccord your password" });
  }
  // 중복확인
  try {
    const exists = await User.exists({ $or: [{ id }, { email }] });
    if (exists) {
      return res.status(ErrorStatusCode).render(joinPath, {
        pageTitle,
        errorMessage: "id or email already account",
      });
    }
    //   user 생성
    await User.create({
      id,
      password,
      email,
      username,
    });
    return res.status(ConfirmStatusCode).redirect("/login");
  } catch (error) {
    return res
      .status(ErrorStatusCode2)
      .render("404", { pageTitle: `${error._message}` });
  }
};

export const getLogin = (req, res) => {
  return res.render("user/login", { pageTitle: "login" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "login";
  const loginPath = "user/login";
  const {
    body: { id, password },
  } = req;
  try {
    //db에 user가 있는지 확인
    const user = await User.findOne({ id });
    if (!user) {
      return res
        .status(ErrorStatusCode)
        .render(loginPath, { pageTitle, errorMessage: "Confirm id" });
    }
    //암호화된 비밀번호 확인
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(ErrorStatusCode)
        .render(loginPath, { pageTitle, errorMessage: "Confirm password" });
    }
    // session에 추가
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } catch (error) {
    return res
      .status(ErrorStatusCode2)
      .render("404", { pageTitle: `${error._message}` });
  }
};

export const GithubStartLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_PUBLIC,
    scope: "read:user user:email",
    allow_signup: false,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const GithubFinishLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_PUBLIC,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const json = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in json) {
    const { access_token } = json;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.status(ErrorStatusCode).render("user/login", {
        pageTitle: "Login",
        errorMessage: "email not found",
      });
    }
    let user = await User.findOne({
      $or: [{ email: emailObj.email }, { id: userData.login }],
    });
    if (!user) {
      user = await User.create({
        id: userData.login,
        email: emailObj.email,
        username: userData.name,
        password: "",
        socialOnly: true,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    // 메세지 추가
    return res.status(ErrorStatusCode).render("user/login", {
      pageTitle: "Login",
      errorMessage: "Fail Access",
    });
  }
};

export const KakaoStartLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_KEY,
    redirect_uri: process.env.REDIRECT_URL,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const KakaoFinishLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_KEY,
    redirect_uri: process.env.REDIRECT_URL,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const json = await (
    await fetch(finalUrl, {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();
  if ("access_token" in json) {
    const { access_token } = json;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: ` Bearer ${access_token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
    ).json();
    const {
      kakao_account: {
        profile: { nickname, thumbnail_image_url },
        email,
      },
    } = userData;
    let user = await User.findOne({ $or: [{ username: nickname }, { email }] });
    if (!user) {
      user = await User.create({
        // kakao는 아이디 형식이 이메일(require빼고 삽입가능)
        id: email,
        password: "",
        socialOnly: true,
        username: nickname,
        email,
        avatarUrl: thumbnail_image_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    // errorMessage
    return res.status(ErrorStatusCode).render("user/login", {
      pageTitle: "Login",
      errorMessage: "Fail Access Kakao",
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};