import instance from "@/utils/axios";
import { requestStart, requestFail, setAudioData } from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifyError } from "@/utils/toast";

export const getAudio = async (dispatch: AppDispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`product/customer`, {
      params: { mediaType: "audio" },
    });
    console.log(data);
    dispatch(
      setAudioData({
        audioData: data.products,
        totalNumOfPage: data.numOfPages,
        totalAudioData: data.totalData,
      })
    );
  } catch (error) {
    const e = error as AxiosError;
    notifyError(e.message);
    console.error(e);
    dispatch(requestFail(e.message));
  }
};
