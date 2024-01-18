"use client";

import React, { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  return (
    <main className="flex flex-row justify-center mt-4">
      {isRegister ? (
        <Register setIsRegister={setIsRegister} />
      ) : (
        <Login setIsRegister={setIsRegister} />
      )}
    </main>
  );
}

export default Auth;
