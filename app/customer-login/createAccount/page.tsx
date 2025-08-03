
"use client";

import { Suspense } from "react";
import CreateAccountClientPage from "./CreateAccountClientPage";

export default function CreateAccountWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAccountClientPage />
    </Suspense>
  );
}

