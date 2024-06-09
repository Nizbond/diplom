"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const router = useRouter();
  const handlePosition = (value: string) => {
    setPosition(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/register", {
        name,
        email,
        password,
        position,
      });

      signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("An error occurred during registration:", error);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-col justify-center space-y-4 p-4 rounded-md mt-24 shadow-md"
      >
        <div className="flex items-center justify-center">
          <Image
            src="/organisation.jpg"
            alt="организация правительства Москвы"
            width={150}
            height={150}
            objectFit="cover"
            className="border rounded-md shadow-md"
          />
          <span className="text-3xl ml-4">ОПМ-CRM</span>
        </div>
        <h1 className="text-3xl">Регистрация</h1>
        <div className="w-[500px]">
          <Label>ФИО</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="w-[500px]">
          <Select value={position} onValueChange={handlePosition}>
            <SelectTrigger>
              <SelectValue placeholder="Должность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Стажер">Стажер</SelectItem>
              <SelectItem value="младший Аналитик">младший Аналитик</SelectItem>
              <SelectItem value="Аналитик">Аналитик</SelectItem>
              <SelectItem value="старший Аналитик">старший Аналитик</SelectItem>
              <SelectItem value="ведущий Аналитик">ведущий Аналитик</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            Зарегистрироваться
          </Button>
          <p className="text-muted-foreground mt-4">
            Есть аккаунт?{" "}
            <Link href={`/login`} className="hover:text-blue-400 transition">
              Войти
            </Link>{" "}
          </p>
        </div>
      </form>
    </div>
  );
}
