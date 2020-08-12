import React, {useContext, useEffect, useState} from "react";
import {Button, Divider} from 'antd';
import TokenTradeModal from "@/pages/Identity/components/TokenTradeModal";
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import {web3FromSource} from "@polkadot/extension-dapp";
import {transformParams, txErrHandler, txResHandler} from "@/components/TxButton/utils";
import styles from "../index.less";
import GroupSvg from "../assets/group.svg";

const AccountCard = () => {
  const {address} = useContext(AccountsContext);
  const {keyring} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const [balances, setBalances] = useState({token_balance: 0, token_stake: 0, token_vote: 0});
  const [total, setTotal] = useState(0);
  const [accountId, setAccountId] = useState('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');//bob
  const [amount_price, setAmountPrice] = useState(100);//alice

  const [accountPair, setAccountPair] = useState(null);
  const [status, setStatus] = useState(null);

  const [visible, setVisible] = useState(false);
  const [operation, setOperation] = useState(1);// 1兑换 2提示
  const [unsub, setUnsub] = useState(null);

  useEffect(() => {
    if (!keyring) return;
    setAccountPair(keyring.getPair(address));
  },[keyring]);

  useEffect( () => {
    if (!api || !address) return;
    let unsubscribeAll = null;
    api.query.tokenModule.balanceToken(address, (result) => {
      if (!result.isNone) {
        console.log(`Balance: ${result}`);
        setBalances(result.toJSON())
      }
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);
    return () => unsubscribeAll && unsubscribeAll();

  },[api, address]);

  useEffect(() => {
    if (!api || !address) return;
    let unsubscribeAll = null;
    api.query.tradeModule.currentRemainingBattery(address, (result) => {
      if (!result.isNone) {
        console.log(`Battery: ${result}`);
        setTotal(result.toNumber());
      }
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);
    return () => unsubscribeAll && unsubscribeAll();

  },[api, address]);

  const handleOnClick = (opera) => {
    setOperation(opera);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const getFromAcct = async () => {
    if (!accountPair) {
      console.log('No accountPair!');
      return ;
    }

    const {
      addr,
      meta: {source, isInjected}
    } = accountPair;
    let fromAcct;

    // signer is from Polkadot-js browser extension
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromAcct = addr;
      api.setSigner(injected.signer);
    } else {
      fromAcct = accountPair;
    }

    return fromAcct;
  };

  const signedTx = async (values) => {
    const paramFields = [true, true, true];
    const inputParams =
      [
        values.buy_token,
        accountId,
        values.amount_price,
      ];
    const fromAcct = await getFromAcct();
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters

    const txExecute = (operation === 1) ? (transformed
      ? api.tx.tokenModule.buytoken(...transformed)
      : api.tx.tokenModule.buytoken()) : transformed
      ? api.tx.tokenModule.selltoken(...transformed)
      : api.tx.tokenModule.selltoken();

    const unsu = await txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsu);
  };

  const handleSubmit = (values) => {
    console.log(values);
    setVisible(false);
    if (!api && !accountPair ) return;

    if (unsub) {
      unsub();
      setUnsub(null);
    }
    signedTx(values)
  };


  return (
    <div className={styles.accountCard}>
      <img alt="logo" className={styles.logo} src={GroupSvg} />
      <div className={styles.accountAddress}>
        <p>账户地址</p>
        <p>{address !== undefined ? address : '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'}</p>
      </div>
      <div className={styles.accountBalance}>
        <p>可用余额</p>
        <p>{balances.token_balance}</p>
      </div>
      <div className={styles.accountButtons}>
        <Button ghost size="middle" onClick={() => handleOnClick(1)}>
          充值
        </Button>
        <Divider orientation="center" type="vertical" style={{backgroundColor: 'white'}}/>
        <Button ghost size="middle" onClick={() => handleOnClick(2)}>
          提现
        </Button>
      </div>
      <div className={styles.totalBalance}>
        <p>总金额</p>
        <p>{balances.token_balance + balances.token_stake + balances.token_vote}</p>
      </div>
      <div className={styles.tradeBalance}>
        <p>交易冻结</p>
        <p>{balances.token_stake}</p>
      </div>
      <div className={styles.rollBalance}>
        <p>投票冻结</p>
        <p>{balances.token_vote}</p>
      </div>
      <div className={styles.eleNum}>
        <p>当前剩余电量</p>
        <p>{`${total} 度`}</p>
      </div>

      <TokenTradeModal
        visible={visible}
        operation={operation}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  )
};

export default AccountCard;
