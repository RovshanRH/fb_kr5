import { db } from './server';

export const resolvers = {
    Query: {
        book: async (_parent: unknown, args: {id: number}, context: any) => {
            return context.db.findBookByID(args.id)
        },
        author: async (_parent: unknown, args: {id: number}, context: any) => {
            return context.db.findAuthorByID(args.id)
        }
        
    }
}