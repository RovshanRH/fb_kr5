export const typeDefs = `#graphql
    type Book {
        id: ID!
        title: String!
        author: Author!
        author_id: ID!
    },
    type Author {
        id: ID!
        name: String!
        birthYear: Int!
        country: String!
        books: [Book!]!
    }
    type Query {
        books: [Book!]!
        authors: [Author!]!
        author(id: ID!): Author
        book(id: ID!): Book
    }
    type Mutation {
        createAuthor(name: String!, birthYear: Int!, country: String!, books: [ID!]!): Author!
        createBook(title: String!, author_id: ID!): Book!
    }
`;
