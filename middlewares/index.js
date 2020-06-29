const jwt = require("jsonwebtoken")

module.exports.tokenVerify = async (req) => {
  // token verification
  // Token Format: Bearer <token>
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : ""
    if (token === "") {
      req.isAuth = false
      return next()
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!decodedToken) {
      req.isAuth = false
      return next()
    }
    req.isAuth = true
    req.decodedToken = decodedToken
    return next()
  } catch (err) {
    // throw err
    console.log(err)
    req.isAuth = false
    return next()
  }
}
