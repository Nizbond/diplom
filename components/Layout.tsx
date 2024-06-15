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
    const { data } = await axios.get("/api/appeals");
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
      <div className="w-1/4 bg-white p-4 flex flex-col gap-y-6 rounded-md justify-between border border-blue-500">
        <div className="flex-1/4 shadow-md h-1/4 text-center rounded-md pt-24 hover:scale-105 transition cursor-pointer border border-blue-500">
          <h1>Главная страница</h1>
        </div>
        <Link
          href={`/appeal`}
          className="flex-1/4 shadow-md h-1/4 text-center rounded-md pt-24 hover:scale-105 transition cursor-pointer border border-blue-500"
        >
          Обращения
        </Link>
        <Link
          href={`/users`}
          className="flex-1/4 shadow-md h-1/4 text-center rounded-md pt-24 hover:scale-105 transition cursor-pointer border border-blue-500"
        >
          Сотрудники
        </Link>
      </div>
      <div className="flex-1 p-4">
        <div className="flex flex-wrap">
          <div className="w-full p-2">
            <div className="bg-white p-4 shadow-md rounded-md border border-blue-500">
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
            <div className="bg-white p-4 shadow-md rounded-md border border-blue-500">
              <p>Сотрудники</p>
              <p>Всего: {usersData?.length}</p>
              <Button variant={"default"}>Перейти</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 bg-gray-100 p-4 border flex flex-col justify-between">
        <div>
          <div className="bg-white p-4 rounded-md border border-blue-500 shadow-md">
            <h1 className="font-bold text-xl mb-4">
              {session?.user?.position}
            </h1>
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Имя:</span>{" "}
                  {session?.user?.name}
                </p>
                <p>
                  <span className="font-semibold">Почта:</span>{" "}
                  {session?.user?.email}
                </p>
                <p>
                  Организация <br /> Правительства <br /> Москвы
                </p>
              </div>
              <Image
                src="/profile.jpg"
                alt="Profile Logo"
                width={120}
                height={120}
                className="shadow-md rounded-md"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mx-auto mt-24 max-w-[70%]">
            <div className="p-4 bg-white shadow-md rounded-md border border-blue-500">
              <Image
                src="/organisation.jpg"
                alt="Moscow Logo"
                width={120}
                height={120}
              />
            </div>
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
