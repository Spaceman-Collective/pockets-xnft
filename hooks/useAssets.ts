import { fetchAssets } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useWeb3Auth } from "./useWeb3Auth";
import { useEffect, useState } from "react";

const walletaddress = "58Sz6sPcnbvTm7ChF8Zo4Sa6EDU7tbtDnFapuz2RQ1WP";

export const useAssets = () => {
  const [account, setAccount] = useState("");
  const { getAccounts } = useWeb3Auth();

  useEffect(() => {
    const init = async () => {
      const accounts = await getAccounts();
      accounts && setAccount(accounts[0]);
    };
    init();
  }, []);

  console.log({ account });
  return useQuery(["assets"], () =>
    fetchAssets({ walletAddress: account ?? "" })
  );
};
