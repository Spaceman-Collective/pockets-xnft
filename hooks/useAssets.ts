import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
const walletaddress = "58Sz6sPcnbvTm7ChF8Zo4Sa6EDU7tbtDnFapuz2RQ1WP";

export const useAssets = () => {
  return useQuery(["assets"], () =>
    fetchAssets({ walletAddress: walletaddress })
  );
};
