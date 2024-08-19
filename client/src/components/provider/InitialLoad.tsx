"use client";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { useEffect } from "react";
import { getCartData } from "@/app/redux/feature/product/api";
export default function InitialLoad({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  console.log("InitialLoad");

  useEffect(() => {
    getCartData(dispatch);
  }, []);
  return children;
}
