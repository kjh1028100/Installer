import User from "../models/User";
import bcrypt from "bcrypt";

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
    return res.redirect("/");
  } catch (error) {
    return res
      .status(ErrorStatusCode2)
      .render("404", { pageTitle: `${error._message}` });
  }
};
