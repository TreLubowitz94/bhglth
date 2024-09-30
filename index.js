const axios = require('axios');
const moment = require('moment-timezone');
const http = require('http');
const cron = require('node-cron');
const port = process.env.PORT || 7860;           

// 添加24小时是不间断访问的url数组
const webpages = [
  'https://materialistic-lead-quartz.glitch.me',   //
  'https://south-skinny-banana.glitch.me',    //
  'https://longhaired-loud-utahceratops.glitch.me',    //
  'https://scratched-neon-thunbergia.glitch.me',    //
  'https://eager-torch-cerise.glitch.me',    //
  'https://held-valley-chevre.glitch.me',    //
  'https://tested-sleet-moustache.glitch.me',    //
  'https://comfortable-scratch-basil.glitch.me',    //
  'https://keen-sepia-notify.glitch.me',    //
  'https://temporal-longhaired-taxicab.glitch.me',
  // ... 添加更多url
];

// 添加1:00-6:00暂停，其他时间正常访问的url数组
const urls = [
  'https://www.google.com',  // 备注名称
  'https://www.baidu.com',
  // ... 添加更多url
];

// 遍历网页数组并发请求访问网页
const visit = async (url) => {
  try {
    const response = await axios.get(url);
    console.log(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Visited web successfully: ${url} --- Status: ${response.status}\n`);
  } catch (error) {
    console.error(`Failed to visit ${url}: ${error.message}\n`);
  }
};
const visitAll = async () => {
  for (let url of urls) {
    await visit(url);
  }
};

// 定判断是否在访问时间段内
const isWithinTime = () => {
  const now = moment().tz('Asia/Hong_Kong');
  const hour = now.hour();
  if (hour >= 1 && hour < 6) {
    return false;
  }
  return true;
};

// 创建http服务
const createServer = () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello world!');
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
    }
  });
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

// 执行访问逻辑
const main = async () => {
  createServer();
  setInterval(async () => {
    if (isWithinTime()) {
      await visitAll();
    } else {
      console.log(`Stop visiting at ${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')}`);
    }
  }, 2 * 60 * 1000); // 指定时间段访问的间隔2分钟
};
main();

//24小时不间断访问部分
async function access(url) {
  try {
    const response = await axios.get(url);
    console.log(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Web visited successfully: ${url} --- status：${response.status}`);
  } catch (error) {
    console.error(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Failed to visit ${url}, Error ${error.message}`);
  }
}

async function batchVisit() {

  for (let url of webpages) {
    await access(url);
  }
}
cron.schedule('*/2 * * * *', batchVisit); // 24小时访问任务间隔周期，默认2分钟
