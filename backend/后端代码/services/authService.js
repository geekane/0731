const lark = require('@larksuiteoapi/node-sdk');

// 检查环境变量
const checkEnvVariables = () => {
  const requiredVars = ['APP_ID', 'APP_SECRET', 'FEISHU_APP_TOKEN', 'FEISHU_TABLE_ID', 'FEISHU_TABLE_ID2'];
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
 * 验证用户登录凭据
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<Object>} 验证结果
 */
async function validateUserCredentials(username, password) {
  // 添加调试信息
  console.log('validateUserCredentials called, client:', client, 'envValid:', envValid);
  console.log('用户名:', username, '密码:', password);

  // 如果没有正确配置飞书客户端，返回模拟数据
  if (!client || !envValid) {
    console.warn('飞书客户端未正确配置，使用模拟数据验证');
    // 模拟验证逻辑
    if (username === 'admin' && password === '123456') {
      return {
        success: true,
        user: {
          id: 1,
          name: '管理员',
          username: 'admin'
        }
      };
    }
    return {
      success: false,
      message: '用户名或密码错误'
    };
  }

  try {
    // 添加调试信息
    console.log('准备调用飞书API，client.bitable:', client.bitable);
    console.log('用户名:', username, '密码:', password);

    // 先获取 tenant_access_token
    const tenantTokenResponse = await client.auth.tenantAccessToken.internal({
      data: {
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET
      }
    });

    console.log('获取tenant_access_token成功:', tenantTokenResponse);

    // 使用 tenant_access_token 调用多维表格 API 查询用户信息
    // 假设我们有一个用户表，包含用户名和密码字段
    const response = await client.bitable.v1.appTableRecord.search({
      path: {
        app_token: process.env.FEISHU_APP_TOKEN,
        table_id: process.env.FEISHU_TABLE_ID2,  // 使用专门的用户表ID
      },
      data: {
        // 查询条件：用户名和密码匹配
        filter: {
          conjunction: "and",
          conditions: [
            {
              field_name: "用户名",
              operator: "is",
              value: [username]
            },
            {
              field_name: "登录密码",
              operator: "is",
              value: [password]
            }
          ]
        },
        // 只查询需要的字段
        fields: ['门店名称', '用户名', '昵称', '职位'],
      },
      params: {
        // 添加参数以获取公式计算后的数据
        valueRenderOption: 'UnformattedValue'
      }
    });

    // 添加调试信息
    console.log('飞书API调用成功，response:', response);

    // 检查是否有匹配的记录
    const items = response.data.items || [];
    console.log('返回的实际数据:', items);

    if (items.length > 0) {
      // 找到匹配的用户
      const userRecord = items[0];

      // 提取用户信息，处理可能的空值情况
      const username = userRecord.fields['用户名'] && userRecord.fields['用户名'][0] ?
        (userRecord.fields['用户名'][0].text || userRecord.fields['用户名'][0]) : '';
      const nickname = userRecord.fields['昵称'] && userRecord.fields['昵称'][0] ?
        (userRecord.fields['昵称'][0].text || userRecord.fields['昵称'][0]) : '';
      const position = userRecord.fields['职位'] && userRecord.fields['职位'][0] ?
        (userRecord.fields['职位'][0].text || userRecord.fields['职位'][0]) : '';

      return {
        success: true,
        user: {
          id: userRecord.record_id,
          name: nickname || username,  // 优先使用昵称，如果没有则使用用户名
          username: username,
          position: position
        }
      };
    } else {
      // 没有找到匹配的用户
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }
  } catch (error) {
    console.error('验证用户凭据时出错:', error);
    // 出错时返回模拟数据
    if (username === 'admin' && password === '123456') {
      return {
        success: true,
        user: {
          id: 1,
          name: '管理员',
          username: 'admin'
        }
      };
    }
    return {
      success: false,
      message: '验证过程中出现错误'
    };
  }
}

module.exports = {
  validateUserCredentials,
};