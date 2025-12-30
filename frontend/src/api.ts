// frontend/src/api.ts

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

export const createPaste = async (content: string, ttl?: number, maxViews?: number) => {
  const res = await api.post("/pastes", { content, ttl_seconds: ttl, max_views: maxViews });
  if (!res.data) throw new Error("Error creating paste");
  return res.data as Promise<PasteResponse>;
};

export const getPaste = async (id: string) => {
  const res = await api.get(`/pastes/${id}`);
  if (!res.data) throw new Error("Paste not found or expired");
  return res.data as Promise<PasteData>;
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
