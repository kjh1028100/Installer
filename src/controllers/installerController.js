import Installer from "../models/Installer";
import User from "../models/User";
import Comment from "../models/Comment";

const ErrorStatusCode = 404;
const ErrorStatusCode1 = 400;
const CorrectStatusCode = 201;
const CorrectStatusCode1 = 301;

export const getInterior = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const exists = await User.findById(_id);
  if (!exists) {
    return res.status(ErrorStatusCode1).redirect("/");
  }
  return res.render("installer/choose", { pageTitle: "Choose option" });
};

export const getSeeInstaller = async (req, res) => {
  const {
    params: { id },
  } = req;
  const installer = await Installer.findById(id)
    .populate("owner")
    .populate("comment");
  if (!installer) {
    return res.status(ErrorStatusCode).redirect("/");
  }
  return res
    .status(CorrectStatusCode)
    .render("installer/see", { pageTitle: `${installer.title}`, installer });
};

export const getInteriorCreate = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const user = await User.findById(_id).populate("Installer");
  if (!user) {
    return res.status(ErrorStatusCode1).redirect("/");
  }
  if (id) {
    const findInstaller = user.Installer.find(
      (el) => String(el._id) === String(id)
    );
    // 중복확인
    // 새로생성하고 싶을떄는 새로 생성(에러)
    if (!findInstaller) {
      return res.render("installer/create", { pageTitle: "Create Interior" });
    }
    const exists = await Installer.exists({ _id: findInstaller._id });
    if (exists) {
      return res.render("installer/create", {
        pageTitle: `${findInstaller.title} Interior`,
        findInstaller,
      });
    }
  }
  return res.render("installer/create", { pageTitle: "Create Interior" });
};

export const postCreateInterior = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { value, imageUrl },
    params: { id },
  } = req;
  const user = await User.findById(_id).populate("Installer");
  const existsTitle = await Installer.exists({ title: value });
  if (!user || existsTitle) {
    return res.sendStatus(ErrorStatusCode);
  }
  // 중복확인
  const findInstaller = user.Installer.find(
    (el) => String(el._id) === String(id)
  );
  if (findInstaller) {
    // 이미 중복되어 있을떄 수정
    await Installer.findByIdAndUpdate(findInstaller._id, {
      owner: _id,
      title: value,
      resulturl: imageUrl,
    });
    return res.sendStatus(CorrectStatusCode);
  }
  const installer = await Installer.create({
    owner: _id,
    title: value,
    resulturl: imageUrl,
  });
  user.Installer.push(installer);
  await user.save();
  return res.sendStatus(CorrectStatusCode);
};

export const deleteInstaller = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id).populate("Installer");
  const findInstaller = user.Installer.find(
    (el) => String(el.owner._id) === String(_id)
  );
  if (!user) {
    return res
      .status(ErrorStatusCode)
      .redirect("/installer/:id([a-z\\d+]{24})");
  }
  const index = user.Installer.indexOf(findInstaller);
  user.Installer.splice(index, 1);
  await Installer.findByIdAndDelete(findInstaller._id);
  return res.redirect("/");
};

export const patchRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  const installer = await Installer.findById(id);
  if (!installer) {
    return res.sendStatus(ErrorStatusCode);
  }
  installer.meta.view += 1;
  await installer.save();
  return res.sendStatus(CorrectStatusCode);
};

export const postMakeComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
    body: { text },
  } = req;
  const interior = await Installer.findById(id);
  if (!interior || !user) {
    return res.sendStatus(ErrorStatusCode);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    installer: interior._id,
  });
  interior.comment.push(comment);
  await interior.save();
  return res
    .status(CorrectStatusCode)
    .json({ newCommentId: comment._id, text });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const comment = await Comment.findById(id).populate("installer");
  if (!comment && String(comment.owner._id) !== String(user._id)) {
    return res.sendStatus(ErrorStatusCode);
  }
  const interior = await Installer.findById(comment.installer._id);
  const index = interior.comment.indexOf(comment._id);
  interior.comment.splice(index, 1);
  await interior.save();
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(CorrectStatusCode);
};

export const pathEditComment = async (req, res) => {
  const {
    session: { user },
    params: { id },
    body: { text },
  } = req;
  const comment = await Comment.findById(id).populate("owner");
  if (!comment || String(comment.owner._id) !== String(user._id)) {
    return res.sendStatus(ErrorStatusCode);
  }
  await Comment.findByIdAndUpdate(id, {
    text,
    owner: user._id,
    installer: comment.installer._id,
  });
  return res
    .status(CorrectStatusCode)
    .json({ editCommentId: comment._id, text });
};

export const pathRegisterLike = async (req, res) => {
  const {
    session: { user },
    params: { id },
    body: { userId, clicked },
  } = req;
  const installer = await Installer.findById(id);
  if (String(user._id) !== String(userId) || !installer) {
    return res.sendStatus(ErrorStatusCode);
  }
  if (clicked) {
    installer.meta.like -= 1;
    await installer.save();
    return res.sendStatus(ErrorStatusCode);
  }
  installer.meta.like += 1;
  await installer.save();
  return res.sendStatus(CorrectStatusCode);
};
