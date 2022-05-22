export const localsMiddlware = (req, res, next) => {
  res.locals.siteName = "Installer";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user;
  console.log(req.session);
  console.log(res.locals);
  next();
};

// export const protectedMiddleware=(req,res,next)=>{

// }
