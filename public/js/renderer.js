/**
 * 渲染模块
 */

import { escapeHtml, formatDate } from './utils.js';

/**
 * 渲染 demo 列表
 */
export function renderDemos(demos) {
  const grid = document.getElementById('demosGrid');

  if (demos.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📁</div>
        <p>暂无 Demo，请确保 demo 文件夹中包含 index.html 文件</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = demos.map(demo => {
    const techStack = demo.tech_stack ? demo.tech_stack.split(',').map(t => t.trim()) : [];
    const techTags = techStack.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('');

    return `
    <div class="demo-card" data-demo-id="${demo.id}">
      <div class="demo-info">
        <span class="demo-folder">${demo.folder}</span>
        <div class="demo-name">${escapeHtml(demo.name)}</div>
        <div class="demo-description">${escapeHtml(demo.description || '暂无描述')}</div>
        <div class="demo-meta">
          <div class="tech-stack">${techTags}</div>
          <span class="demo-date">${formatDate(demo.updated_at)}</span>
        </div>
      </div>
    </div>
  `;
  }).join('');

  // 绑定点击事件
  document.querySelectorAll('.demo-card').forEach(card => {
    card.addEventListener('click', () => {
      const demoId = card.dataset.demoId;
      window.location.href = `/demo/${demoId}`;
    });
  });
}

/**
 * 更新统计数据
 */
export function updateStats(demos) {
  document.getElementById('totalDemos').textContent = demos.length;

  if (demos.length > 0) {
    const lastUpdate = demos.reduce((latest, demo) => {
      return new Date(demo.updated_at) > new Date(latest.updated_at) ? demo : latest;
    }).updated_at;
    document.getElementById('lastUpdated').textContent = formatDate(lastUpdate);
  } else {
    document.getElementById('lastUpdated').textContent = '-';
  }
}
