"use client";

import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import instance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ThreeDotsLoader } from "@/components/loader/loaders";
import { useAppSelector } from "@/app/redux/hooks";

const onDemandPage = () => {
  const [loading, setLoading] = useState(false);
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const { user } = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    mediaType: "image",
    message: "",
  });
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      mediaType: "image",
      message: "",
    });
  }, [user]);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    mediaType: "",
    message: "",
    capValue: "",
  });
  const [isSubmited, setIsSubmited] = useState(false);
  const [capValue, setCapValue] = useState();
  const router = useRouter();

  const onCaptchaChange = (value: any) => {
    if (errors.capValue) setErrors({ ...errors, capValue: "" });
    setCapValue(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!capValue) {
      setErrors({ ...errors, capValue: "Please complete captcha" });
      return;
    }
    let hasError = false;
    const newErrors = { ...errors };

    // Check for empty fields
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key as keyof typeof errors] = `${key} is a required field`;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (!hasError) {
      try {
        setLoading(true);
        const response = await instance.post(
          "/user/onDemand/email",
          { ...formData },
          {
            withCredentials: true,
          }
        );
        console.log("email response", response);
        if (!response.data.success) {
          Swal.fire({
            icon: "error",
            title: "Error sending email",
            text: "Please try again later",
          });
          setLoading(false);
          return;
        }

        // Swal.fire({
        //   icon: "success",
        //   title: "Email sent successfully",
        //   text: "We will get back to you soon",
        // });
        setLoading(false);
        setIsSubmited(true);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Error sending email",
          text: "Please try again later",
        });
        return;
      }

      console.log("Form submitted:", formData);
      // You can also send the form data to your server here
      setFormData({
        name: "",
        phone: "",
        email: "",
        mediaType: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white">
      {isSubmited ? (
        <div className="h-screen flex justify-center items-center px-4">
          <div className="flex flex-col space-y-2 items-center text-center max-w-lg">
            <img src="/asset/Thank.svg" alt="Not Found" className="mb-4" />
            <h1 className="text-3xl md:text-4xl  font-semibold">
              Thank you for your subscription!
            </h1>
            <p className="text-sm md:text-base text-[#333333]">
              We just sent you a confirmation email.
              <br /> Check out your inbox.
            </p>
            <div className="py-3">
              <button
                className="bg-[#FE423F] py-2 px-6 md:py-2.5 md:px-8 text-[#ffff] rounded-md shadow-md"
                onClick={() => router.push("/")}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto my-10 p-6 bg-white rounded-lg shadow-md sm:w-1/2  w-full  ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Describe your need!</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-pageBg-light"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 9XXXXXXX56"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-pageBg-light"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-pageBg-light"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="subject" className="block font-medium">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full bg-pageBg-light border cursor-pointer rounded p-2.5"
                  value={formData.mediaType}
                  onChange={(e) =>
                    setFormData({ ...formData, mediaType: e.target.value })
                  }
                >
                  <option className="cursor-pointer" value="image">
                    Image
                  </option>
                  <option className="cursor-pointer" value="video">
                    Video
                  </option>
                  <option className="cursor-pointer" value="audio">
                    Audio
                  </option>
                </select>
                {errors.mediaType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mediaType}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2 mt-2">
              <label htmlFor="message" className="block font-medium">
                Describe your need <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-pageBg-light"
                rows={4}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
            <div className="col-span-2 mx-auto flex justify-center">
              <div className="d-flex mt-2 mb-2 flex-column align-items-center">
                <ReCAPTCHA
                  sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                  onChange={onCaptchaChange}
                />
                {errors.capValue && (
                  <p style={{ color: "#f56565" }}>{errors.capValue}</p>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <button
                disabled={loading}
                type="submit"
                className="justify-center mx-auto bg-webred text-white px-4 py-2 rounded"
              >
                {loading ? <ThreeDotsLoader /> : <span>Submit Now</span>}
              </button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default onDemandPage;
