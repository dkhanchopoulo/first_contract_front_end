import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";

import { Address, OpenedContract, toNano } from "ton-core";

import { useTonConnect } from "./useTonConnect";


export function useMainContract() {
    const client = useTonClient();
    const [contractData, setContractData] = useState<null | {
      counter_value: number;
      recent_sender: Address;
      owner_address: Address;
    }>();

    const {sender} = useTonConnect();
    
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    const [balance, setBalance] = useState<null | number>(0);


    const mainContract = useAsyncInitialize(async () => {
      if (!client) return;
      const contract = new MainContract(
        Address.parse("EQCD5XkVYvV98w5YQbr9SA8PgALozUowbgpn7SORtOBIpmki") // replace with your address from tutorial 2 step 8
      );
      return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);
  
    useEffect(() => {
      async function getValue() {
        if (!mainContract) return;
        setContractData(null);
        const val = await mainContract.getData();
        const contractBalance = await mainContract.getBalance();

        setContractData({
          counter_value: val.number,
          recent_sender: val.recent_sender,
          owner_address: val.owner_address,
        });

        setBalance(contractBalance.number);


        await sleep(5000);
        await getValue();
      }
      getValue();
    }, [mainContract]);
  
    return {
      
      contract_address: mainContract?.address.toString(),
      contract_balance: balance,

      sendIncrement: () => {
        return mainContract?.sendIncrement(sender, toNano(0.05), 1);
      },

      sendDeposit: () => {
        return mainContract?.sendDeposit(sender, toNano(1.0));
      },

      sendWithdrawal: () => {
        return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(0.5));
      },
      ...contractData,
    };
  }
  