"use client";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { useEffect } from "react";
import { getCartData } from "@/app/redux/feature/product/api";
import { getCurrCustomer } from "@/app/redux/feature/user/api";

export default function InitialLoad({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  console.log("InitialLoad");

  useEffect(() => {
    getCartData(dispatch);
    getCurrCustomer(dispatch);
  }, []);
  return children;
}
