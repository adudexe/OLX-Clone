import { useState } from "react";
import { Modal, ModalBody, Carousel } from "flowbite-react";
import mobile from "../../assets/mobile.svg";
import guitar from "../../assets/guita.png";
import google from "../../assets/google.png";
import close from "../../assets/close.svg";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { userAuth } from "../../Components/Context/context";
import type { AuthContextType } from "../Context/Auth";
import { toast } from "react-toastify";

interface ModalProps {
  toggleModal: () => void;
  status: boolean;
}



type ViewState = "default" | "emailLogin" | "emailSignup";

const Login = ({ toggleModal, status }: ModalProps) => {
  const [view, setView] = useState<ViewState>("default");
  const [email,setEmail] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const { logIn,signUp }:AuthContextType = userAuth();



  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toggleModal();
      console.log("user", result.user);
    } catch (err) {
      console.log("Error in Login", err);
    }
  };

  const handleSignUp = async (e:any) => {
    e.preventDefault();
    try{
      await signUp(email,password);
      toggleModal();
      toast.success("Sign In Successfull");
    } catch(err) {
      console.log('Error in SignUp',err);
      return toast.error("Erros in SingUp");
    }
  }

  const handleLogin = async (e:any) => {
      e.preventDefault();
      
      try{
        await logIn(email,password);
        toast.success("Logged in successfully");
        setEmail("");
        setPassword("");
        toggleModal();
      }catch(err){
        console.log("Error in Login",err);
        return toast.error("Error in Login");
      }
  }

  const renderDefaultView = () => (
    <>
      <div className="p-6 pt-0">
        <div className="flex items-center justify-start rounded-md border-2 border-solid border-black p-5 pl-4 relative h-8 mb-4 cursor-pointer">
          <img className="w-6 mr-2" src={mobile} alt="" />
          <p className="text-sm font-bold">Continue with phone</p>
        </div>
        <div
          onClick={handleGoogleLogin}
          className="flex items-center justify-center rounded-md border-2 border-solid border-gray-300 p-5 relative h-8 cursor-pointer active:bg-teal-100"
        >
          <img className="w-7 absolute left-2" src={google} alt="" />
          <p className="text-sm text-gray-500">Continue with Google</p>
        </div>
        <div className="pt-5 flex flex-col items-center justify-center">
          <p className="font-semibold text-sm">OR</p>
          <p
            className="font-bold text-sm pt-3 underline underline-offset-4 cursor-pointer"
            onClick={() => setView("emailLogin")}
          >
            Login with Email
          </p>
          <p
            className="text-sm pt-2 text-blue-600 underline cursor-pointer"
            onClick={() => setView("emailSignup")}
          >
            Sign up with Email
          </p>
        </div>
        <div className="pt-10 sm:pt-20 flex flex-col items-center justify-center">
          <p className="text-xs">All your personal details are safe with us.</p>
          <p className="text-xs pt-5 text-center">
            If you continue, you are accepting{" "}
            <span className="text-blue-600">OLX Terms and Conditions and Privacy Policy</span>
          </p>
        </div>
      </div>
    </>
  );

  const renderEmailForm = (type: "login" | "signup") => (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4">{type === "login" ? "Login" : "Sign Up"} with Email</h3>
      <form className="flex flex-col gap-4">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded-md text-sm"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 rounded-md text-sm"
        />
        <button
         onClick={type == "login" ? handleLogin : handleSignUp }
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-md"
        >
          {type === "login" ? "Login" : "Sign Up"}
        </button>
        <p
          className="text-sm text-blue-500 underline cursor-pointer mt-2"
          onClick={() => setView("default")}
        >
          ← Back to options
        </p>
      </form>
    </div>
  );

  return (
    <div>
      <Modal
        theme={{
          content: {
            base: "relative w-120 p-4 md:h-auto",
            inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
        }}
        onClick={toggleModal}
        className="bg-black/50 rounded-none"
        position={"center"}
        show={status}
        size="md"
        popup={true}
      >
        <div onClick={(e) => e.stopPropagation()} className="p-6 pl-2 pr-2 bg-white">
          <img
            onClick={toggleModal}
            className="w-6 absolute z-10 top-4 right-4 cursor-pointer"
            src={close}
            alt="close"
          />
          {view === "default" && (
            <Carousel slide={false} className="w-full h-56 pb-5 rounded-none">
              <div className="flex flex-col items-center justify-center">
                <img className="w-24 pb-5" src={guitar} alt="Guitar" />
                <p
                  style={{ color: "#002f34" }}
                  className="w-60 sm:w-72 text-center pb-5 font-semibold"
                >
                  Help us become one of the safest places to buy and sell.
                </p>
              </div>
            </Carousel>
          )}
        </div>

        <ModalBody
          className="bg-white p-0 rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {view === "default"
            ? renderDefaultView()
            : renderEmailForm(view === "emailLogin" ? "login" : "signup")}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Login;
