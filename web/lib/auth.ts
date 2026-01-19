import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "ERP Credentials",
            credentials: {
                erpId: { label: "ERP ID", type: "text", placeholder: "2021CS1001" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.erpId || !credentials?.password) return null;

                // Mock ERP Validation Logic
                const mockUsers = [
                    { erpId: '2021CS1001', name: 'John Doe', hostelNo: 'H3', roomNo: '305', role: 'student', email: 'john@college.edu' },
                    { erpId: 'STAFF001', name: 'Maintenance Staff', role: 'staff', specialization: 'electrical' },
                    { erpId: 'ADMIN001', name: 'Admin', role: 'admin' }
                ];

                let userData = mockUsers.find(u => u.erpId === credentials.erpId);

                // Allow creating new users if password is 'password'
                if (!userData) {
                    if (credentials.password === 'password') {
                        userData = {
                            erpId: credentials.erpId,
                            name: `User ${credentials.erpId}`,
                            role: 'student',
                            hostelNo: 'H1', // Default
                            roomNo: '101',
                            email: `${credentials.erpId}@example.com`,
                            specialization: undefined
                        };
                    } else {
                        return null;
                    }
                } else {
                    if (credentials.password !== 'password') return null;
                }

                try {
                    // Sync with MongoDB
                    await connectDB();

                    let dbUser = await User.findOne({ erpId: userData.erpId });

                    if (!dbUser) {
                        dbUser = await User.create(userData);
                    }

                    return {
                        id: dbUser._id.toString(),
                        erpId: dbUser.erpId,
                        name: dbUser.name,
                        email: dbUser.email,
                        role: dbUser.role,
                        hostelNo: dbUser.hostelNo,
                        roomNo: dbUser.roomNo
                    };
                } catch (error) {
                    console.error("Auth Error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.erpId = user.erpId;
                token.role = user.role;
                token.hostelNo = user.hostelNo;
                token.roomNo = user.roomNo;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.erpId = token.erpId;
                session.user.role = token.role;
                session.user.hostelNo = token.hostelNo;
                session.user.roomNo = token.roomNo;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
