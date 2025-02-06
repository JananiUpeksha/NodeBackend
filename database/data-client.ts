import { User } from "../model/user";
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export async function createUser(user: User) {
    const existingUser = await prisma.user.findUnique({
        where: { username: user.username },
    });

    if (existingUser) {
        throw new Error("Username already exists. Try another username.");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const addedUser = await prisma.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: hashedPassword,
        },
    });

    console.log("User created:", addedUser);
    return addedUser;
}

export async function verifyUserCredentials(verifyUser: User) {
    const user = await prisma.user.findUnique({
        where: { username: verifyUser.username },
    });

    if (!user) {
        return false;
    }

    return await bcrypt.compare(verifyUser.password, user.password);
}
