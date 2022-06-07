const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const validator = require("validator");

const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  const authorization = req.headers.authorization;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next(appError(httpStatus.UNAUTHORIZED, "尚未登入！", next));
  }
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        if ("JsonWebTokenError" === err.name) {
          return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤！", next));
        }
        //reject(err); //  "message": "系統錯誤，請恰系統管理員"
        return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤！", next));
      } else {
        resolve(payload);
      }
    });
  });
  // 取得 User
  const currentUser = await usersModel.findById(decoded.id);
  req.user = currentUser;
  next();
});
const isPassValidate = handleErrorAsync(async (req, res, next) => {
  // 密碼是否有大於 8 碼
  validator.isLength(password, { min: 8 });
  // 是否為 Email 格式
  validator.isEmail(email);
  next();
});

module.exports = {
  isAuth,
  isPassValidate,
};
