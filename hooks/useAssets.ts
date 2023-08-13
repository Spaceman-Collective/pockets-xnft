import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

// const account = "58Sz6sPcnbvTm7ChF8Zo4Sa6EDU7tbtDnFapuz2RQ1WP";
export const useAssets = (account: string = "") => {
  // const account = "";
  // console.log("aaaaa", params?.account);
  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account ?? "" }),
    { enabled: !!account }
  );
};
