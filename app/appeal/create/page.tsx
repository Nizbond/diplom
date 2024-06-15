"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const AppealPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [appealData, setAppealData] = useState({
    name: "",
    email: "",
    description: "",
    category: "",
    priority: "",
  });
  const handleCategory = (value: string) => {
    setAppealData({
      ...appealData,
      category: value,
    });
  };
  const handlePriority = (value: string) => {
    setAppealData({
      ...appealData,
      priority: value,
    });
  };
  const addAppeal = async (appeal: any) => {
    const { data } = await axios.post("/api/appeal", appeal);
    return data;
  };
  const mutation = useMutation({
    mutationFn: addAppeal,
    onSuccess: () => {
      setAppealData({
        name: "",
        email: "",
        description: "",
        category: "",
        priority: "",
      });
      queryClient.invalidateQueries();
      toast.success("Обращение добавлено");
      router.back();
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении обращения");
      console.error("An error occurred during registration:", error);
    },
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutateAsync(appealData);
  };
  return (
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
            className="rounded-md shadow-lg border border-blue-500"
          />
          <span className="text-3xl ml-4">
            Организация
            <p />
            Правительства
            <p />
            Москвы
          </span>
        </div>
        <h1 className="text-3xl">Создание обращения</h1>
        <div className="w-[500px]">
          <Label>ФИО</Label>
          <Input
            type="text"
            value={appealData.name}
            onChange={(e) =>
              setAppealData({
                ...appealData,
                name: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="w-[500px]">
          <Label>Почта</Label>
          <Input
            type="email"
            value={appealData.email}
            onChange={(e) =>
              setAppealData({
                ...appealData,
                email: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="w-[500px]">
          <Select value={appealData.category} onValueChange={handleCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Департамент труда и социальной защиты населения">
                Департамент труда и социальной защиты населения
              </SelectItem>
              <SelectItem value="Департамент жилищно-коммунального хозяйства">
                Департамент жилищно-коммунального хозяйства
              </SelectItem>
              <SelectItem value="Департамент здравоохранения">
                Департамент здравоохранения
              </SelectItem>
              <SelectItem value="Центр предоставления государственных услуг (Мои документы)">
                Центр предоставления государственных услуг (Мои документы)
              </SelectItem>
              <SelectItem value="Управление делами Правительства Москвы">
                Управление делами Правительства Москвы
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[500px]">
          <Select value={appealData.priority} onValueChange={handlePriority}>
            <SelectTrigger>
              <SelectValue placeholder="Приоритет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Низкий">Низкий</SelectItem>
              <SelectItem value="Средний">Средний</SelectItem>
              <SelectItem value="Высокий">Высокий</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[500px]">
          <Label>Описание</Label>
          <Textarea
            value={appealData.description}
            onChange={(e) =>
              setAppealData({
                ...appealData,
                description: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="text-center">
          <Button variant={"default"} type="submit" className="w-[500px]">
            Создать обращение
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppealPage;
