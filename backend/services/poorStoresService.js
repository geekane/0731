/**
 * 筛选表现较差的门店
 * @param {Array} records - 从飞书多维表格获取的记录
 * @param {string} metric - 筛选指标（固定为"核销"）
 * @param {number} threshold - 阈值
 * @returns {Array} 筛选后的门店数据
 */
function filterPoorStores(records, metric, threshold) {
  // 只处理"实际核销增加值"字段
  return records
    .map(record => {
      // 从记录中提取需要的字段
      const fields = record.fields || {};

      // 处理门店名称，可能是一个包含text对象的数组
      let storeName = '未知门店';
      if (fields['门店名称']) {
        if (Array.isArray(fields['门店名称'])) {
          // 如果是数组，提取其中的text字段
          storeName = fields['门店名称'].map(item => {
            if (typeof item === 'object' && item.text) {
              return item.text;
            }
            return item;
          }).join('');
        } else if (typeof fields['门店名称'] === 'string') {
          // 如果是字符串，直接使用
          storeName = fields['门店名称'];
        } else if (typeof fields['门店名称'] === 'object' && fields['门店名称'].text) {
          // 如果是对象且有text字段
          storeName = fields['门店名称'].text;
        }
      }

      // 提取实际核销增加值字段
      let sales = 0;
      if (fields['实际核销增加值']) {
        // 如果是对象且包含value字段，则提取value
        if (typeof fields['实际核销增加值'] === 'object' && fields['实际核销增加值'].value !== undefined) {
          sales = fields['实际核销增加值'].value;
        } else if (typeof fields['实际核销增加值'] === 'object' && fields['实际核销增加值'].number !== undefined) {
          // 如果包含number字段
          sales = fields['实际核销增加值'].number;
        } else {
          // 其他情况直接使用值
          sales = fields['实际核销增加值'];
        }
      }

      // 提取经营分变化字段
      let visits = 0;
      if (fields['经营分变化']) {
        // 如果是对象且包含value字段，则提取value
        if (typeof fields['经营分变化'] === 'object' && fields['经营分变化'].value !== undefined) {
          visits = fields['经营分变化'].value;
        } else if (typeof fields['经营分变化'] === 'object' && fields['经营分变化'].number !== undefined) {
          // 如果包含number字段
          visits = fields['经营分变化'].number;
        } else {
          // 其他情况直接使用值
          visits = fields['经营分变化'];
        }
      }

      return {
        storeName,
        sales: parseFloat(sales).toFixed(1), // 保留1位小数
        visits: parseInt(visits) || 0, // 整数形式
      };
    })
    .filter(store => {
      // 过滤掉未知门店
      if (store.storeName === '未知门店') {
        return false;
      }

      // 筛选实际核销增加值低于阈值的门店
      return store.sales < threshold;
    })
    .sort((a, b) => {
      // 按实际核销增加值排序
      return a.sales - b.sales;
    });
}

module.exports = {
  filterPoorStores,
};
