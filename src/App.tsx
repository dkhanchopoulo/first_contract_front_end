import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from './hooks/useMainContract';
import { useTonConnect } from './hooks/useTonConnect';

import {fromNano} from 'ton-core'

function App() {

  const {
    contract_address, counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawal
  } = useMainContract();

  const { connected } = useTonConnect()


  return (
    <div>
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Bugs_Bunny.svg/270px-Bugs_Bunny.svg.png" alt="Dinosaur" />
      <div><text>"Hello Brothers of TON"</text>
      </div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>

          <h3>Contract Data:</h3>
          <b>Our contract Address:</b>
          <div className="Hint">{contract_address}</div>
          <hr />

          <b>Our contract Owner:</b>
          <div className="Hint">{owner_address?.toString()}</div>

          <hr />
          <b>Our contract Balance:</b>
          <div className='Hint'>{fromNano(contract_balance)} TON</div>
        </div>

        <div className='Card'>
          <b>Counter Value:</b>
          <div className='Hint'>{counter_value ?? "Loading"}</div>
        </div>
        <div>

        <div>
          <h3>Contract actions: </h3>
          {connected ? (
            <>
              <p>Increment contract counter by 1, with 0.05 TON as a comission</p>
              <button onClick={sendIncrement}>Increment</button>
              <hr />

              <p>Deposit contract balance by 1 TON</p>
              <button onClick={sendDeposit}>Deposit</button>
              <hr />

              <p>Withdrawal from contract balance by 0.5 TON</p>
              <button onClick={sendWithdrawal}>Withdrawal</button>
              <hr /> 
            </>
          ) : (
            <p>Connect wallet to start action</p>
          )}
        </div>
        </div>
      </div>
     
    </div>
    
  );
}

export default App