const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');

let WebSocket = require("koa-websocket");

/* 实例化 WebSocket, 实例化储存所有上线文数组 并分配监听的端口 */
let wsapp = WebSocket(new Koa());
let ctxs = [];
let rooms = {};
wsapp.listen(8001);
const doudizhu = require('./doudizhu/index');

wsapp.ws.use((ctx, next) => {
  /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
  ctxs.push(ctx);
  ctx.websocket.on("message", (message) => {
      console.log(message);
      doudizhu.handleMessgae(message, ctx);      
  });
  ctx.websocket.on("close", (message) => {
      /* 连接关闭时, 清理 上下文数组, 防止报错 */
      let index = ctxs.indexOf(ctx);
      doudizhu.destoryRoom(ctx.roomId, ctx);
      ctxs.splice(index, 1);
  });
});

const index = require('./routes/index')
//const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//cors 支持跨域配置
app.use(cors({
    origin: function (ctx) {
        return 'http://localhost:8002'; // 这样就能只允许 http://localhost:8002 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 86400,//跨域请求的预请求，判断是否支持跨域时间为秒
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE','PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
