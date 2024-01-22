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
  const [usernameError, setUsernameError] = useState<string | undefined>(
    undefined
  );

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(undefined);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(undefined);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >(undefined);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset the errors
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setUsernameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);

    // Build data from HTML Form Element
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // First Step: Making sure all the fields are filled
    if (
      data.email &&
      data.firstName &&
      data.lastName &&
      data.password &&
      data.username
    ) {
      // Setting up the Format to check if username includes special characters
      const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (!format.test(data.username.toString())) {
        // Checking if Password field is equal with Confirm Password field
        if (data.password === data.confirmPassword) {
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
        } else {
          setConfirmPasswordError(
            "Confirm Password field much equal with the Password field."
          );
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        setUsernameError("Username cannot include special characters.");
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
