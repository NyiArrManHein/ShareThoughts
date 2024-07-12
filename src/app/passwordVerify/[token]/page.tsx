"use client";
import FlashMsg from "@/app/components/FlashMsg";
import Input from "@/app/components/Input";
import { FlashMessage } from "@/lib/models";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PasswordVerifyPage = ({ params }: { params: { token: string } }) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(undefined);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >(undefined);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>(
    undefined
  );
  const router = useRouter();

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const data = {
      token: params.token,
      password: password,
    };
    if (password === confirmPassword) {
      const res = await fetch("/api/users/forgotPassword/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { email, message } = await res.json();
        setFlashMessage({ message: message, category: "bg-info" });
        // Redirect to auth page
        router.push("/auth");
      } else {
        const { message } = await res.json();
        setFlashMessage({ message: message, category: "bg-error" });
      }
    } else {
      setConfirmPasswordError(
        "Confirm Password field much equal with the Password field."
      );
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <main className="max-w-xl px-4 mx-auto flex flex-col justify-center h-screen">
      <div className="card card-bordered p-10 shadow-lg rounded-lg flex flex-col">
        <span>
          {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
        </span>
        <form onSubmit={changePassword}>
          <h1 className="text-2xl font-light">Choose a new password</h1>
          <p>You can reset your password here.</p>
          <Input
            id={"password"}
            label={"Password"}
            type={"password"}
            controller={setPassword}
            errorMessage={passwordError}
            value={password}
          />
          <Input
            id={"confirmPassword"}
            label={"Confirm Password"}
            type={"password"}
            controller={setConfirmPassword}
            errorMessage={confirmPasswordError}
            value={confirmPassword}
          />
          <button>Reset Password</button>
        </form>
      </div>
    </main>
  );
};
export default PasswordVerifyPage;
