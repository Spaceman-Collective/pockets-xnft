import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "use-local-storage";

// const account = "58Sz6sPcnbvTm7ChF8Zo4Sa6EDU7tbtDnFapuz2RQ1WP";
export const useAssets = () => {
  // const account = "";
  // console.log("aaaaa", params?.account);
  const [account, setAccount] = useLocalStorage("account", "");

  return useQuery(
    ["assets"],
    () => fetchAssets({ walletAddress: account ?? "" }),
    { enabled: !!account }
  );
};
