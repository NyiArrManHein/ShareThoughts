import React, { useState } from "react";
import Input from "./Input";
import FlashMsg from "./FlashMsg";

function Register({
  setIsRegister,
}: {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [flashMessage, setFlashMessage] = useState(undefined);

  return (
    <div>
      <fieldset className="flex flex-row justify-center">
        {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
        <form className="grid grid-cols-1 w-3/4">
          <legend className="text text-lg">Register</legend>
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
          <a href="#" onClick={() => setIsRegister(false)}>
            Already have an account?
          </a>
        </form>
      </fieldset>
    </div>
  );
}

export default Register;
