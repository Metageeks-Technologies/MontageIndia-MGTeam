import { useState, useEffect } from "react";
import instance from "../../utils/axios";
import { TAdmin } from "@/types/admin";

const useAdminAuth = () => {
  const [user, setUser] = useState<null | TAdmin>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        setUserLoading(true);
        const { data } = await instance.get(`/auth/admin/getCurrAdmin`);
        console.log("sds",data)
        setUser(data.user);
        setUserLoading(false);
      } catch (error) {
        console.log(error);
        setUserLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, userLoading, setUser };
};

export default useAdminAuth;