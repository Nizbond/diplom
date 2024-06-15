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
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        const [appeals, total] = await Promise.all([
            db.appeal.findMany({
                skip: skip,
                take: limit
            }),
            db.appeal.count()
        ]);

        return NextResponse.json({
            appeals,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error: any) {
        console.error("[USER_FETCH_ERROR]", error);
        return new NextResponse('Не удалось получить обращения', { status: 500 });
    }
}
