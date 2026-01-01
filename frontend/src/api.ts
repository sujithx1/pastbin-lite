// frontend/src/api.ts

import { isAxiosError } from "axios";
import api from "./instance/axios";

export interface PasteResponse {
  id: string;
  url: string;
}

export interface PasteData {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export interface PasteOptions {
  content: string;
  ttl?: number;
  maxViews?: number;
}
export const createPaste = async ({ content, ttl, maxViews }:PasteOptions)=> {
  try {
    const res = await api.post("/pastes", {
      content: content.trim(),
      ttl_seconds: ttl,
      max_views: maxViews,
    });

    // Axios throws on non-2xx codes, so if we are here, res.data exists
    return res.data;
    
  } catch (error) {
    if(isAxiosError(error)){
      throw new Error(error.response?.data?.message || "Failed to create paste. Please try again.");
    }
    throw new Error("Failed to create paste. Please try again.");
  }
};

export const getPaste = async (id: string) => {
  try{
    const res = await api.get(`/pastes/${id}`);
  return res.data ;

  }catch (error) {
    if(isAxiosError(error)){
      throw new Error(error.response?.data?.message || "Failed to get paste. Please try again.");
    }
    throw new Error("Failed to get paste. Please try again.");
  }
};

// export const useHealthz = () => {
//   const getRedisPing = async (): Promise<AxiosResponse<HealthzResponse>> => {
//     return api.get<HealthzResponse>("/healthz");
//   };

//   return useQuery<
//     AxiosResponse<HealthzResponse>,
//     Error
//   >({
//     queryKey: ["healthz"],
//     queryFn: getRedisPing,
//   });
// };
