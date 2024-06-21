import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            position: string;
            isAdmin: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        position: string;
        isAdmin: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        position: string;
    }
}
