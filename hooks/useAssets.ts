import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useWeb3Auth } from "./useWeb3Auth";

// const account = "58Sz6sPcnbvTm7ChF8Zo4Sa6EDU7tbtDnFapuz2RQ1WP";

export const useAssets = () => {
  const account = "";
  // console.log("Account: ", account);
  // const { account } = useWeb3Auth();
  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account ?? "" }),
    { enabled: !!account }
  );
};
