"use client";

import { useState } from "react";
import CreateAccountModal from "../createAccount/CreateAccountModal";
import LoginModal from "./LoginModal";

export default function LoginManager() {
  const [showLoginModal, setShowLoginModal] = useState(true); // Set to true initially to show login
  const [createAccountData, setCreateAccountData] = useState<{
    waId: string;
    mobile: string;
  } | null>(null);

  return (
    <>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          setShowLoginModal={setShowLoginModal}
          onTriggerCreateAccount={(data) => {
            setShowLoginModal(false);
            setCreateAccountData(data);
          }}
        />
      )}

      {createAccountData && (
        <CreateAccountModal
          onClose={() => setCreateAccountData(null)}
          waId={createAccountData.waId}
          mobile={createAccountData.mobile}
        />
      )}
    </>
  );
}
