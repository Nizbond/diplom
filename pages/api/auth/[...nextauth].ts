import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { JWT } from "next-auth/jwt"
import { db } from "@/lib/db"


const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                })

                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async session({ session, token }: { session: Session, token: JWT }) {
            if (session.user && token.id) {
                session.user.id = token.id
            }
            return session
        },
        async jwt({ token, user }: { token: JWT, user?: User }) {
            if (user) {
                token.id = user.id
            }
            return token
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)