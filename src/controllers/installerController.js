import Installer from "../models/Installer";
import User from "../models/User";

const ErrorStatusCode = 404;
const ErrorStatusCode1 = 400;
const CorrectStatusCode = 300;
const CorrectStatusCode1 = 304;

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
  return res.render("insteller/choose", { pageTitle: "Choose option" });
};

export const getInteriorCreate = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const exists = await User.findById(_id);
  if (!exists) {
    return res.status(ErrorStatusCode1).redirect("/");
  }
  return res.render("insteller/create", { pageTitle: "Create Interior" });
};
