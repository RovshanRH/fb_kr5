import { gpl } from '@graphql-tools/schema'

export const typeDefs = gpl`
    type Book {
        id: ID!
        title: String!
        author: String!
        author_id: ID!
    },
    type Author {
        id: ID!
        name: String!
        birthYear: Int!
        country: String!
        books: [Book!]!
    }
`

