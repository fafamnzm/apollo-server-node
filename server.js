const { ApolloServer, PubSub } = require("apollo-server")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const isAuth = require("./middlewares/index")

const typeDefs = require("./typeDefs/index")
const resolvers = require("./resolvers/index")

dotenv.config()

//Create the DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
)

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res, connection }) => {
    if (req) req = await isAuth.tokenVerify(req)
    return { req, res, pubsub }
  },
})

server.listen().then(({ url }) => console.log(`Server runs on ${url}`))
