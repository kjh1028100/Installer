// import Installer from "../models/Installer";

// export const getSeeInstaller = async (req, res) => {
//   const {
//     params: { id },
//   } = req;
//   const installer = await Installer.findById(id);
//   const pageTitle = "installer";
//   if (!installer) {
//     return res.render("installer/see", {
//       pageTitle,
//       errorMessage: "Not Found",
//     });
//   }
//   return res.render("installer/see", { pageTitle, installer });
// };

// export const getInstallerCreate = (req, res) => {
//   return res.render("installer/create", { pageTitle: "Create Installer" });
// };

// export const postInstallerCreate=(req,res)=>{
//     const
// }

// 에러메세지 나오게 하는거 고민중
