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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowDownAZ, ArrowUpAZ, Loader2 } from "lucide-react";

const statusOptions = [
  { value: "PENDING", label: "В обработке" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "COMPLETED", label: "Выполнено" },
  { value: "CANCELED", label: "Завершено" },
];

const page = () => {
  const router = useRouter();
  const [appeals, setAppeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "",
    direction: "ascending",
  });
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchAppeals() {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  const sortedAppeals = [...appeals].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      {!isLoading ? (
        <div className="max-w-[80%] container mx-auto mt-20 shadow-md border rounded-md p-2 border-blue-500">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ФИО</TableHead>
                <TableHead>Почта</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead
                  onClick={() => handleSort("priority")}
                  className="cursor-pointer"
                >
                  Приоритет
                  {sortConfig.key === "priority" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUpAZ size={18} className="inline ml-2" />
                    ) : (
                      <ArrowDownAZ size={18} className="inline ml-2" />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer"
                >
                  Статус
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowUpAZ size={18} className="inline ml-2" />
                    ) : (
                      <ArrowDownAZ size={18} className="inline ml-2" />
                    ))}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppeals.map((appeal: any) => (
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
                      className={`p-2 rounded-md ${
                        appeal.status === "CANCELED"
                          ? "bg-red-500 text-white"
                          : appeal.status === "COMPLETED"
                          ? "bg-green-500 text-white"
                          : appeal.status === "IN_PROGRESS"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-200 text-black"
                      }`}
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
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin w-20 h-20 text-blue-500" />
        </div>
      )}
    </>
  );
};

export default page;
