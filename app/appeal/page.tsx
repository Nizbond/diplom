"use client";
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const statusOptions = [
  { value: "PENDING", label: "В обработке" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED", label: "Выполнено" },
  { value: "CANCELED", label: "Завершено" },
];

const page = () => {
  const { data: session } = useSession();
  const [appeals, setAppeals] = useState<any[]>([]);
  useEffect(() => {
    async function fetchAppeals() {
      try {
        const response = await fetch(`/api/appeal`);
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
  const handleStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appeal/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      setAppeals(
        appeals.map((appeal) =>
          appeal.id === id ? { ...appeal, status: newStatus } : appeal
        )
      );
      toast.success("Статус обновлен");
    } catch (error) {
      toast.error("Статус не обновлен");
      console.error("Не удалось обновить");
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ФИО</TableHead>
          <TableHead>Почта</TableHead>
          <TableHead>Описание</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Приоритет</TableHead>
          <TableHead>Статус</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appeals?.map((appeal: any) => (
          <TableRow key={appeal.id}>
            <TableCell>{appeal.name}</TableCell>
            <TableCell>{appeal.email}</TableCell>
            <TableCell>{appeal.description}</TableCell>
            <TableCell>{appeal.category}</TableCell>
            <TableCell>{appeal.priority}</TableCell>
            <TableCell>
              <select
                value={appeal.status ?? "PENDING"}
                onChange={(e) =>
                  handleStatus(appeal.id as string, e.target.value)
                }
              >
                {statusOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default page;
