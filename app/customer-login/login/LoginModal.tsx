"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProjectApiList from "@/app/api/ProjectApiList";

type OtplessUser = {
  userId: string;
  identities: {
    identityValue: string;
    identityType?: string;
  }[];
};

interface LoginModalProps {
  onClose?: () => void;
  setShowLoginModal: (value: boolean) => void;
  onTriggerCreateAccount: (data: { waId: string; mobile: string }) => void;
}

declare global {
  interface Window {
    otpless?: (user: OtplessUser) => void;
    otplessInit?: () => void;
  }
}

export default function LoginModal({
  onClose,
  setShowLoginModal,
  onTriggerCreateAccount,
}: LoginModalProps) {
  const router = useRouter();
  const { api_otplessCallback } = ProjectApiList();

  useEffect(() => {
    const loadOTPlessScript = () => {
      if (document.getElementById("otpless-sdk")) return;

      const script = document.createElement("script");
      script.src = "https://otpless.com/v3/auth.js";
      script.id = "otpless-sdk";
      script.type = "text/javascript";
      script.setAttribute("data-appid", "HH4FMVL4I4B6B16IZZJH");
      script.setAttribute("data-login_uri", "http://194.164.151.98/pages/auth/login");
      script.setAttribute("data-origin", "http://194.164.151.98");
      document.head.appendChild(script);
    };

    loadOTPlessScript();

    window.otpless = async (otplessUser: OtplessUser) => {
      const waId = otplessUser.userId;
      const mobile = otplessUser.identities[0]?.identityValue || "Unknown";

      try {
        const res = await axios.post(api_otplessCallback, { waId, mobile });
        const data = res.data;

        if (!data.userExists) {
          setShowLoginModal(false);
          onTriggerCreateAccount({ waId, mobile });
        } else if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.reload();
        }
      } catch (error) {
        console.error("OTPless login failed:", error);
      }
    };
  }, [api_otplessCallback, setShowLoginModal, onTriggerCreateAccount]);

  return (
    <div className="fixed inset-0 z-[500] bg-black/40 flex justify-center items-center px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full relative">
        <button
          onClick={() => {
            setShowLoginModal(false);
            onClose?.();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
        >
          ×
        </button>
        <div id="otpless-login-page" className="min-h-[250px]" />
      </div>
    </div>
  );
}
