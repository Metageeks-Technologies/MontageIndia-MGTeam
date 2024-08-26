import instance from "@/utils/axios";
import { requestStart, requestFail, setImageData, setKeyWords } from "../slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifyError } from "@/utils/toast";

export const getImage = async (dispatch: AppDispatch, params: any) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`product/customer`, {
      params: { ...params },
    });
    console.log(data);
    dispatch(
      setImageData({
        data: data.products,
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
