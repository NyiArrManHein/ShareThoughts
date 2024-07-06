"use client";
import { useState } from "react";
import Input from "../components/Input";
import { FlashMessage } from "@/lib/models";
import FlashMsg from "../components/FlashMsg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(undefined);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>(
    undefined
  );

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      email: formData.get("email"),
    };
    const res = await fetch("/api/users/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { message }: { message: any } = await res.json();
      setFlashMessage({ message: message, category: "bg-info" });
    } else {
      const { message }: { message: string } = await res.json();
      setFlashMessage({ message: message, category: "bg-error" });
    }
  };

  return (
    <main className="max-w-xl px-4 mx-auto flex flex-col justify-center h-screen">
      <div className="card card-bordered p-10 shadow-lg rounded-lg flex flex-col">
        <span>
          {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
        </span>
        <form onSubmit={resetPassword}>
          <h1 className="text-2xl font-light text-center mb-10">
            Reset password
          </h1>
          <p>
            Enter your email address to get instructions for resetting your
            password.
          </p>
          <Input
            id={"email"}
            label={"Email"}
            type={"email"}
            controller={setEmail}
            errorMessage={emailError}
            value={email}
            autoComplete="email"
          />
          <button>Reset Password</button>
        </form>
      </div>
    </main>
  );
}
