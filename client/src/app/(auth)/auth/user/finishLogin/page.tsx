"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifySignInEmailLink } from "@/utils/loginOptions";
import instance from "@/utils/axios";

const FinishLogin = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const completeLogin = async () => {
      const { status, error } = await verifySignInEmailLink();
      setLoading(false);

      console.log("status", status);
      if (status === "success") {
        setVerified(true);
        setError('');
      } else {
        setError(error || "Email verification failed");
      }
    };

    completeLogin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Finishing login...
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex justify-center items-center min-h-screen text-green-500">
        <h2>Successfully verified email</h2>
        <p>Now you can close this tab and return to the login page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {error}
      </div>
    );
  }

  return null;
};

export default FinishLogin;
