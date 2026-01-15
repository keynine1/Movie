import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectMongoDB } from "@/lib/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectMongoDB();

        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ✅ คืน role มาด้วย (สำคัญ)
        return {
          id: user._id.toString(),
          email: user.email,
          name: (user as any).name, // ถ้า schema ไม่มี name ก็จะเป็น undefined ไม่พัง
          role: (user as any).role ?? "user",
        } as any;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      // ✅ ตอน login ครั้งแรก `user` จะมีค่า (จาก authorize)
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "user";
      }

      // ✅ กันเคสรีเฟรช/เปิดแท็บใหม่: token มี email แต่ยังไม่มี role
      if (token.email && !token.role) {
        await connectMongoDB();
        const dbUser = await User.findOne({ email: token.email }).lean();
        token.id = dbUser?._id?.toString();
        token.role = (dbUser as any)?.role ?? "user";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        (session.user as any).role = (token.role as "user" | "admin") ?? "user";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
