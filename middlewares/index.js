const jwt = require("jsonwebtoken")

module.exports.tokenVerify = async (req) => {
  // token verification
  // Token Format: Bearer <token>
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : ""
  if (token === "") {
    req.isAuth = false
    return req
  }
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    req.isAuth = true
    req.decodedToken = decodedToken
    return req
  } catch (err) {
    req.isAuth = false
    return req
  }
}
