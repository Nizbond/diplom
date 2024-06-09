
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, description, category, priority } = await request.json();

        const appeal = await db.appeal.create({
            data: {
                name,
                email,
                description,
                category,
                priority
            }
        });

        return NextResponse.json(appeal);
    } catch (error: any) {
        console.error("[USER_CREATE_ERROR]", error);
        return new NextResponse('Не удалось создать обращение', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {

        const appeals = await db.appeal.findMany();

        return NextResponse.json(appeals);
    } catch (error: any) {
        console.error("[USER_CREATE_ERROR]", error);
        return new NextResponse('Не удалось создать обращение', { status: 500 });
    }
}
