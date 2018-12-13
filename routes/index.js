const router = require('koa-router')()

const multer = require('koa-multer');
const TravelAction = require('../controllers/travel');

var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
var upload = multer({ storage: storage });


router.get('/getTravelInfoById', async (ctx, next) => {
  ctx.body = {
    title: 'getTravelInfoById',
    dataList:[
	    {
	    	title:"banner1",
	    	imgUrl:"http://localhost:3000/images/banner1.png"
	    },
	     {
	    	title:"banner2",
	    	imgUrl:"http://localhost:3000/images/banner2.png"
	    },
	     {
	    	title:"banner2",
	    	imgUrl:"http://localhost:3000/images/banner3.png"
	    }
    ]
  }
})

router.post('/addTravelIndo', TravelAction.addTravelInfo)

router.get('/getTravelList', TravelAction.getTravelList)

router.post('/upload', upload.single('file'), async (ctx, next) => {
  ctx.body = "<script>document.domain='localhost';parent.window.setUrl('"+ctx.req.file.filename+"');</script>"
})

module.exports = router
