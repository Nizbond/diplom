"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const statusOptions = [
  { value: "PENDING", label: "В обработке" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED", label: "Выполнено" },
  { value: "CANCELED", label: "Завершено" },
];

const page = () => {
  const router = useRouter();
  const [appeals, setAppeals] = useState<any[]>([]);
  useEffect(() => {
    async function fetchAppeals() {
      try {
        const response = await fetch(`/api/users`);
        if (!response.ok) {
          throw new Error("Не удалось получить обращение");
        }
        const data = await response.json();
        setAppeals(data);
      } catch (error) {
        console.error("Не удалось получить обращение");
      }
    }
    fetchAppeals();
  }, []);

  return (
    <div className="max-w-[80%] container mx-auto mt-20 shadow-md border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ФИО</TableHead>
            <TableHead>Почта</TableHead>
            <TableHead>Должность</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appeals?.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={() => router.push("/")} className="my-4 w-full">
        Назад
      </Button>
    </div>
  );
};

export default page;
