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
    cover_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// 兼容已有数据库，确保新增字段存在
try {
  const columns = db.prepare(`PRAGMA table_info(demos);`).all();
  const hasCoverImage = columns.some(col => col.name === 'cover_image');
  if (!hasCoverImage) {
    db.exec(`ALTER TABLE demos ADD COLUMN cover_image TEXT;`);
  }
} catch (e) {
  // 忽略检查/迁移错误，避免影响主流程
}

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
    INSERT INTO demos (name, folder, description, tech_stack, cover_image)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(folder) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      tech_stack = excluded.tech_stack,
      cover_image = excluded.cover_image,
      updated_at = CURRENT_TIMESTAMP
  `);

  folders.forEach(folder => {
    const folderPath = path.join(demosDir, folder);
    const indexPath = path.join(folderPath, 'index.html');
    let description = '';
    let name = folder;
    let techStack = '';
    let coverImage = '';

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

    // 尝试为每个 demo 选择一个封面图片
    try {
      const preferredFiles = [
        'cover.png',
        'cover.jpg',
        'cover.jpeg',
        'cover.webp',
        'screenshot.png',
        'screenshot.jpg',
        'screenshot.jpeg',
        'screenshot.webp'
      ];

      for (const file of preferredFiles) {
        const candidatePath = path.join(folderPath, file);
        if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
          coverImage = `/projects/${folder}/${file}`;
          break;
        }
      }

      // 如果根目录没有指定封面，尝试使用 assets/images 中的第一张图片
      if (!coverImage) {
        const assetsImagesDir = path.join(folderPath, 'assets', 'images');
        if (fs.existsSync(assetsImagesDir) && fs.statSync(assetsImagesDir).isDirectory()) {
          const imageFiles = fs
            .readdirSync(assetsImagesDir)
            .filter(name => name.match(/\.(png|jpe?g|webp|gif|svg)$/i));
          if (imageFiles.length > 0) {
            const firstImage = imageFiles[0];
            coverImage = `/projects/${folder}/assets/images/${firstImage}`;
          }
        }
      }
    } catch (e) {
      // 忽略封面选择错误
    }

    stmt.run(name, folder, description, techStack, coverImage || null);
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
