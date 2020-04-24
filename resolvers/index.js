const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const LOGIN_USER = "LOGIN_USER"

const resolvers = {
  Subscription: {
    loginUser: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(LOGIN_USER),
    },
  },
  Query: {
    getUser: async (_, { email }) => {
      try {
        const user = await User.findOne({ email })
        if (!user) throw new Error("no User found!")
        return user
      } catch (err) {
        throw err
      }
    },
    getAllUser: async (_, __, ctx) => {
      try {
        if (!ctx.req.isAuth) throw new Error("Access Denied man!!")
        const users = await User.find()
        return users
      } catch (err) {
        throw err
      }
    },
    login: async (_, { userInfo: { email, password } }, ctx) => {
      try {
        const user = await User.findOne({ email })
        if (!user) throw new Error("User does not exist!")
        const passwordChecker = await bcrypt.compare(password, user.password)
        if (!passwordChecker) throw new Error("Inocrrect Password!")
        const token = jwt.sign(
          { id: "user._id", email },
          process.env.TOKEN_SECRET
        )
        ctx.pubsub.publish(LOGIN_USER, {
          loginUser: user,
        })
        return { token }
      } catch (err) {
        throw err
      }
    },
  },
  Mutation: {
    createUser: async (_, { userInfo: { username, email, password } }) => {
      try {
        const checkUser = await User.findOne({ email })
        if (checkUser) throw new Error("User already exist")
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
          email,
          password: hashedPassword,
        })
        const savedUser = await user.save()
        return savedUser
      } catch (err) {
        throw err
      }
    },
    updateUser: async (_, { userInfo: { email, password } }, ctx) => {
      try {
        if (!ctx.req.isAuth) throw new Error("Unauthorized Access!")
        const user = await User.findOne({ email })
        if (!user) throw new Error("User not Found!")
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10)
          user.password = hashedPassword
        }
        const savedUser = await user.save()
        console.log(savedUser)
        return user
      } catch (err) {
        throw err
      }
    },
    deleteUser: async (_, { email }, ctx) => {
      try {
        if (!ctx.req.isAuth) throw new Error("Access Denied!! Nice Try! ;)")
        const user = await User.findOneAndDelete({ email })
        if (!user) throw new Error("User not found!")
        return user.email
      } catch (err) {
        throw err
      }
    },
  },
}

module.exports = resolvers
