// eslint-disable-next-line import/no-extraneous-dependencies
// 账户地址
const address = [
  '12d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU',
  '15d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU',
  '17d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU',
  '16d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU',
  '18d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU',
];
// logo
const logo = [
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];
// 最近成交时间
const latest = [
  '2020/07/22 12:00:00',
  '2020/07/22 13:00:00',
  '2020/07/22 14:00:00',
  '2020/07/22 15:00:00',
  '2020/07/22 16:00:00',
];

// 成交额
const total = [
  '68000.0',
  '81212.0',
  '12345.0',
  '3456.0',
  '68798.0',
];
// 名字
const name = [
  '玄武区虚拟电厂',
  '秦淮区虚拟电厂',
  '雨花区虚拟电厂',
  '江宁区虚拟电厂',
  '浦口区虚拟电厂',
];

// type 1风电 2光电 3热电
const type = [
  '2',
  '1',
  '2',
  '3',
  '1',
];

// 可销售度数
const canSell = [
  '16000',
  '17000',
  '2000',
  '50000',
  '2345',
];

// 销售价格
const sellPrice = [
  '1.68',
  '1.68',
  '1.66',
  '1.67',
  '1.66',
];

// 需购买度数
const needBuy = [
  '16000',
  '17000',
  '2000',
  '50000',
  '2345',
];

// 购买价格
const buyPrice = [
  '1.58',
  '1.59',
  '1.56',
  '1.58',
  '1.55',
];

// 状态 1 营业中 2 歇业中
const status = [
  '1',
  '1',
  '2',
  '1',
  '1',
];

// 邮编
const code = [
  '210000',
  '100000',
  '100001',
  '100002',
  '100004',
];

// 线损
const loss = [
  '1',
  '2',
  '3',
  '4',
  '5',
];

function fakeList(count) {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      address: address[i],
      logo: logo[i],
      latest: latest[i],
      total: total[i],
      name: name[i],
      type: type[i],
      canSell: canSell[i],
      sellPrice: sellPrice[i],
      needBuy: needBuy[i],
      buyPrice: buyPrice[i],
      status: status[i],
      code: code[i],
      loss: loss[i],
    });
  }

  return list;
}

let sourceData = [];

function getFakeList(req, res) {
  const params = req.query;
  const count = params.count * 1 || 20;
  const result = fakeList(count);
  sourceData = result;
  return res.json(result);
}

export default {
  'GET  /api/fake_list': getFakeList,
};
