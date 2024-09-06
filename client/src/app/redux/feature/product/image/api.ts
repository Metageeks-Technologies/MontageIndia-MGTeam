import instance from "@/utils/axios";
import { requestStart, requestFail, setImageData, setKeyWords } from "../slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifyError } from "@/utils/toast";
import { filerProductForUser } from "../api";

export const getImage = async (
  dispatch: AppDispatch,
  user: boolean,
  params: any
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`product/customer`, {
      params: { ...params },
    });
    console.log(data);
    dispatch(
      setImageData({
        data: filerProductForUser({ products: data.products, user }),
        totalNumOfPage: data.numOfPages,
        totalData: data.totalData,
      })
    );
    dispatch(setKeyWords(data.relatedKeywords));
  } catch (error) {
    const e = error as AxiosError;
    notifyError(e.message);
    console.error(e);
    dispatch(requestFail(e.message));
  }
};
