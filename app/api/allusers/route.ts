import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const appeals = await db.user.findMany();

        return NextResponse.json(appeals);
    } catch (error: any) {
        console.error("[USER_CREATE_ERROR]", error);
        return new NextResponse('Не удалось создать обращение', { status: 500 });
    }
}