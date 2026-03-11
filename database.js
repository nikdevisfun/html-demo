const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 初始化数据库
const db = new Database('demos.db');

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS demos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    folder TEXT NOT NULL UNIQUE,
    description TEXT,
    tech_stack TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// demo 项目目录
const PROJECTS_DIR = path.join(__dirname, 'projects');

// 技术栈检测规则
function detectTechStack(doc) {
  const techStack = [];

  // 检查 script 标签
  const scripts = doc.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const src = script.getAttribute('src').toLowerCase();

    if (src.includes('react')) techStack.push('React');
    if (src.includes('vue')) techStack.push('Vue');
    if (src.includes('angular')) techStack.push('Angular');
    if (src.includes('jquery')) techStack.push('jQuery');
    if (src.includes('gsap')) techStack.push('GSAP');
    if (src.includes('three')) techStack.push('Three.js');
    if (src.includes('pixi')) techStack.push('PixiJS');
    if (src.includes('anime')) techStack.push('Anime.js');
    if (src.includes('chart')) techStack.push('Chart.js');
    if (src.includes('swiper')) techStack.push('Swiper');
    if (src.includes('remixicon')) techStack.push('RemixIcon');
    if (src.includes('fontawesome')) techStack.push('FontAwesome');
    if (src.includes('axios')) techStack.push('Axios');
    if (src.includes('alpine')) techStack.push('Alpine.js');
  });

  // 检查 link 标签 (CDN)
  const links = doc.querySelectorAll('link[href]');
  links.forEach(link => {
    const href = link.getAttribute('href').toLowerCase();

    if (href.includes('tailwind')) techStack.push('Tailwind');
    if (href.includes('bootstrap')) techStack.push('Bootstrap');
    if (href.includes('bulma')) techStack.push('Bulma');
  });

  // 检查内联代码特征
  const html = doc.documentElement.outerHTML.toLowerCase();

  if (html.includes('vanilla')) techStack.push('Vanilla JS');
  if (html.includes('canvas') && html.includes('ctx')) techStack.push('Canvas API');
  if (html.includes('webgl')) techStack.push('WebGL');
  if (html.includes('web audio')) techStack.push('Web Audio');
  if (html.includes('intersection observer')) techStack.push('Intersection Observer');
  if (html.includes('mutation observer')) techStack.push('Mutation Observer');

  // 如果没有检测到任何技术栈，默认使用 HTML/CSS
  if (techStack.length === 0) {
    techStack.push('HTML', 'CSS');
  } else if (!techStack.some(t => t.includes('HTML'))) {
    // 如果有 JS 框架但没有 HTML，添加 HTML
    techStack.unshift('HTML', 'CSS');
  }

  // 去重并限制数量
  return [...new Set(techStack)].slice(0, 4);
}

// 扫描目录中的所有 demo 文件夹
function scanDemos() {
  const demosDir = PROJECTS_DIR;
  const folders = fs.readdirSync(demosDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith('.'));

  const stmt = db.prepare(`
    INSERT INTO demos (name, folder, description, tech_stack)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(folder) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      tech_stack = excluded.tech_stack,
      updated_at = CURRENT_TIMESTAMP
  `);

  folders.forEach(folder => {
    const indexPath = path.join(demosDir, folder, 'index.html');
    let description = '';
    let name = folder;
    let techStack = '';

    if (fs.existsSync(indexPath)) {
      try {
        const html = fs.readFileSync(indexPath, 'utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // 尝试获取标题
        const titleEl = doc.querySelector('title');
        if (titleEl) {
          name = titleEl.textContent.trim();
        }

        // 尝试获取描述
        const metaDesc = doc.querySelector('meta[name="description"]');
        if (metaDesc) {
          description = metaDesc.getAttribute('content');
        } else {
          // 尝试从第一个 h1 或 p 获取描述
          const h1El = doc.querySelector('h1');
          const pEl = doc.querySelector('p');
          description = h1El ? h1El.textContent.trim() : (pEl ? pEl.textContent.trim().substring(0, 100) : '');
        }

        // 尝试获取技术栈（通过 meta 标签）
        const metaTech = doc.querySelector('meta[name="tech-stack"]') || doc.querySelector('meta[name="tech_stack"]');
        if (metaTech) {
          techStack = metaTech.getAttribute('content');
        } else {
          // 自动检测技术栈
          const detected = detectTechStack(doc);
          techStack = detected.join(', ');
        }
      } catch (e) {
        // 忽略解析错误
      }
    }

    stmt.run(name, folder, description, techStack);
  });

  // 清理不存在的 demo
  const deleteStmt = db.prepare(`DELETE FROM demos WHERE folder NOT IN (${folders.map(() => '?').join(',')})`);
  deleteStmt.run(...folders);
}

// 获取所有 demo
function getAllDemos() {
  return db.prepare('SELECT * FROM demos ORDER BY created_at DESC').all();
}

// 获取单个 demo
function getDemo(id) {
  return db.prepare('SELECT * FROM demos WHERE id = ?').get(id);
}

// 获取 demo 文件路径
function getDemoPath(folder) {
  return path.join(PROJECTS_DIR, folder);
}

// 同步扫描
scanDemos();

module.exports = {
  db,
  scanDemos,
  getAllDemos,
  getDemo,
  getDemoPath,
  PROJECTS_DIR
};
