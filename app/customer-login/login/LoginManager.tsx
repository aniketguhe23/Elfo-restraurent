// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import ProjectApiList from "@/app/api/ProjectApiList";

// type OtplessUser = {
//   userId: string;
//   identities: {
//     identityValue: string;
//     identityType?: string;
//   }[];
// };

// interface LoginModalProps {
//   onClose: () => void;
//   setShowLoginModal: (value: boolean) => void;
//   onTriggerCreateAccount: (data: { waId: string; mobile: string }) => void;
// }

// declare global {
//   interface Window {
//     otpless: (user: OtplessUser) => void;
//   }
// }

// export default function LoginModal({
//   onClose,
//   setShowLoginModal,
//   onTriggerCreateAccount,
// }: LoginModalProps) {
//   const router = useRouter();
//   const { api_otplessCallback } = ProjectApiList();

//   useEffect(() => {
//     const scriptId = "otpless-sdk";

//     // Clean up old widget
//     const container = document.getElementById("otpless-login-page");
//     if (container) container.innerHTML = "";

//     // Remove script if exists
//     const oldScript = document.getElementById(scriptId);
//     if (oldScript) oldScript.remove();

//     // Inject OTPless script
//     const script = document.createElement("script");
//     script.src = "https://otpless.com/v4/auth.js";
//     script.id = scriptId;
//     script.type = "text/javascript";
//     script.setAttribute("data-appid", "HH4FMVL4I4B6B16IZZJH");
//     document.body.appendChild(script);

//     window.otpless = async (otplessUser: OtplessUser) => {
//       const waId = otplessUser.userId;
//       const mobile = otplessUser.identities[0]?.identityValue || "Unknown";

//       try {
//         const res = await axios.post(api_otplessCallback, { waId, mobile });
//         const data = res.data;

//         if (!data.userExists) {
//           setShowLoginModal(false);
//           onTriggerCreateAccount({ waId, mobile });
//         } else if (data.token) {
//           localStorage.setItem("token", data.token);
//           router.push("/pages/cart");
//         }
//       } catch (error) {
//         console.error("OTPless login failed:", error);
//       }
//     };
//   }, [api_otplessCallback, router, setShowLoginModal, onTriggerCreateAccount]);

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-500">
//       <div className="bg-white rounded-md shadow-md p-3 w-full max-w-md min-h-[140px] relative">
//         <button
//           className="absolute top-1.5 right-2 text-gray-500 text-md hover:text-red-500 cursor-pointer"
//           onClick={onClose}
//         >
//           X
//         </button>

//         <div id="otpless-login-page" className="h-[15px] min-h-[24px]" />
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import CreateAccountModal from "../createAccount/CreateAccountModal";
// import CreateAccountModal from "../createAccount/components/CreateAccountModal";


export default function LoginManager() {
  const [showLoginModal, setShowLoginModal] = useState(true);
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