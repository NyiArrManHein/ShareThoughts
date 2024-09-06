import { FlashMessage } from "@/lib/models";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Register from "./Register";
import Login from "./Login";

function AuthComponent({
  isRegister,
  setIsRegister,
  flashMessage,
  setFlashMessage,
}: {
  isRegister: boolean;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  flashMessage: FlashMessage | undefined;
  setFlashMessage: React.Dispatch<
    React.SetStateAction<FlashMessage | undefined>
  >;
}) {
  const searchParams = useSearchParams();
  const isLogIn = searchParams.get("isRegister") === "false";

  useEffect(() => {
    if (isLogIn) {
      setIsRegister(false);
    }
  }, []);
  // }, [isLogIn]);

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

export default AuthComponent;
