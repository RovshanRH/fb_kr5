export const resolvers = {
  Query: {
    books: async (_parent: unknown, _args: unknown, context: any) => {
      return context.db.findBooks();
    },
    authors: async (_parent: unknown, _args: unknown, context: any) => {
      return context.db.findAuthors();
    },
    book: async (_parent: unknown, args: { id: number }, context: any) => {
      return context.db.findBookByID(args.id);
    },
    author: async (_parent: unknown, args: { id: number }, context: any) => {
      return context.db.findAuthorByID(args.id);
    },
  },
  Book: {
    author: async (
      parent: { author_id: number },
      _args: unknown,
      context: any,
    ) => {
      return context.db.findAuthorByID(parent.author_id);
    },
  },
  Author: {
    books: async (parent: { id: number }, _args: unknown, context: any) => {
      return context.db.findBooksByAuthorID(parent.id);
    },
  },
};
