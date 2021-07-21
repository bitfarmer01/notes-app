import Button from "@material-tailwind/react/Button";
import Image from "next/image";
import { signIn } from "next-auth/client";
import Icon from "@material-tailwind/react/Icon";

function Login() {
  return (
    <div className=" bg-gradient-to-r from-green-200  to-blue-200 flex flex-col justify-center items-center min-h-screen py-2">
      <div className="ml-16">
        <Image
          className="pl-3"
          src="https://www.svgrepo.com/show/10030/class-notes.svg"
          height="250"
          width="250"
          objectFit="contain"
        />
      </div>
      <h2 className="font-thin text-6xl mt-10  ">Notes App</h2>
      <Button
        className="w-52  mt-10"
        color="teal"
        size="lg"
        buttonType="filled"
        ripple="light"
        onClick={signIn}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
