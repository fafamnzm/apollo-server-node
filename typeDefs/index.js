const { gql } = require("apollo-server")

const typeDefs = gql`
  type Query {
    getUser(email: String!): User
    getAllUser: [User!]
    login(userInfo: LoginInput): Login
  }
  type User {
    id: ID!
    email: String
  }
  type UpdateUser {
    email: String!
    username: String
  }
  type Login {
    token: String
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input UserInfo {
    password: String!
    email: String!
  }
  input GetUserInput {
    email: String!
  }
  input UpdateUserInfo {
    username: String
    password: String
    email: String!
  }
  type Mutation {
    createUser(userInfo: UserInfo): User
    updateUser(userInfo: UpdateUserInfo): UpdateUser
    deleteUser(email: String!): String
  }
  type Subscription {
    loginUser: User
  }
`

module.exports = typeDefs
