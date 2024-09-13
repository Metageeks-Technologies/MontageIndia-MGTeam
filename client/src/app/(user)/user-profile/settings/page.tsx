"use client";
import { FC, useState, useEffect } from "react";
import instance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import { Spinner } from "@nextui-org/react";
import {SpinnerLoader} from '@/components/loader/loaders';
import { FaCamera } from "react-icons/fa";
import { FileUploader } from "react-drag-drop-files";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
const fileTypes = ["JPG", "PNG", "JPEG"];
interface Subscription {
  PlanId: string;
  credits: number;
  planValidity: string;
  status: string;
  subscriptionId: string;
}

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  username: string;
  _id: string;
  subscription: Subscription;
}

interface Form {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSetting: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [formData, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch = useAppDispatch();
  const users = useAppSelector((state: any) => state.user);
  console.log("cuurent", users);

  const handleChange = (file: File) => {
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/user/getCurrent`);
      console.log("user", response);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setForm({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPassword({
          currentPassword: false,
          newPassword: false,
          confirmPassword: false,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch user data",
        text: "",
      });
    }
  };

  const getUploadUrl = async (fileName: string): Promise<string> => {
    if (!file) {
      return "";
    }
    console.log("file", file);
    try {
      const response = await instance.post<{ url: string }>(
        `/aws/getUploadRrl`,
        {
          folder: "userProfile",
          fileName: `${user?._id}`,
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  };

  const handleUpload = async (): Promise<boolean> => {
    if (!file) return false;
    try {
      const uploadUrl = await getUploadUrl(file.name);
      if (!uploadUrl || uploadUrl === "") return false;

      const res = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return res.status === 200;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  };

  const updateProfile = async () => {
    if (
      !formData.currentPassword &&
      !file &&
      !imagePreview &&
      formData.name === user?.name &&
      formData.email === user?.email &&
      formData.phone === user?.phone &&
      !formData.newPassword &&
      !formData.confirmPassword
    ) {
      return;
    }

    setUpdateLoader(true);
    try {
      let payload = {};
      if (
        formData.currentPassword &&
        formData.newPassword &&
        formData.confirmPassword
      ) {
        if (formData.newPassword === formData.confirmPassword) {
          payload = {
            ...payload,
            name: formData.name,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          };
        } else {
          setUpdateLoader(false);
          Swal.fire({
            icon: "error",
            title: "Confirm password does not match",
            text: "Please enter matching passwords",
          });
          return;
        }
      } else {
        payload = { ...payload, name: formData.name, email: formData.email,phone:formData.phone };
      }
      if (file) {
        await handleUpload();
        let path = `${process.env.NEXT_PUBLIC_AWS_PREFIX}/userProfile/${user?._id}`;
        console.log("path", path);
        payload = { ...payload, image: path };
      }

      const response = await instance.patch(`/user/update`, { ...payload });
      if (response.data && response.data.success) {
        fetchUser();
        Swal.fire({
          icon: "success",
          title: "Profile Updated Successfully",
          text: "",
        });
        setUpdateLoader(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update user data",
        text: "",
      });
      setUpdateLoader(false);
    }
  };

  useEffect(() => {
    fetchUser();
    getCurrCustomer(dispatch);
  }, []);

  return (
    <>
      <div className="w-full md:px-6 md:py-4 min-h-full flex flex-col rounded-lg overflow-hidden bg-white">
        <div className="mb-8">
          {/* Sidebar */}
          <h2 className="md:text-xl font-bold mb-2">Profile Settings</h2>
          <hr className="mb-4" />
          {loading && (
           <SpinnerLoader/>
          )}
          {!loading && user && (
            <>
              <div className="w-full min-h-fit mb-8 flex flex-col gap-4 justify-between items-center">
                <div className="w-full">
                  <div className=" md:bg-[#F1F1F1] min-h-fit flex flex-col md:flex-row gap-4 p-8 rounded-lg justify-start items-center">
                    <div className="relative z-10 flex justify-center items-center">
                      {file && imagePreview ? (
                        <div className="w-40 h-40 rounded-full overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={imagePreview}
                            alt="image"
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-full overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={user?.image}
                            alt={user?.name}
                          />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 cursor-pointer border-2 border-[#F1F1F1] px-2 py-2 rounded-full bg-webred text-white">
                        <FileUploader
                          handleChange={handleChange}
                          name="file"
                          types={fileTypes}
                        >
                          <FaCamera className="cursor-pointer" />
                        </FileUploader>
                      </div>
                    </div>
                    <div className="flex flex-col md:gap-2">
                      <div className="font-bold text-center md:text-start md:text-xl">
                        {user?.name}
                      </div>
                      <div className="text-gray-500 text-center md:text-start md:text-md ">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full  rounded-lg overflow-hidden">
                  <div className="w-full flex flex-col md:flex-row justify-between md:gap-4 items-center ">
                    <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                      <label className="text-black">Full Name</label>
                      <input
                        value={formData.name}
                        onChange={(e) =>
                          setForm({ ...formData, name: e.target.value })
                        }
                        type="text"
                        className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3">
                      <label className="text-black text-xm md:text-md">
                       Mobile
                      </label>
                      <input
                        value={formData.phone}
                        onChange={(e) =>setForm({ ...formData, phone: e.target.value })}
                        type="text"
                        className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col md:flex-row justify-between md:gap-4 items-center ">
                    <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                      <label className="text-black">Email</label>
                      <input
                        value={formData.email}
                        onChange={(e) =>
                          setForm({ ...formData, email: e.target.value })
                        }
                        type="email"
                        className="w-full border bg-[#F1F1F1] border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                    <div className="bg- w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                      <label className="text-black">Current Password</label>

                      <div className="w-full flex justify-between items-center border bg-[#F1F1F1] border-gray-300 rounded-lg">
                        <input
                          value={formData.currentPassword}
                          type={
                            showPassword.currentPassword ? "text" : "password"
                          }
                          onChange={(e) =>
                            setForm({
                              ...formData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full bg-transparent rounded-lg px-4 py-2"
                        />
                        <button
                          type="button"
                          className="px-2"
                          onClick={() => {
                            setShowPassword({
                              ...showPassword,
                              currentPassword: !showPassword.currentPassword,
                            });
                          }}
                        >
                          {showPassword.currentPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col md:flex-row justify-between md:gap-4 items-center ">
                    <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                      <label className="text-black">New Password</label>
                      <div className="w-full flex justify-between items-center border bg-[#F1F1F1] border-gray-300 rounded-lg">
                        <input
                          value={formData.newPassword}
                          type={showPassword.newPassword ? "text" : "password"}
                          onChange={(e) =>
                            setForm({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full bg-transparent rounded-lg px-4 py-2"
                        />
                        <button
                          type="button"
                          className="px-2"
                          onClick={() => {
                            setShowPassword({
                              ...showPassword,
                              newPassword: !showPassword.newPassword,
                            });
                          }}
                        >
                          {showPassword.newPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-start items-start px-4 py-3 ">
                      <label className="text-black">Confirm Password</label>
                      <div className="w-full flex justify-between items-center border bg-[#F1F1F1] border-gray-300 rounded-lg">
                        <input
                          value={formData.confirmPassword}
                          type={
                            showPassword.confirmPassword ? "text" : "password"
                          }
                          onChange={(e) =>
                            setForm({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full bg-transparent rounded-lg px-4 py-2"
                        />
                        <button
                          type="button"
                          className="px-2"
                          onClick={() => {
                            setShowPassword({
                              ...showPassword,
                              confirmPassword: !showPassword.confirmPassword,
                            });
                          }}
                        >
                          {showPassword.confirmPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center w-full px-4">
                  <button
                    type="submit"
                    onClick={() => {
                      updateProfile();
                    }}
                    className="bg-webred hover:bg-red-400 text-white px-4 py-2 rounded-lg"
                  >
                    {updateLoader ? "Updating..." : "Update Profile"}{" "}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSetting;
