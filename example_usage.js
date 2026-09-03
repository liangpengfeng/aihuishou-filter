/**
 * 爱回收筛选脚本 - 使用示例
 * 
 * 示例：筛选 iOS 17 的 iPhone 15 Pro
 */

const { main, matchesFilter, extractIOSVersion } = require('./aihuishou_filter');

// 自定义配置
const customConfig = {
  TARGET_IOS_VERSIONS: ['iOS 17', 'iOS 17.0', 'iOS 17.1', 'iOS 17.2', 'iOS 17.3', 'iOS 17.4'],
  TARGET_MODELS: ['iPhone 15 Pro', 'iPhone 15 Pro Max'],
  PRICE_RANGE: {
    min: 3000,
    max: 8000
  },
  MAX_ITEMS: 50,
  DELAY: 800
};

// 运行筛选
async function run() {
  console.log('开始筛选...\n');
  
  const results = await main.call(null, customConfig);
  
  console.log('\n筛选完成!');
  
  // 导出为 JSON
  const fs = require('fs');
  fs.writeFileSync('aihuishou_results.json', JSON.stringify(results, null, 2));
  console.log('结果已保存到 aihuishou_results.json');
}

run().catch(console.error);
