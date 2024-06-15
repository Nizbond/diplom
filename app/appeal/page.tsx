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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const statusOptions = [
  { value: "PENDING", label: "В обработке" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED", label: "Выполнено" },
  { value: "CANCELED", label: "Завершено" },
];

const page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [appeals, setAppeals] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchAppeals() {
      try {
        const response = await fetch(
          `/api/appeal?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Не удалось получить обращение");
        }
        const data = await response.json();
        setAppeals(data.appeals);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error("Не удалось получить обращение");
      }
    }
    fetchAppeals();
  }, [currentPage]);

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-[80%] container mx-auto mt-20 shadow-md border rounded-md p-2 border-blue-500">
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
      <Pagination className="flex items-center justify-end p-4">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? " bg-slate-500/5" : ""}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <Button onClick={() => router.push("/")} className="my-4 w-full">
        Назад
      </Button>
    </div>
  );
};

export default page;
