import { db } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        message: "Пользователь не авторизован",
      },
      {
        status: 401,
      }
    );
  }
  const { id } = params;
  const { status } = await request.json();
  try {
    const updatedAppeal = await db.appeal.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updatedAppeal);
  } catch (error: any) {
    console.error("[USER_CREATE_ERROR]", error);
    return new NextResponse("Не удалось создать обращение", { status: 500 });
  }
}
