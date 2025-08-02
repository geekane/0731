const lark = require('@larksuiteoapi/node-sdk');

// 检查环境变量
const checkEnvVariables = () => {
  const requiredVars = ['APP_ID', 'APP_SECRET', 'FEISHU_APP_TOKEN', 'FEISHU_TABLE_ID'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn('警告: 以下环境变量未设置:', missingVars);
    return false;
  }

  return true;
};

// 初始化飞书客户端
let client = null;
const envValid = checkEnvVariables();
console.log('环境变量检查结果:', envValid);
if (envValid) {
  try {
    client = new lark.Client({
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET,
      appType: lark.AppType.SelfBuild,
      domain: lark.Domain.Feishu,
    });
    console.log('飞书客户端初始化成功');
  } catch (error) {
    console.error('飞书客户端初始化失败:', error);
    client = null;
  }
} else {
  console.warn('飞书客户端未初始化，将使用模拟数据');
}
console.log('客户端初始化结果:', client);

/**
 * 获取门店记录数据
 * @returns {Promise<Array>} 门店记录数组
 */
async function getStoreRecords() {
  // 添加调试信息
  console.log('getStoreRecords called, client:', client, 'envValid:', envValid);

  // 如果没有正确配置飞书客户端，返回模拟数据
  if (!client || !envValid) {
    console.warn('飞书客户端未正确配置，返回模拟数据');
    const mockData = [
      {
        record_id: 'rec1',
        fields: {
          '门店名称': '暗影电竞馆A',
          '实际核销增加值': 800
        }
      },
      {
        record_id: 'rec2',
        fields: {
          '门店名称': '暗影电竞馆B',
          '实际核销增加值': 950
        }
      },
      {
        record_id: 'rec3',
        fields: {
          '门店名称': '暗影电竞馆C',
          '实际核销增加值': 750
        }
      }
    ];
    console.log('返回模拟数据:', mockData);
    return mockData;
  }

  try {
    // 添加调试信息
    console.log('准备调用飞书API，client.bitable:', client.bitable);

    // 先获取 tenant_access_token
    const tenantTokenResponse = await client.auth.tenantAccessToken.internal({
      data: {
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET
      }
    });

    console.log('获取tenant_access_token成功:', tenantTokenResponse);

    // 使用 tenant_access_token 调用多维表格 API
    const response = await client.bitable.v1.appTableRecord.search({
      path: {
        app_token: process.env.FEISHU_APP_TOKEN,
        table_id: process.env.FEISHU_TABLE_ID,
      },
      params: {
        // 添加参数以获取公式计算后的数据
        valueRenderOption: 'UnformattedValue'
      },
      data: {
        // 只查询需要的字段
        fields: ['门店名称', '实际核销增加值', '经营分变化'],
      },
      headers: {
        Authorization: `Bearer ${tenantTokenResponse.tenant_access_token}`
      }
    });

    // 添加调试信息
    console.log('飞书API调用成功，response:', response);

    // 返回记录数据
    const items = response.data.items || [];
    console.log('返回的实际数据:', items);
    return items;
  } catch (error) {
    console.error('获取飞书多维表格数据时出错:', error);
    // 出错时返回模拟数据
    const mockData = [
      {
        record_id: 'rec1',
        fields: {
          '门店名称': '暗影电竞馆A',
          '实际核销增加值': 800
        }
      },
      {
        record_id: 'rec2',
        fields: {
          '门店名称': '暗影电竞馆B',
          '实际核销增加值': 950
        }
      }
    ];
    console.log('出错时返回模拟数据:', mockData);
    return mockData;
  }
}

module.exports = {
  getStoreRecords,
  client,
};