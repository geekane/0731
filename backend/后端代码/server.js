const express = require('express');
const cors = require('cors');
require('dotenv').config();

const feishuService = require('./services/feishuService');
const poorStoresService = require('./services/poorStoresService');
const authService = require('./services/authService');

const app = express();
const PORT = process.env.PORT || 4000;

// 中间件
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003', 'https://vakkrvxkxeee.us-east-1.clawcloudrun.com'], // 允许前端应用的域名
  credentials: true
}));

// 使用 express.json 和 express.urlencoded 中间件处理请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 设置响应头
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 处理请求体中的字符编码
app.use((req, res, next) => {
  // 处理请求体中的中文字符
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // 尝试解码
        try {
          const decoded = decodeURIComponent(req.body[key]);
          req.body[key] = decoded;
        } catch (e) {
          // 如果解码失败，保持原样
        }

        // 如果还是乱码，尝试使用Buffer处理
        if (req.body[key].includes('')) {
          try {
            const buffer = Buffer.from(req.body[key], 'latin1');
            req.body[key] = buffer.toString('utf8');
          } catch (e) {
            // 如果处理失败，保持原样
          }
        }
      }
    }
  }
  next();
});

// 处理查询参数中的中文字符
app.use((req, res, next) => {
  // 如果查询参数中有乱码，尝试解码
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      // 尝试解码
      try {
        const decoded = decodeURIComponent(req.query[key]);
        req.query[key] = decoded;
      } catch (e) {
        // 如果解码失败，保持原样
      }

      // 如果还是乱码，尝试使用Buffer处理
      if (req.query[key].includes('')) {
        try {
          const buffer = Buffer.from(req.query[key], 'latin1');
          req.query[key] = buffer.toString('utf8');
        } catch (e) {
          // 如果处理失败，保持原样
        }
      }
    }
  }
  next();
});

// 健康检查接口
app.get('/', (req, res) => {
  res.json({ message: '飞书多维表格数据服务已启动' });
});

// 获取表现较差门店的接口
app.get('/api/stats/poor-stores', async (req, res) => {
  try {
    // 设置请求编码
    req.setEncoding('utf8');

    let { threshold } = req.query;

    // 处理可能的编码问题
    if (threshold && typeof threshold === 'string' && threshold.includes('%')) {
      try {
        threshold = decodeURIComponent(threshold);
      } catch (e) {
        // 如果解码失败，保持原样
      }
    }

    // 默认参数
    const selectedMetric = '核销'; // 固定为核销指标
    const thresholdValue = threshold ? parseFloat(threshold) : -10000; // 修改默认阈值为-10000

    console.log('接收到请求，原始参数:', { threshold });
    console.log('处理后参数:', { selectedMetric, thresholdValue });

    // 检查参数有效性
    if (isNaN(thresholdValue)) {
      console.log('阈值参数无效:', threshold);
      return res.status(400).json({ error: '阈值参数无效' });
    }

    // 从飞书多维表格获取数据
    console.log('准备调用getStoreRecords函数');
    const records = await feishuService.getStoreRecords();
    console.log('getStoreRecords函数调用完成，records数量:', records.length, 'records:', records);

    // 筛选表现较差的门店
    const poorStores = poorStoresService.filterPoorStores(records, selectedMetric, thresholdValue);
    console.log('筛选后的门店数据:', poorStores);

    res.json(poorStores);
  } catch (error) {
    console.error('获取门店数据时出错:', error);
    res.status(500).json({ error: '获取门店数据失败' });
  }
});

// 添加一个测试接口，用于验证中文参数处理
app.get('/api/test-chinese', (req, res) => {
  const { text } = req.query;
  console.log('接收到中文参数:', text);
  res.json({ received: text });
});

// 添加一个测试接口，用于获取飞书多维表格的字段信息
app.get('/api/test-feishu-fields', async (req, res) => {
  try {
    // 从feishuService获取client
    const { client } = require('./services/feishuService');

    if (!client) {
      return res.status(500).json({ error: '飞书客户端未正确配置' });
    }

    // 先获取 tenant_access_token
    const tenantTokenResponse = await client.auth.tenantAccessToken.internal({
      data: {
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET
      }
    });

    console.log('获取tenant_access_token成功:', tenantTokenResponse);

    // 获取表格字段信息
    const response = await client.bitable.v1.appTableField.list({
      path: {
        app_token: process.env.FEISHU_APP_TOKEN,
        table_id: process.env.FEISHU_TABLE_ID,
      }
    });

    console.log('获取表格字段信息成功:', response);
    res.json(response);
  } catch (error) {
    console.error('获取表格字段信息时出错:', error);
    res.status(500).json({ error: '获取表格字段信息失败' });
  }
});

// 添加一个测试接口，用于获取用户表格的字段信息
app.get('/api/test-user-fields', async (req, res) => {
  try {
    // 从feishuService获取client
    const { client } = require('./services/feishuService');

    if (!client) {
      return res.status(500).json({ error: '飞书客户端未正确配置' });
    }

    // 先获取 tenant_access_token
    const tenantTokenResponse = await client.auth.tenantAccessToken.internal({
      data: {
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET
      }
    });

    console.log('获取tenant_access_token成功:', tenantTokenResponse);

    // 获取用户表格字段信息
    const response = await client.bitable.v1.appTableField.list({
      path: {
        app_token: process.env.FEISHU_APP_TOKEN,
        table_id: process.env.FEISHU_TABLE_ID2,  // 使用用户表格ID
      }
    });

    console.log('获取用户表格字段信息成功:', response);
    res.json(response);
  } catch (error) {
    console.error('获取用户表格字段信息时出错:', error);
    res.status(500).json({ error: '获取用户表格字段信息失败' });
  }
});

// 添加一个测试接口，用于获取用户记录
app.get('/api/test-user-records', async (req, res) => {
  try {
    // 从feishuService获取client
    const { client } = require('./services/feishuService');

    if (!client) {
      return res.status(500).json({ error: '飞书客户端未正确配置' });
    }

    // 先获取 tenant_access_token
    const tenantTokenResponse = await client.auth.tenantAccessToken.internal({
      data: {
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET
      }
    });

    console.log('获取tenant_access_token成功:', tenantTokenResponse);

    // 获取用户记录
    const response = await client.bitable.v1.appTableRecord.search({
      path: {
        app_token: process.env.FEISHU_APP_TOKEN,
        table_id: process.env.FEISHU_TABLE_ID2,  // 使用用户表格ID
      },
      data: {
        // 可以添加查询条件，或者不添加以获取所有记录
        // 只查询需要的字段
        fields: ['用户名', '登录密码', '门店名称'],
      },
      params: {
        // 添加参数以获取公式计算后的数据
        valueRenderOption: 'UnformattedValue'
      }
    });

    console.log('获取用户记录成功:', response);
    res.json(response);
  } catch (error) {
    console.error('获取用户记录时出错:', error);
    res.status(500).json({ error: '获取用户记录失败' });
  }
});

// 用户登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 添加调试日志
    console.log('接收到登录请求:', { username, password });

    // 调用认证服务进行用户验证
    const result = await authService.validateUserCredentials(username, password);

    // 添加调试日志
    console.log('认证服务返回结果:', result);

    if (result.success) {
      // 登录成功，返回用户信息
      res.json({
        success: true,
        user: {
          id: result.user.id,  // 使用认证服务返回的id
          name: result.user.name,    // 使用认证服务返回的name
          position: result.user.position || '门店经理' // 使用认证服务返回的position，如果没有则默认为门店经理
        }
      });
    } else {
      // 登录失败
      res.status(401).json({
        success: false,
        message: result.message || '用户名或密码错误'
      });
    }
  } catch (error) {
    console.error('登录时出错:', error);
    // 检查响应是否已经发送
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: '登录失败，请稍后重试'
      });
    }
  }
});

// 获取门店列表接口
app.get('/api/stores', async (req, res) => {
  try {
    console.log('接收到获取门店列表请求');
    
    // 从飞书多维表格获取数据
    const records = await feishuService.getStoreRecords();
    console.log('获取到门店记录:', records);
    
    // 转换数据格式
    const stores = records.map(record => ({
      id: record.record_id,
      name: record.fields['门店名称'] || '未知门店'
    }));
    
    console.log('转换后的门店数据:', stores);
    res.json(stores);
  } catch (error) {
    console.error('获取门店列表时出错:', error);
    // 出错时返回模拟数据
    const mockStores = [
      { id: 1, name: '北京朝阳门店' },
      { id: 2, name: '上海浦东门店' },
      { id: 3, name: '广州天河门店' },
      { id: 4, name: '深圳南山门店' }
    ];
    res.json(mockStores);
  }
});

// 获取查询选项列表接口
app.get('/api/queries', async (req, res) => {
  try {
    console.log('接收到获取查询选项列表请求');
    
    // 返回固定的查询选项列表
    const queries = [
      '销售额分析',
      '客流统计',
      '商品销售排行',
      '客单价分析',
      '时段分析',
      '员工绩效',
      '库存状况',
      '促销效果'
    ];
    
    console.log('返回查询选项:', queries);
    res.json(queries);
  } catch (error) {
    console.error('获取查询选项列表时出错:', error);
    // 出错时返回模拟数据
    const mockQueries = [
      '销售额分析',
      '客流统计',
      '商品销售排行'
    ];
    res.json(mockQueries);
  }
});

// 分析查询接口
app.post('/api/analyze', async (req, res) => {
  try {
    console.log('接收到分析查询请求:', req.body);
    
    const { storeId, storeName, query } = req.body;
    
    // 模拟分析结果
    const mockResults = {
      '销售额分析': `# ${storeName} 销售额分析\n\n## 总体情况\n本月销售额为 **¥125,680**，环比增长 **12.5%**。\n\n## 详细数据\n- 日均销售额: ¥4,189\n- 最高单日销售额: ¥6,540\n- 最低单日销售额: ¥2,890\n\n## 趋势分析\n销售额呈现稳步增长趋势，预计下月将继续保持增长。`,
      '客流统计': `# ${storeName} 客流统计\n\n## 总体情况\n本月客流量为 **8,542人次**，环比增长 **8.3%**。\n\n## 详细数据\n- 日均客流量: 285人次\n- 最高单日客流量: 420人次\n- 最低单日客流量: 180人次\n\n## 峰值分析\n周末客流量明显高于工作日，建议在周末增加人手。`,
      '商品销售排行': `# ${storeName} 商品销售排行\n\n## TOP 5 商品\n1. **游戏充值卡** - 销售额: ¥32,560\n2. **饮料小吃** - 销售额: ¥28,420\n3. **周边商品** - 销售额: ¥21,780\n4. **会员卡** - 销售额: ¥18,960\n5. **设备时长** - 销售额: ¥15,320\n\n## 分析\n游戏充值卡和饮料小吃是主要收入来源，建议加强这两类商品的推广。`
    };
    
    // 获取对应的分析结果，如果没有则使用默认结果
    const result = mockResults[query] || `# ${storeName} ${query}\n\n暂无详细分析数据，请稍后重试。`;
    
    console.log('返回分析结果');
    res.json({
      content: result
    });
  } catch (error) {
    console.error('分析查询时出错:', error);
    res.status(500).json({
      content: '# 分析失败\n\n抱歉，分析过程中出现错误，请稍后重试。'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
