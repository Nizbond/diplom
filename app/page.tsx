"use client";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fetchAppeal = async () => {
    const { data } = await axios.get("/api/appeal");
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
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return <div>{session?.user?.name}</div>;
}
