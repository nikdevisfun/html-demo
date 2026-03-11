/**
 * 主入口文件
 */

import { loadDemos, refreshDemos } from './api.js';
import { renderDemos, updateStats } from './renderer.js';
import { setRefreshButtonState } from './ui.js';

let demos = [];
let allDemos = [];

/**
 * 加载并渲染 demo 列表
 */
async function loadAndRender() {
  allDemos = await loadDemos();
  demos = allDemos;
  renderDemos(demos);
  updateStats(demos);
}

/**
 * 刷新 demo 列表
 */
async function handleRefresh() {
  setRefreshButtonState(true);

  try {
    allDemos = await refreshDemos();
    demos = allDemos;
    renderDemos(demos);
    updateStats(demos);
  } catch (error) {
    console.error('刷新失败:', error);
  } finally {
    setRefreshButtonState(false);
  }
}

/**
 * 搜索 demo
 */
function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();

  if (!query) {
    demos = allDemos;
  } else {
    demos = allDemos.filter(demo =>
      demo.name.toLowerCase().includes(query) ||
      demo.folder.toLowerCase().includes(query) ||
      (demo.description && demo.description.toLowerCase().includes(query))
    );
  }

  renderDemos(demos);
}

// 绑定刷新按钮事件
document.querySelector('.refresh-btn').addEventListener('click', handleRefresh);

// 绑定搜索输入事件
document.getElementById('searchInput').addEventListener('input', handleSearch);

// 初始加载
loadAndRender();
