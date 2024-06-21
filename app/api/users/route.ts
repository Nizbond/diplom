
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            db.user.findMany({
                skip: skip,
                take: limit
            }),
            db.user.count()
        ]);

        return NextResponse.json({
            users,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error: any) {
        console.error("[USER_FETCH_ERROR]", error);
        return new NextResponse('Не удалось получить пользователя', { status: 500 });
    }
}
