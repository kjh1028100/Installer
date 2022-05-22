import User from "../models/User";
import bcrypt from "bcrypt";

const ErrorStatusCode = 400;
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
};

export const getLogin = (req, res) => {
  return res.render("user/login", { pageTitle: "login" });
};

export const postLogin = (req, res) => {
  return res.redirect("/");
};
