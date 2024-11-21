import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import dbConnect from "@/lib/mongodb"

// Define custom session type
interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string;
  }
}

// Define custom token type
interface CustomToken extends JWT {
  id: string;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/signin',
    signUp: '/signup',
  },
  callbacks: {
    async jwt({ token, user }): Promise<CustomToken> {
      if (user) {
        token.id = user.id
      }
      return token as CustomToken
    },
    async session({ session, token }): Promise<CustomSession> {
      if (session?.user) {
        session.user.id = token.id
      }
      return session as CustomSession
    }
  }
}