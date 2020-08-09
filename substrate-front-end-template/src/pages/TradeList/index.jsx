import React, {useState, useEffect, useContext} from 'react';
import {
  Card,
  Input,
  List,
  Radio,
  Button
} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {web3FromSource} from "@polkadot/extension-dapp";
import TradeListCell from "@/pages/TradeList/components/TradeListCell";
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import {transformParams, txErrHandler, txResHandler} from "@/components/TxButton/utils";
import OperationModal from './components/OperationModal';
import AddEditModal from "./components/AddEditModal";
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

const paginationProps = {
  showSizeChanger: true,
  showQuickJumper: true,
  pageSize: 5,
};

// const tmp = {
//   id: 0,
//   address: '5GgmNnKVdSRJqHmKttZrxWGdy5j1a6nU8oWWNKf7DffR6ssi',
//   logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
//   latest: '2020/07/22 12:00:00',
//   total: '12345.0',
//   name: '悦动水西门',
//   type: '光电',
//   canSell: '10000',
//   sellPrice: '1',
//   needBuy: '20000',
//   buyPrice: '0.8',
//   status: '营业中',
//   code: '100000',
//   loss: '0.1'
// };

// 字符串转16进制
function strToHexCharCode(str) {
  if(str === "")
    return "";
  const hexCharCode = [];
  hexCharCode.push("0x");
  for(let i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");
}

// 16进制转字符串
function hexCharCodeToStr(hexCharCodeStr) {
  const trimedStr = hexCharCodeStr.trim();
  const rawStr =
    trimedStr.substr(0,2).toLowerCase() === "0x"
      ?
      trimedStr.substr(2)
      :
      trimedStr;
  const len = rawStr.length;
  if(len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  let curCharCode;
  const resultStr = [];
  for(let i = 0; i < len;i += 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

let BusinessStatus = {
  "Closed": 0,
  "Opened": 1
}

const convert = (from, to) => str => Buffer.from(str, from).toString(to);
const utf8ToHex = convert('utf8', 'hex');
const hexToUtf8 = convert('hex', 'utf8');

export const TradeList = () => {
  const [visible, setVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [operation, setOperation] = useState(1);// 1购买 2出售
  const [addEdit, setAddEdit] = useState(1);// 1新增 2编辑
  const [unsub, setUnsub] = useState(null);

  const [count, setCount] = useState();
  const [dataSource, setDataSource] = useState([]);
  const {address,keyring} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const [accountPair, setAccountPair] = useState(null);

  useEffect(() => {
    if (!keyring && !address) return;
    setAccountPair(keyring.getPair('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'));
  },[keyring]);

  useEffect(() => {
    if (!api || !address) return;

    api.query.tradeModule.vppCounts('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', (result) => {
      if (!result.isNone) {
        console.log(`电厂数量：${result.toNumber()}`);
        setCount(result.toNumber());
      }
    });

  },[api]);

  useEffect(() => {
    if (!api || !count) return;
    const source = [];
    for (let i=0; i<count; i++ ) {
      api.query.tradeModule.vppList(['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',0], (result) => {
        if (!result.isNone) {
          const data = result.toJSON();
          console.log(JSON.stringify(data));
          source.push({
            id: i,
            address: '5GgmNnKVdSRJqHmKttZrxWGdy5j1a6nU8oWWNKf7DffR6ssi',
            logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
            latest: '2020/08/08 20:00:00',
            total: '10000',
            name: '成都发电厂',
            type: '光电',
            canSell: '10000',
            sellPrice: '1',
            needBuy: '10000',
            buyPrice: '1',
            status: '营业中',
            code: '100000',
            loss: '1'
          });
        }
      });
      setTimeout(function () {
        setDataSource(source);
      }, 500*count);
    }
    setTimeout(function () {
      setDataSource(source);
    }, 500*count);
  }, [count, api]);

  const showBuyModal = (item) => {
    setOperation(1);
    setVisible(true);
  };

  const showSellModal = (item) => {
    setOperation(2);
    setVisible(true);
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">营业中</RadioButton>
        <RadioButton value="waiting">歇业中</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入邮编进行搜索" onSearch={() => ({})}/>
      <Button type="primary" onClick={() => {
        setAddEdit(1);
        setVisibleModal(true);
      }}>
        新增电厂
      </Button>
    </div>
  );

  // 购买出售
  const handleOpeationCancel = () => {
    setVisible(false);
  };

  const handleOpeationSubmit = values => {
    console.log(values);
    setVisible(false);
  };

  // 新增电厂
  const handleCancel = () => {
    setVisibleModal(false);
  };

  const handleSubmit = async (values) => {
    console.log(values);
    setVisibleModal(false);
    if (!api && !accountPair ) return;

    const param = transformParams(
      [true, true, true, true, true, true, true, true, true, true, true],
      [
        values.name,
        values.pre_total_stock,
        values.sold_total,
        true,
        values.energy_type,
        values.buy_price,
        values.sell_price,
        values.post_code,
        values.transport_lose,
        "Opened",
        values.device_id
      ]
    );

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

    const unsub = await api.tx.tradeModule.createvpp(...param).signAndSend(fromAcct, txResHandler).catch(txErrHandler);
    setUnsub(() => unsub);
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title=""
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              pagination={paginationProps}
              dataSource={dataSource}
              renderItem={item => (
                <TradeListCell
                  item={item}
                  admin={address && address === item.address}
                  buyClick={() => {
                    showBuyModal(item);
                  }}
                  sellClick={() => {
                    showSellModal(item)
                  }}
                  editClick={() => {
                    setAddEdit(2);
                    setVisibleModal(true);
                  }}
                  closeClick={() => {
                  }}
                />
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        visible={visible}
        operation={operation}
        onCancel={handleOpeationCancel}
        onSubmit={handleOpeationSubmit}
      />
      <AddEditModal
        visible={visibleModal}
        addEdit={addEdit}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default TradeList;
