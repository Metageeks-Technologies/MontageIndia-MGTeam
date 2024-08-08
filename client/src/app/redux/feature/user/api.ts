import instance from "@/utils/axios";
import { setCurrUser,requestStart,requestFail } from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";


export const getCurrAdmin = async (dispatch: AppDispatch, id: string) => {

    dispatch(requestStart());
    try {

        const { data } = await instance.get(`/admin/getCurrUser?id=${id}`);
        dispatch(setCurrUser(data.user));

    } catch (error) {
        const e = error as AxiosError;
        dispatch(requestFail(e.message));
    }
}
