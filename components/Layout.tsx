import React from "react";
import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface ILayout {
  children?: React.ReactNode;
  session: any;
}

const Layout: React.FC<ILayout> = ({ children, session }) => {
  const router = useRouter();

  const fetchAppeal = async () => {
    const { data } = await axios.get("/api/appeal");
    return data;
  };

  const fetchUsers = async () => {
    const { data } = await axios.get("/api/users");
    return data;
  };

  const {
    data: appealData,
    error: appealError,
    isLoading: appealLoading,
  } = useQuery({
    queryKey: ["appeal"],
    queryFn: fetchAppeal,
    enabled: !!session?.user?.email,
  });

  const {
    data: usersData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!session?.user?.email,
  });

  return (
    <div className="min-h-screen flex">
      <div className="w-1/4 bg-white p-4 flex flex-col gap-y-6 rounded-md justify-between border">
        <div className="flex-1/4 shadow-md h-1/4 text-center rounded-md pt-24 hover:scale-105 transition cursor-pointer">
          <h1>Главная страница</h1>
        </div>
        <div className="flex-1/4 shadow-md h-1/4 text-center rounded-md pt-24 hover:scale-105 transition cursor-pointer">
          <Link href={`/appeal`}>Обращения</Link>
        </div>
        <div className="flex-1/4 shadow-md h-1/4 text-center rounded-md pt-24 hover:scale-105 transition cursor-pointer">
          <Link href={`/users`}>Сотрудники</Link>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="flex flex-wrap">
          <div className="w-full p-2">
            <div className="bg-white p-4 shadow-md rounded-md">
              <p>Обращения</p>
              <p>Всего: {appealData?.length}</p>
              <Button
                variant={"default"}
                onClick={() => router.push("/appeal")}
              >
                Перейти
              </Button>
            </div>
          </div>
          <div className="w-full p-2">
            <div className="bg-white p-4 shadow-md">
              <p>Сотрудники</p>
              <p>Всего: {usersData?.length}</p>
              <Button variant={"default"}>Перейти</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 bg-gray-100 p-4 border flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <p className="font-bold">{session?.user?.position}</p>
            <div className="flex items-center gap-x-32">
              <Image
                src="/profile.jpg"
                alt="Leader"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div>
                <p>Имя: {session?.user.name}</p>
                <p>Почта: {session?.user.email}</p>
              </div>
            </div>
            <p>Организация Правительства Москвы</p>
          </div>
          <div>
            <Image
              src="/organisation.jpg"
              alt="Moscow Logo"
              width={100}
              height={100}
            />
            <p>ОПМ-CRM</p>
          </div>
        </div>
        <Button
          variant={"destructive"}
          onClick={() => signOut()}
          className="w-full mt-4 flex items-center justify-center"
        >
          <LogOut size={20} className="mr-2" />
          Выход
        </Button>
      </div>
    </div>
  );
};

export default Layout;
