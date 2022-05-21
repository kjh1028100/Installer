export const localsMiddlware = (req, res, next) => {
  res.locals.siteName = "Installer";
  next();
};
