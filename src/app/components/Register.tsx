import React, { useState } from "react";
import Input from "./Input";
import FlashMsg from "./FlashMsg";
import { FlashMessage, Results, User } from "@/lib/models";
import { redirect } from "next/navigation";

function Register({
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
  // Controllers
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(undefined);

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(undefined);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(undefined);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(undefined);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(undefined);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(undefined);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(data);
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { user, message }: { user: User; message: Results } =
        await res.json();
      setFlashMessage({ message: message, category: "bg-info" });
      if (user) {
        setIsRegister(false);
      }
    } else {
      const { message }: { message: string } = await res.json();
      setFlashMessage({ message: message, category: "bg-error" });
    }
  };

  return (
    <div>
      <fieldset className="flex flex-row justify-center">
        <form className="grid grid-cols-1 w-3/4" onSubmit={registerUser}>
          <legend className="text text-lg">Register</legend>
          <span>
            {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
          </span>
          <div className="grid grid-cols-2">
            <Input
              id={"firstName"}
              label={"First Name"}
              type={"text"}
              controller={setFirstName}
              errorMessage={firstNameError}
              value={firstName}
              autoComplete="given-name"
            />

            <Input
              id={"lastName"}
              label={"Last Name"}
              type={"text"}
              controller={setLastName}
              errorMessage={lastNameError}
              value={lastName}
              autoComplete="family-name"
            />
          </div>

          <Input
            id={"username"}
            label={"Username"}
            type={"text"}
            controller={setUsername}
            errorMessage={usernameError}
            value={username}
            autoComplete="username"
          />
          <Input
            id={"email"}
            label={"Email"}
            type={"email"}
            controller={setEmail}
            errorMessage={emailError}
            value={email}
            autoComplete="email"
          />
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
          <div></div>
          <div className="grid grid-cols-1 py-2 pr-2">
            <input type="submit" value="Register" className="btn btn-info" />
          </div>
          <a
            href="#"
            onClick={() => {
              setIsRegister(false);
              setFlashMessage(undefined);
            }}
          >
            Already have an account?
          </a>
        </form>
      </fieldset>
    </div>
  );
}

export default Register;
