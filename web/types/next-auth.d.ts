import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            erpId: string
            role: string
            hostelNo: string
            roomNo: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        erpId: string
        role: string
        hostelNo: string
        roomNo: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        erpId: string
        role: string
        hostelNo: string
        roomNo: string
    }
}
