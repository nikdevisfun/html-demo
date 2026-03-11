const express = require('express');
const fs = require('fs');
const path = require('path');
const { scanDemos, getAllDemos, getDemo, getDemoPath, PROJECTS_DIR } = require('./database');

const app = express();
const PORT = 3200;

// 静态文件服务 - 公开 public 文件夹
app.use(express.static('public'));

// 静态文件服务 - projects 文件夹
app.use('/projects', express.static(PROJECTS_DIR));

// 静态文件服务 - 代理每个 demo 文件夹中的根目录资源
app.use((req, res, next) => {
  if (req.path.startsWith('/assets/') || req.path.startsWith('/images/') ||
      req.path.match(/\.(js|css|png|jpg|jpeg|svg|webp|gif|woff|woff2|ttf|eot|mp4|mp3|wav)$/i)) {
    // 尝试在各个 demo 文件夹中查找资源
    const demoFolders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('.'));

    for (const folder of demoFolders) {
      const filePath = path.join(PROJECTS_DIR, folder, req.path);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      }
    }
  }
  next();
});

// API: 获取所有 demo 列表
app.get('/api/demos', (req, res) => {
  const demos = getAllDemos();
  res.json(demos);
});

// API: 刷新 demo 列表（重新扫描）
app.post('/api/demos/refresh', (req, res) => {
  scanDemos();
  const demos = getAllDemos();
  res.json({ success: true, demos });
});

// 页面：索引页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Demo 资源文件代理 - /demo/:id/*
app.get(/^\/demo\/(\d+)\/(.*)$/, (req, res) => {
  const demoId = req.params[0];
  const resourcePath = req.params[1];

  const demo = getDemo(demoId);
  if (!demo) {
    return res.status(404).send('Demo not found');
  }

  const filePath = path.join(getDemoPath(demo.folder), resourcePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Resource not found');
  }
});

// 页面：预览 demo
app.get('/demo/:id', (req, res) => {
  const demo = getDemo(req.params.id);
  if (!demo) {
    return res.status(404).send('Demo not found');
  }

  const demoPath = path.join(getDemoPath(demo.folder), 'index.html');
  if (fs.existsSync(demoPath)) {
    let content = fs.readFileSync(demoPath, 'utf-8');

    // 注入 base 标签来修正资源路径
    const baseUrl = `/demo/${demo.id}/`;
    content = content.replace('<head>', `<head>\n    <base href="${baseUrl}">`);

    res.send(content);
  } else {
    res.status(404).send('Demo file not found');
  }
});

app.listen(PORT, () => {
  console.log(`Demo index server running at http://localhost:${PORT}`);
  console.log(`Found ${getAllDemos().length} demo(s)`);
});
