"use client";

import React, { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import { FlashMessage } from "@/lib/models";

function Auth() {
  const [isRegister, setIsRegister] = useState(true);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>(
    undefined
  );

  return (
    <main className="flex flex-row justify-center mt-4">
      {isRegister ? (
        <Register
          setIsRegister={setIsRegister}
          flashMessage={flashMessage}
          setFlashMessage={setFlashMessage}
        />
      ) : (
        <Login
          setIsRegister={setIsRegister}
          flashMessage={flashMessage}
          setFlashMessage={setFlashMessage}
        />
      )}
    </main>
  );
}

export default Auth;
