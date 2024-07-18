"use client";

import React, { useState } from "react";
import Input from "./Input";
import FlashMsg from "./FlashMsg";
import { FlashMessage } from "@/lib/models";
import { useRouter } from "next/navigation";
import useUser from "@/lib/useUser";
import Link from "next/link";

function Login({
  setIsRegister,
  flashMessage,
  setFlashMessage,
}: {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  flashMessage: FlashMessage | undefined;
  setFlashMessage: React.Dispatch<
    React.SetStateAction<FlashMessage | undefined>
  >;
}) {
  const { push } = useRouter();
  // Use User
  const { mutateUser } = useUser();

  // Controller
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(undefined);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(undefined);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Build data from HTML Form Element
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      username_or_email: formData.get("username_or_email"),
      password: formData.get("password"),
    };
    if (data.username_or_email && data.password) {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const { user, message } = await res.json();
      if (res.ok) {
        if (user) {
          // Logged in successfully
          await mutateUser({ ...data, user: user });
          // push("/");
          if (user.role === "ADMIN") {
            // Redirect to admin page if user is admin
            push("/admin");
          } else {
            // Redirect to homepage if user is not admin
            push("/");
          }
        } else {
          // const { message } = await res.json();
          setFlashMessage({ message: message, category: "bg-error" });
        }
      } else {
        const { message } = await res.json();
        setFlashMessage({ message: message, category: "bg-error" });
      }
    } else {
      setFlashMessage({
        message: "Please fill in all the fields.",
        category: "bg-info",
      });
    }
  };

  return (
    <div>
      <fieldset className="flex flex-row justify-center">
        <form className="grid grid-cols-1 max-w-lg" onSubmit={loginUser}>
          <legend className="text text-lg">Login</legend>
          <span>
            {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
          </span>
          <div>
            <Input
              id={"username_or_email"}
              label={"Username or Email"}
              type={"text"}
              controller={setUsername}
              errorMessage={usernameError}
              value={username}
            />
          </div>
          <Input
            id={"password"}
            label={"Password"}
            type={"password"}
            controller={setPassword}
            errorMessage={passwordError}
            value={password}
          />
          <Link href="/forgot-password">Forgot password?</Link>
          <div className="grid grid-cols-1">
            <input type="submit" value="Login" className="btn btn-info mr-2" />
          </div>
          <a
            href="#"
            onClick={() => {
              setIsRegister(true);
              setFlashMessage(undefined);
            }}
          >
            Create an account?
          </a>
        </form>
      </fieldset>
    </div>
  );
}

export default Login;
