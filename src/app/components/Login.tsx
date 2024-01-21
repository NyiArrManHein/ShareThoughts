"use client";

import React, { useState } from "react";
import Input from "./Input";
import FlashMsg from "./FlashMsg";
import { FlashMessage } from "@/lib/models";

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
  // Controller
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(undefined);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(undefined);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      <fieldset className="flex flex-row justify-center">
        <form className="grid grid-cols-1 max-w-lg">
          <legend className="text text-lg">Login</legend>
          <span>
            {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
          </span>
          <div>
            <Input
              id={"username"}
              label={"Username"}
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
          <a href="#">Forgot password?</a>
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
