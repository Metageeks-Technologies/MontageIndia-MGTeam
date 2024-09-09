"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Key } from "@react-types/shared";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { notifySuccess } from "@/utils/toast";
import instance from "@/utils/axios";
import Link from "next/link";
import { Spinner } from "@nextui-org/react";
import Swal from "sweetalert2";
import { ThreeDotsLoader } from "@/components/loader/loaders";
import { useSearchParams } from "next/navigation";
import {
  signInWithGoogle,
  signInWithEmailPassword,
  sendOtp,
  verifyOtp,
  setupRecaptcha,
} from "@/utils/loginOptions";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import { createCart } from "@/app/redux/feature/product/api";
import { useAppDispatch } from "@/app/redux/hooks";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [resendOtpCooldown, setResendOtpCooldown] = useState<number>(60);
  const [activeTab, setActiveTab] = useState<string>("email");
  const dispatch = useAppDispatch();
  const [loaders, setLoaders] = useState({
    loader: false,
    sentOtp: false,
    verifyOtp: false,
  });

  const redirectUrl = searchParams.get("redirect");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    console.log("login cliked");
    try {
      setLoaders({ ...loaders, loader: true });
      const response: any = await signInWithEmailPassword(email, password);

      if (response.status === "success") {
        console.log("response", response);
        const userCredential = response.result;
        console.log("user logged in", userCredential.user);
        setLoaders({ ...loaders, loader: false });
        await createCart(dispatch);
        router.push(redirectUrl || "/");

        notifySuccess("Login Successful");
        setEmail("");
        setPassword("");
      } else {
        setLoaders({ ...loaders, loader: false });
        setError("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoaders({ ...loaders, loader: false });
      const errorMessage =
        error.response?.data?.message || `Login failed. Please try again later`;
      Swal.fire({
        icon: "error",
        title: "Login error",
        text: errorMessage,
      });
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "An error occurred during login. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleLoginGoogle = async () => {
    try {
      const userData = await signInWithGoogle();
      console.log("userData", userData);
      setEmail("");
      const { uid, email, displayName, photoURL } = userData.user;

      const response = await instance.post("/user/googleLogin", {
        uid,
        email,
        name: displayName,
        image: photoURL,
      });
      console.log("google login", response);

      notifySuccess("Login Successful");
      await createCart(dispatch);
      router.push(redirectUrl || "/");

      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || `Login failed. Please try again later`;
      Swal.fire({
        icon: "error",
        title: "Login error",
        text: errorMessage,
      });
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "An error occurred during login. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 10) {
      setError("Please enter a valid phone number");
      return;
    }
    const updatedPhoneNumber = countryCode + phoneNumber;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/phone/?phone=${updatedPhoneNumber}`
    );
    console.log("response", response);
    if (response.data.success) {
      setLoaders({ ...loaders, sentOtp: true });
      await sendOtp(updatedPhoneNumber);
      setLoaders({ ...loaders, sentOtp: false });
      setIsOtpSent(true);
      setResendOtpCooldown(60);
      notifySuccess("OTP sent successfully");
      setError("");
    } else {
      setError("Phone number not registered.Signup to continue");
      setLoaders({ ...loaders, sentOtp: false });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6 || otp.length > 6) {
      setError("Please enter a valid OTP");
      return;
    }
    setLoaders({ ...loaders, verifyOtp: true });
    const response = await verifyOtp(otp);
    if (response.success) {
      setError("");
      setLoaders({ ...loaders, verifyOtp: false });
      notifySuccess("OTP verified successfully");
      await createCart(dispatch);
      router.push(redirectUrl || "/");
    } else {
      console.log("response", response.error);
      setError(response.error);
      setLoaders({ ...loaders, verifyOtp: false });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOtpSent && resendOtpCooldown > 0) {
      timer = setInterval(() => {
        setResendOtpCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isOtpSent, resendOtpCooldown]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <div className="w-48 h-14 flex mb-4 top-12 justify-center items-center rounded-xl ">
            <img src={"/images/logo.png"} alt="logo" />
          </div>
        </div>

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md p-8 bg-white border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Log In</h2>
          <p className="mt-2 text-center text-gray-600">
            Enter your details to register and start to discover!
          </p>
          {error && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="w-full h-[60vh] flex flex-col justify-start mt-4">
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <ul
                  className="flex justify-center text-sm font-medium text-center"
                  role="tablist"
                >
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block px-6 py-1 rounded-md ${
                        activeTab === "email"
                          ? "text-white bg-webred"
                          : "hover:text-gray-600 hover:border-gray-300"
                      }`}
                      onClick={() => handleTabClick("email")}
                      role="tab"
                      aria-controls="email"
                      aria-selected={activeTab === "email"}
                    >
                      Email
                    </button>
                  </li>
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block px-6 py-1 rounded-md ${
                        activeTab === "mobile"
                          ? "text-white bg-webred"
                          : "hover:text-gray-600 hover:border-gray-300"
                      }`}
                      onClick={() => handleTabClick("mobile")}
                      role="tab"
                      aria-controls="mobile"
                      aria-selected={activeTab === "mobile"}
                    >
                      Mobile
                    </button>
                  </li>
                </ul>
              </div>
              <div id="centered-styled-tab-content" className="w-full">
                <div
                  className={`${
                    activeTab === "email" ? "block" : "hidden"
                  } p-4 rounded-lg `}
                  role="tabpanel"
                  id="styled-email"
                >
                  <>
                    <div className="w-full flex flex-col justify-start items-start">
                      <div className="w-full mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 required-label"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>

                        <input
                          type={"email" || "text"}
                          id="email"
                          className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Ex: Example412@gmail.com / Example412"
                          onChange={(e) => {
                            setError("");
                            setEmail(e.target.value);
                          }}
                          required
                        />
                      </div>
                      <div className="w-full mb-2 relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 required-label"
                        >
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="block bg-[#F4F4F5] w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                          placeholder="Enter your password"
                          onChange={(e) => {
                            setError("");
                            setPassword(e.target.value);
                          }}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() =>
                            router.push("/auth/user/reset-password")
                          }
                          className="text-sm text-[#65A30D] hover:underline focus:outline-none"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <span className="text-sm ">
                          Didn't have an account ?
                        </span>
                        <Link
                          className="text-blue-600 underline text-sm "
                          href={"/auth/user/signup"}
                        >
                          {" "}
                          Please signup
                        </Link>
                      </div>

                      {loaders.loader ? (
                        <button className="flex items-center rounded-md justify-center w-full px-4 py-2 bg-webgreen">
                          <Spinner color="current" />
                        </button>
                      ) : (
                        <button
                          className="flex items-center rounded-md justify-center w-full px-4 py-2 text-white bg-webgreen hover:bg-webgreenHover"
                          onClick={handleLogin}
                        >
                          Continue
                        </button>
                      )}
                    </div>
                    <div className="text-center font-semibold  my-2">OR</div>
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => {
                          handleLoginGoogle();
                        }}
                        type="button"
                        className="border border-gray-700 text-black bg-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center5 me-2 mb-2"
                      >
                        <img
                          className="w-6 h-6 mx-2"
                          src="data:image/png;base64,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"
                          alt="googleImage"
                        />
                        Sign in with Google
                      </button>
                    </div>
                  </>
                </div>
                <div
                  className={`${
                    activeTab === "mobile" ? "block" : "hidden"
                  } p-4 rounded-lg `}
                  role="tabpanel"
                  id="styled-mobile"
                >
                  <div className="w-full">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-1 text-sm font-medium text-gray-700 required-label"
                      >
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <div className="mb-4 flex justify-between items-center">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className=" px-4 py-2 sm:text-sm  bg-[#F4F4F5] border rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                          aria-label="Country code"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                        </select>
                        <input
                          type="text"
                          id="mobile"
                          className="block bg-[#F4F4F5] w-full px-4 py-2 border rounded-r-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Eg: +91 1234567890"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                        />
                      </div>
                      {phoneNumber &&
                        !isOtpSent &&
                        phoneNumber.length === 10 && (
                          <div className="flex justify-end items-center mb-2">
                            <button
                              className="px-2 py-1 text-white rounded-md bg-webgreen hover:bg-webgreen-light "
                              onClick={() => handleSendOtp()}
                            >
                              {loaders.sentOtp ? (
                                <ThreeDotsLoader />
                              ) : (
                                <span>Send OTP</span>
                              )}
                            </button>
                          </div>
                        )}
                      {isOtpSent && (
                        <div className="mb-2">
                          <div className="flex justify-start items-center mb-1">
                            Enter Otp :{" "}
                          </div>
                          <div className="flex justify-between mb-2 items-center border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-[#F4F4F5] ">
                            <input
                              type="text"
                              name="otp"
                              id="otp"
                              placeholder="Enter the OTP"
                              value={otp}
                              className="rounded-md w-full px-2 py-2"
                              onChange={(e) => setOtp(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-center items-center mb-4">
                            <button
                              className={`px-2 py-1 rounded-md ${
                                resendOtpCooldown > 0
                                  ? "text-black"
                                  : "bg-webgreen text-white hover:bg-webgreen-light"
                              }  `}
                              onClick={() => handleSendOtp()}
                              disabled={resendOtpCooldown > 0}
                            >
                              {resendOtpCooldown > 0
                                ? `Resend OTP in ${resendOtpCooldown}s`
                                : "Resend OTP"}
                            </button>
                          </div>
                        </div>
                      )}
                      <div id="recaptcha-container"></div>
                    </div>

                    {isOtpSent && (
                      <div className="flex justify-center items-center">
                        <button
                          disabled={isOtpSent ? false : true}
                          className={`px-4 py-2 rounded-md ${
                            isOtpSent
                              ? "bg-webgreen hover:bg-webgreen-light"
                              : "bg-red-300 hover:bg-red-400 "
                          }  text-white `}
                          onClick={() => {
                            handleVerifyOtp();
                          }}
                        >
                          {loaders.verifyOtp ? (
                            <ThreeDotsLoader />
                          ) : (
                            <span>Sign Up</span>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="flex justify-center gap-5 mt-2">
                      <div className="text-sm mx-2 ">
                        Didn't have an account.
                        <Link
                          className="text-blue-600 hover:underline focus:outline-none"
                          href={"/auth/user/signup"}
                        >
                          Please signUp
                        </Link>
                      </div>
                    </div>
                    <div className="text-center font-semibold  my-2">OR</div>
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => {
                          handleLoginGoogle();
                        }}
                        type="button"
                        className="border border-gray-700 text-black bg-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center5 me-2 mb-2"
                      >
                        <img
                          className="w-6 h-6 mx-2"
                          src="data:image/png;base64,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"
                          alt="googleImage"
                        />
                        Sign in with Google
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
