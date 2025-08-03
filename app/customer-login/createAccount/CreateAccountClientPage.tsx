"use client";

import { useSearchParams } from "next/navigation";
import CreateAccountModal from "./CreateAccountModal";

export default function CreateAccountClientPage() {
  const searchParams = useSearchParams();
  const waId = searchParams.get("waId") || "";
  const mobile = searchParams.get("mobile") || "";

  return (
    <CreateAccountModal
      waId={waId}
      mobile={mobile}
      onClose={() => console.log("Modal closed")}
    />
  );
}
