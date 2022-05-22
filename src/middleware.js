export const localsMiddlware = (req, res, next) => {
  res.locals.siteName = "Installer";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user;
  next();
};

// export const protectedMiddleware=(req,res,next)=>{

// }
