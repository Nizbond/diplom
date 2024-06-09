
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, position } = await request.json();

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new NextResponse('Пользователь с таким email уже существует', { status: 400 });
        }



        const user = await db.user.create({
            data: {
                name,
                email,
                password,
                position
            }
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("[USER_CREATE_ERROR]", error);
        return new NextResponse('Не удалось создать пользователя', { status: 500 });
    }
}
