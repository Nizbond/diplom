"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    try {
      router.push("/");
      toast.success("Вы успешно вошли");
    } catch (error: any) {
      toast.error("Что-то пошло не так");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        <div className="container mx-auto flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex items-center flex-col justify-center space-y-4 p-4 rounded-md mt-24 shadow-2xl border border-blue-500"
          >
            <div className="flex items-center justify-center">
              <Image
                src="/organisation.jpg"
                alt="организация правительства Москвы"
                width={150}
                height={150}
                objectFit="cover"
                className="rounded-md shadow-md border border-blue-500"
              />
              <span className="text-3xl ml-4">ОПМ-CRM</span>
            </div>
            <h1 className="text-3xl">Аутентификация</h1>

            <div className="w-[500px]">
              <Label>Почта</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-[500px]">
              <Label>Пароль</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-center">
              <Button variant={"default"} type="submit" className="w-[500px]">
                Войти
              </Button>
              <p className="text-muted-foreground mt-4">
                Нет аккаунта?{" "}
                <Link
                  href={`/register`}
                  className="hover:text-blue-400 transition"
                >
                  Регистрация
                </Link>{" "}
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin w-20 h-20 text-blue-500" />
        </div>
      )}
    </>
  );
}
