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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

const page = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5;
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/users?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Не удалось получить обращение");
        }
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error("Не удалось получить обращение");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {!isLoading ? (
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
              {users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.position}</TableCell>
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
