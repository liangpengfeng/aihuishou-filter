#!/usr/bin/env node
/**
 * 爱回收 iPhone 筛选脚本 (Quantumult X / Surge)
 * 
 * 功能：筛选指定 iOS 版本的 iPhone
 */

const CONFIG = {
  BASE_URL: 'https://www.iaihuishou.com',
  TARGET_IOS_VERSIONS: ['iOS 17', 'iOS 16'],
  TARGET_MODELS: [],
  PRICE_RANGE: { min: 0, max: 10000 },
  MAX_ITEMS: 100,
  DELAY: 500,
  PAGE_SIZE: 20
};

console.log('=== 爱回收 iPhone 筛选脚本 ===');
console.log('目标版本:', CONFIG.TARGET_IOS_VERSIONS.join(', '));

module.exports = { CONFIG };
