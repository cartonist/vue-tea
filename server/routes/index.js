var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')
var user = require('../db/userSql.js')
var dayjs = require('dayjs')
// 获取数据库连接
var connection = require('../db/sql.js')
var QcloudSms = require("qcloudsms_js");
const { query } = require('../db/sql.js');
const alipaySdk = require('../db/alipay.js')
const AlipayFormData = require('alipay-sdk/lib/form').default
var axios = require('axios')

// 判断token是否过期
function getTimeToken( exp ){
  // 获取时间戳，精确到秒
  let getTime = parseInt(new Date().getTime()/1000)
  console.log(getTime, exp)
  if (getTime - exp > 3600) {
    return true;
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 查询交易的状态
router.post('/successPayment', function(req, res, next) {
  // token
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)
  // 订单号
  let out_trade_no = req.body.out_trade_no
  let trade_no = req.body.trade_no

  const formData = new AlipayFormData()
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get')
  // 支付时的信息
  formData.addField('bizContent', {
    out_trade_no,
    trade_no
  })
  const result = alipaySdk.exec(
    'alipay.trade.query',
    {},
    { formData: formData },
  )
  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }
  // 后端请求支付宝
  result.then(resData => {
    axios({
      url: resData,
      method: 'GET'
    }).then(data => {
      let responseCode = data.data.alipay_trade_query_response
      if(responseCode.code == '10000') {
        // 请求成功
        switch( responseCode.trade_status ) {
          case 'WAIT_BUYER_PAY':
            res.send({
              data: {
                code: 0,
                data: {
                  msg: '支付宝有交易记录，没付款'
                }
              }
            })
          break
          case 'TRADE_FINISHED':
            connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
              // 获得用户id
              let uid = results[0].id
              // 修改订单状态 2 => 3
              connection.query(`update tea_order set order_status = '3' where uid = '${uid}' and order_id = '${out_trade_no}'`, function(err, results) {
              })
            })
            res.send({
              data: {
                code: 1,
                data: {
                  msg: '交易完成'
                }
              }
            })
          break
          case 'TRADE_SUCCESS':
            connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
              // 获得用户id
              let uid = results[0].id
              // 修改订单状态 2=> 3
              connection.query(`update tea_order set order_status = '3' where uid = '${uid}' and order_id = '${out_trade_no}'`, function(err, results) {
              })
            })
            res.send({
              data: {
                code: 2,
                data: {
                  msg: '交易成功'
                }
              }
            })
          break
          case 'TRADE_CLOSED':
            res.send({
              data: {
                code: 3,
                data: {
                  msg: '交易关闭'
                }
              }
            })
          break
        }
      } else if ((responseCode.code == '40004')) {
        res.send({
          data: {
            code: 4,
            data: {
              msg: '交易不存在'
            }
          }
        })
      }
    }).catch( err => {
      res.send({
        data: {
          code: 500,
          data: {
            msg: '交易失败',
            err
          }
        }
      })
    })
  })
  
})

// 发起支付
router.post('/payment', function(req, res, next) {
  let orderId = req.body.orderId
  let name = req.body.name
  let price = req.body.price

  const formData = new AlipayFormData()
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get')
  // 支付时的信息
  formData.addField('bizContent', {
    outTradeNo: orderId,
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: price,
    subject: name,
    // body: '商品详情',
  })
  // 支付成功或失败跳转的连接
  formData.addField('returnUrl', 'http://127.0.0.1:5173/#/payment')

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  const result = alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData },
  )
  // 对接支付宝成功，支付宝方返回的数据
  result.then(ress => {
    res.send({
      data: {
        code: 200,
        success: true,
        msg: '支付中',
        // 支付宝方返回的URL
        paymentUrl: ress
      }
    })
  })
  
})

// 修改订单状态
router.post('/submitOrder', function(req, res, next) {
  // token
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)
  // 订单号
  let orderId = req.body.orderId
  // 购物车列表
  let shopArr = req.body.shopArr

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uid = results[0].id
    // 修改订单状态
    connection.query(`update tea_order set order_status = '2' where uid = '${uid}' and order_id = '${orderId}'`, function(err, results) {
      // 删除购物车数据
      shopArr.forEach(id => {
        connection.query(`delete from goods_cart where id = ${id}`, function(e, r) {
        })
      })
      res.send({
        data: {
          code: 200,
          success: true,
          msg: '订单提交成功'
        }
      })
    })
  })
})

// 查询订单
router.post('/selectOrder', function(req, res, next) {
  let orderId = req.body.orderId

  connection.query(`select * from tea_order where order_id = ${orderId}`, function(err, results) {
    res.send({
      data: {
        code: 200,
        data: results
      }
    })
  })
})

// 生成订单
router.post('/addOrder', function(req, res, next) {
  // token
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)
  // 前端传给后端的数据
  let arr = req.body.arr
  // 生成订单号，规则：时间戳+6位随机数
  let unix = dayjs().unix() 
  let orderCode = unix.toString() + Math.round(Math.random()*1000000).toString()
  /**
   * 未支付：1
   * 待支付：2
   * 成功支付：3
   * 失败支付：4 | 0
   */
  // 订单商品名称
  let goodsName = []
  // 订单价格
  let goodsPrice = 0
  // 订单数量
  let goodsNum = 0
  arr.forEach( item => {
    goodsName.push(item.goods_name)
    goodsPrice += item.goods_price * item.goods_num
    goodsNum += parseInt(item.goods_num)
  });

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  // 查询当前用户
  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uid = results[0].id
    // 生成订单项
    connection.query(`insert into tea_order(uid, order_id, goods_name, goods_num, order_status, goods_price) values('${uid}', ${orderCode}, '${goodsName}', '${goodsNum}', '1', '${goodsPrice}')`, function(err, results) {
      // 返回订单：根据uid和订单状态order_status查询
      connection.query(`select * from tea_order where uid = '${uid}' and order_id = ${orderCode}`, function(e, r) {
        res.send({
          data: {
            code: 200,
            data: r
          }
        })
      })
    })
  })
})

// 删除收货地址
router.post('/delAddr', function(req, res, next) {
  let id = req.body.id;
  connection.query(`delete from address where id = ${id}`, function(err, results) {
    res.send({
      data: {
        success: true,
        msg: '删除成功'
      }
    })
  })
})

// 修改收货地址
router.post('/editAddr', function(req, res, next) {
  // token
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)
  // 前端传给后端的数据
  let { id, name, tel, city, county, province, isDefault, addressDetail,areaCode } = req.body

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  // 查询当前用户
  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uid = results[0].id
    if( isDefault == '1') {
      // 统一清除默认地址
      connection.query(`update address set isDefault = "0" where uid = "${uid}"`)
    }
    // 修改地址
    connection.query(`update address set name = "${name}", tel = "${tel}", city = "${city}", county = "${county}", province = "${province}", isDefault = "${isDefault}", addressDetail = "${addressDetail}", areaCode = "${areaCode}" where id = ${id}`, function(err, results) {
      res.send({
        data: {
          success: true,
          msg: '添加成功'
        }
      })
    })
  })
})

// 查询收货地址
router.post('/getAddr', function(req, res, next) {
  // token
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  // 查询当前用户
  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uid = results[0].id
    connection.query(`select * from address where uid = "${uid}"`, function(err, results) {
      res.send({
        data: {
          success: true,
          msg: '查询成功',
          data: results
        }
      })
    })
  })

})

// 新增收货地址
router.post('/addAddr', function(req, res, next) {
  // token
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)

  // 前端传给后端的数据
  let { name, tel, city, county, province, isDefault, addressDetail,areaCode } = req.body

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  // 查询当前用户
  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uid = results[0].id
    if( isDefault == '1') {
      connection.query(`update address set isDefault = "0" where uid = "${uid}"`)
    }
    connection.query(`insert into address(uid, name, tel, city, county, province, isDefault, addressDetail, areaCode) values("${uid}","${name}","${tel}","${city}","${county}","${province}","${isDefault}","${addressDetail}", "${areaCode}")`, function(err, results) {
      res.send({
        data: {
          success: true,
          msg: '添加成功'
        }
      })
    })
  })
})

// 修改购物项的数量
router.post('/updateNum', function(req, res, next) {
  let { id, num } = req.body
  connection.query(`update goods_cart set goods_num = "${num}" where id = ${id}`, function(err, results) {
    res.send({
      code: 200,
      data: {
        success: true,
        msg: '修改成功'
      }
    })
  })
})

// 删除购物车
router.post('/delCarts', function(req, res, next) {
  // 待删除的购物项id数组
  let arrId = req.body.arrId
  console.log(arrId)
  // 逐行删除
  for(let i = 0; i < arrId.length; i++) {
    connection.query(`delete from goods_cart where id = ${arrId[i]}`, function(err, results) {
    })
  }
  res.send({
    data: {
      code: 200,
      msg: '删除成功',
      success: true
    }
  })
})

// 查询购物车
router.post('/selectCart', function(req, res, next) {
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)

  // if( getTimeToken(tokenObj.exp) ) {
  //   // token已经过期
  //   res.send({
  //     data: {
  //       code: 1000
  //     }
  //   })
  //   return
  // }

  // 查询当前用户
  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uId = results[0].id
    connection.query(`select * from goods_cart where uid = "${uId}"`, function(err, results) {
      res.send({
        code: 200,
        data: results
      })
    })
  })
})

// 添加购物车
router.post('/addCart', function(req, res, next) {
  let token = req.headers.token
  // token解析
  let tokenObj = jwt.decode(token)
  let goodsId = req.body.id

  // console.log(parseInt( new Date().getTime() / 1000 ), tokenObj.exp)
  if( getTimeToken(tokenObj.exp) ) {
    // token已经过期
    res.send({
      data: {
        code: 1000
      }
    })
    return
  }

  // 查询当前用户
  connection.query(`select * from user where tel = ${tokenObj.username}`, function(err, results) {
    // 获得用户id
    let uId = results[0].id
    // 查询要加入购物车的商品
    connection.query(`select * from goods_list where id = ${goodsId}`, function(e, r) {
      let { name, price, imgUrl } = r[0]
      // 判断该用户之前是否添加过相同的商品
      connection.query(`select * from goods_cart where uid = ${uId} and goods_id = ${goodsId}`, function(err, results) {
        if(results.length > 0) {
          // 已添加,则增加一个数量
          let num = results[0].goods_num
          connection.query(`update goods_cart set goods_num = "${parseInt(num)+1}" where uid = ${uId} and goods_id = ${goodsId}`, function(err, results) {
            res.send({
              code: 200,
              data: {
                success: true,
                msg: '添加成功'
              }
            })
          })
        } else {
          // 未添加，则添加至购物车
          connection.query(`insert into goods_cart(uid, goods_id, goods_name, goods_price, goods_num, goods_imgUrl) values("${uId}", "${goodsId}", "${name}", "${price}", "1", "${imgUrl}")`, function(error, result) {
            res.send({
              code: 200,
              data: {
                success: true,
                msg: '添加成功'
              }
            })
          })
        }
      })


    })
  })
})

// 修改密码
router.post('/recovery', function(req, res, next) {
   let data = {
    username: req.body.username,
    password: req.body.password
   }
   connection.query(user.recovery(data), function(err, results) {
    if (err) throw err
    res.send({
      code: 200,
      data: {
        success: true,
        msg: '修改成功'
      }
    })
   })
})

// 查询用户
router.post('/selectUser', function(req, res, next) {
  let data = {
    username: req.body.username
  }
  connection.query(user.queryUserTel(data), function(err, results) {
    if(err) throw err
    if(results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true
        }
      })
    } else {
      res.send({
        code:0,
        data: {
          success: false,
          msg: '此用户不存在'
        }
      })
    }
  })
})

// 注册
router.post('/register', function(req, res, next){
  let data = {
    username: req.body.username,
    password: req.body.password
  }
  connection.query(user.queryUserTel(data), function(err, results) {
    if (err) throw err
    if(results.length > 0) {
      // 已经注册过了
      res.send({
        code: 200,
        data: {
          success: false,
          msg: '该手机号已注册，请勿重复注册'
        }
      })
    } else {
      // 尚未注册,先新增，再查询
      connection.query(user.addUser(data), function(err, results) {
        connection.query(user.queryUserTel(data), function(e, r) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '注册成功',
              data: r[0]
            }
          })
        })
      })
    }
  })

})

// 添加用户
router.post('/addUser', function(req, res, next){
  let data = {
    username: req.body.username
  }
  
  let username = data.username

  // 引入token包
  let jwt = require('jsonwebtoken')
  // 用户信息
  let payload = {username}
  // 口令
  let secret = 'llllxxxxllll'
  // 生成token
  let token = jwt.sign(payload, secret, {
    expiresIn: '1h'
  })

  connection.query(user.queryUserTel(data), function(err, results) {
    if (err) throw err
    if(results.length > 0) {
      // 已经注册过了
      let id = results[0].id
      // 每次登录都要修改 token
      connection.query(`update user set token = '${token}' where id = ${id}`, function(err, results) {
      })
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '登录成功',
          data: results[0]
        }
      })
    } else {
      // 尚未注册,先新增，再查询
      connection.query(user.addUser(data), function(err, results) {
        connection.query(user.queryUserTel(data), function(e, r) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: r[0]
            }
          })
        })
      })
    }
  })

})

// 短信验证接口
router.post('/code',function(req, res, next){
  let tel = req.body.username
  // 短信应用SDK AppID
  var appid = 1400187558;  // SDK AppID是1400开头

  // 短信应用SDK AppKey
  var appkey = "dc9dc3391896235ddc2325685047edc7";

  // 需要发送短信的手机号码
  var phoneNumbers = [tel];

  // 短信模板ID，需要在短信应用中申请
  var templateId = 285590;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

  // 签名
  var smsSign = "三人行慕课";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

  // 实例化QcloudSms
  var qcloudsms = QcloudSms(appid, appkey);

  // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
  function callback(err, ress, resData) {
      if (err) {
          console.log("err: ", err);
      } else {
        // 返回的数据
          res.send({
            code: 200,
            data: {
              success: true,
              data: ress.req.body.params[0] //验证码
            }
          })
      }
  }
  var ssender = qcloudsms.SmsSingleSender();
  // params就是发送到手机的验证码
  var params = [Math.floor( Math.random()*(9999-1000)) + 1000];
  ssender.sendWithParam(86, phoneNumbers[0], templateId,
  params, smsSign, "", "", callback);  // 签名参数不能为空串
})

// 账号密码登录验证接口
router.post('/login', function(req, res, next) {
  let data = {
    username: req.body.username,
    password: req.body.password
  }

  let username = data.username
  let password = data.password || '666666'

  // 引入token包
  let jwt = require('jsonwebtoken')
  // 用户信息
  let payload = {username}
  // 口令
  let secret = 'llllxxxxllll'
  // 生成token
  let token = jwt.sign(payload, secret, {
    expiresIn: '1h'
  })



  connection.query(user.queryUserTel(data), function(err,results) {
    // 手机号存在
    if( results.length > 0) {
      connection.query(user.qeuryUserPwd(data),function(err, results) {
        // 手机号和密码都正确
        if(results.length > 0) {
          let id = results[0].id
          // 每次登录都要修改 token
          connection.query(`update user set token = '${token}' where id = ${id}`, function(err, results) {
          })
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: results[0]
            }
          })
        } else {
          // 密码错误
          res.send({
            code: 302,
            data: {
              success: false,
              msg: '密码错误'
            }
          })
        }
      })
    } else {
      // 手机号不存在
      res.send({
        code: 301,
        data: {
          success: false,
          msg: '手机号不存在'
        }
      })
    }
  })
})

// 获取topbar数据接口
router.get('/themeList', function(req, res, next) {
  // /index_list/topBar的索引/data/第几屏的数据
  res.send({
    code: 0,
    data: {
      topBar: [
        {
          id: 0,
          title: '推荐'
        },
        {
          id: 1,
          title: '铁观音'
        },
        {
          id: 2,
          title: '金骏眉'
        },
        {
          id: 3,
          title: '大红袍'
        },
        {
          id: 4,
          title: '普洱'
        },
        {
          id: 5,
          title: '茶具'
        },
        {
          id: 6,
          title: '花茶'
        }
      ]
    }
  })
});

// 首页推荐的数据接口
// /index_list/topBar的索引/data/第几屏的数据
router.get('/index_list/0/data/1', function(req, res, next) {
  // /index_list/topBar的索引/data/第几屏的数据
  res.send({
    code: 0,
      data: [
        // swiper的数据
        {
          id: 0,
          type: 'swiperList',
          data: [
            {
              id: 1,
              imgUrl: '/img/swiper01.jpeg'
            },
            {
              id: 2,
              imgUrl: '/img/swiper02.jpeg'
            },
            {
              id: 3,
              imgUrl: '/img/swiper03.jpeg'
            },
            {
              id: 4,
              imgUrl: '/img/swiper04.jpeg'
            },
            {
              id: 5,
              imgUrl: '/img/swiper05.jpeg'
            }
          ]
        },
        {
          id: 1,
          type: 'IconList',
          data: [
            {
              id: 1,
              title: '自饮',
              imgUrl: '/img/icons01.png'
            },
            {
              id: 2,
              title: '茶具',
              imgUrl: '/img/icons02.png'
            },
            {
              id: 3,
              title: '品牌',
              imgUrl: '/img/icons03.png'
            },
            {
              id: 4,
              title: '赛事',
              imgUrl: '/img/icons04.png'
            },
            {
              id: 5,
              title: '新人礼',
              imgUrl: '/img/icons05.png'
            }
          ]
        },
        {
          id: 2,
          type: 'recommendList',
          data: [
            {
              id: 11,
              title: '浙江果粟',
              content: '来自龙井核心产区的地道滋味',
              imgUrl: '/img/longjing01.jpeg',
              price: 88
            },
            {
              id: 12,
              title: '龙井·飞花',
              content: '2022明前龙井，早春全芽，外形好，口感佳',
              imgUrl: '/img/longjing02.jpeg',
              price: 100
            },
            {
              id: 13,
              title: '神秘茶盒',
              content: '？？？？？？？？？？',
              imgUrl: '/img/mystery01.jpg',
              price: 999999
            },
            {
              id: 14,
              title: '浅尝-灰芽金骏眉',
              content: '风味升级的金骏眉新贵品种',
              imgUrl: '/img/jinjunmei01.jpeg',
              price: 128
            },
            {
              id: 15,
              title: '2014古法传承普洱熟茶砖',
              content: '古法制作熟茶砖，回甘明显，经久耐泡，伴有丝丝枣香',
              imgUrl: '/img/puer01.jpeg',
              price: 68
            },
            {
              id: 16,
              title: '黄山谷雨前六安瓜片',
              content: '外形鲜美，茶味比较浓厚，耐泡且回甘快',
              imgUrl: '/img/liuangua01.jpeg',
              price: 58
            }
          ]
        },
        {
          id: 3,
          type: 'likeList',
          data: [
            {
              id: 17,
              title: '张回春大红袍',
              imgUrl: '/img/dahongpao01.jpeg',
              price: 299
            },
            {
              id: 18,
              title: '星空紫主人杯',
              imgUrl: '/img/cup01.jpeg',
              price: 188
            },
            {
              id: 19,
              title: '老紫泥-硕果累累壶',
              imgUrl: '/img/cup02.jpeg',
              price: 299
            },
            {
              id: 20,
              title: '新式工艺笔花堂正山小种',
              imgUrl: '/img/zhengshan01.jpeg',
              price: 299
            },
            {
              id: 21,
              title: '茉莉小种',
              imgUrl: '/img/moli01.jpeg',
              price: 99
            }
          ]
        }
      ]

  })
});

// 首页铁观音的数据接口
router.get('/index_list/1/data/1', function(req, res, next) {
  // /index_list/topBar的索引/data/第几屏的数据
  res.send({
    code: 0,
      data: [
        // 铁观音的数据
        {
          id: 0,
          type: 'adList',
          data: [
            {
              id: 1,
              imgUrl: '/img/tie.jpeg'
            }
          ]
        },
        // 猜你喜欢的数据
        {
          id: 1,
          type: 'likeList',
          data: [
            {
              id: 17,
              title: '张回春大红袍',
              imgUrl: '/img/dahongpao01.jpeg',
              price: 299
            },
            {
              id: 18,
              title: '星空紫主人杯',
              imgUrl: '/img/cup01.jpeg',
              price: 188
            },
            {
              id: 19,
              title: '老紫泥-硕果累累壶',
              imgUrl: '/img/cup02.jpeg',
              price: 299
            },
            {
              id: 20,
              title: '新式工艺笔花堂正山小种',
              imgUrl: '/img/zhengshan01.jpeg',
              price: 299
            },
            {
              id: 21,
              title: '茉莉小种',
              imgUrl: '/img/moli01.jpeg',
              price: 99
            }
          ]
        }
      ]
  })
});

// 首页金骏眉的数据接口
router.get('/index_list/2/data/1', function(req, res, next) {
  // /index_list/topBar的索引/data/第几屏的数据
  res.send({
    code: 0,
      data: [
        // 金骏眉的数据
        {
          id: 0,
          type: 'adList',
          data: [
            {
              id: 1,
              imgUrl: '/img/jin.jpeg'
            }
          ]
        },
        // 猜你喜欢的数据
        {
          id: 1,
          type: 'likeList',
          data: [
            {
              id: 17,
              title: '张回春大红袍',
              imgUrl: '/img/dahongpao01.jpeg',
              price: 299
            },
            {
              id: 18,
              title: '星空紫主人杯',
              imgUrl: '/img/cup01.jpeg',
              price: 188
            },
            {
              id: 19,
              title: '老紫泥-硕果累累壶',
              imgUrl: '/img/cup02.jpeg',
              price: 299
            },
            {
              id: 20,
              title: '新式工艺笔花堂正山小种',
              imgUrl: '/img/zhengshan01.jpeg',
              price: 299
            },
            {
              id: 21,
              title: '茉莉小种',
              imgUrl: '/img/moli01.jpeg',
              price: 99
            }
          ]
        }
      ]
  })
});

// 查询商品数据接口
router.get('/goods/shopList', function(req, res, next) {
  // 分别获取请求参数的键和值
  let [ searchName, orderName ] = Object.keys(req.query)
  let [name, order] = Object.values(req.query)
  // 'select * from goods_list where name like "%'+name+'%" order by'+orderName+' '+order+''
  connection.query('select * from goods_list where name like "%'+name+'%" order by '+orderName+' '+order+'',function(error, results) {
    res.send({
      code: 0,
      data: results
    })
  })
})

// 根据id查询商品数据接口
router.get('/goods/id', function(req, res, next) {
  const id = req.query.id
  connection.query('select * from goods_list where id ='+id+'',function(error, results) {
    if(error) throw error;
    res.send({
      code: 0,
      data: results[0]
    })
  })
})

// 商品分类数据接口
router.get('/goods/typeList', function(req, res, next) {
  res.send({
    code: 0,
    data: [
      {
        id: 0,
        name: '推荐',
        data: [
          {
            id: 0,
            name: '紫砂壶',
            imgUrl: '/img/typeList01.jpeg'
          },
          {
            id: 1,
            name: '铁观音',
            imgUrl: '/img/typeList02.jpeg'
          },
          {
            id: 2,
            name: '金骏眉',
            imgUrl: '/img/typeList03.jpeg'
          },
          {
            id: 3,
            name: '武夷岩茶',
            imgUrl: '/img/typeList04.jpeg'
          },
          {
            id: 4,
            name: '龙井',
            imgUrl: '/img/typeList05.jpeg'
          },
          {
            id: 5,
            name: '云南湛红',
            imgUrl: '/img/typeList06.jpeg'
          },
          {
            id: 6,
            name: '建栈',
            imgUrl: '/img/typeList07.jpeg'
          },
          {
            id: 7,
            name: '功夫茶具',
            imgUrl: '/img/typeList08.jpeg'
          }
        ]
      },
      {
        id: 1,
        name: '新品',
        data: [
          {
            id: 0,
            name: '5月新品',
            imgUrl: '/img/typeList09.jpeg'
          },
          {
            id: 1,
            name: '6月新品',
            imgUrl: '/img/typeList10.jpeg'
          },
          {
            id: 2,
            name: '7月新品',
            imgUrl: '/img/typeList11.jpeg'
          }
        ]
      },
      {
        id: 2,
        name: '习茶',
        data: [
          {
            id: 0,
            name: '习茶',
            imgUrl: '/img/typeList12.jpeg'
          }
        ]
      },
      {
        id: 3,
        name: '绿茶',
        data: [
          {
            id: 0,
            name: '龙井',
            imgUrl: '/img/typeList13.jpeg'
          },
          {
            id: 1,
            name: '黄山毛峰',
            imgUrl: '/img/typeList14.jpeg'
          },
          {
            id: 2,
            name: '碧螺春',
            imgUrl: '/img/typeList15.jpeg'
          },
          {
            id: 3,
            name: '雀舌',
            imgUrl: '/img/typeList16.jpeg'
          },
          {
            id: 4,
            name: '太平猴魁',
            imgUrl: '/img/typeList17.jpeg'
          },
          {
            id: 5,
            name: '珍稀白茶',
            imgUrl: '/img/typeList18.jpeg'
          },
          {
            id: 6,
            name: '刘安瓜片',
            imgUrl: '/img/typeList19.jpeg'
          }
        ]
      },
      {
        id: 4,
        name: '乌龙',
        data: [
          {
            id: 0,
            name: '永春佛手',
            imgUrl: '/img/typeList20.jpeg'
          },
          {
            id: 1,
            name: '铁观音',
            imgUrl: '/img/typeList02.jpeg'
          },
          {
            id: 2,
            name: '武夷岩茶',
            imgUrl: '/img/typeList04.jpeg'
          },
          {
            id: 3,
            name: '漳平水仙',
            imgUrl: '/img/typeList21.jpeg'
          }
        ]
      },
      {
        id: 5,
        name: '红茶',
        data: [
          {
            id: 0,
            name: '英德红茶',
            imgUrl: '/img/typeList22.jpeg'
          },
          {
            id: 1,
            name: '坦洋工夫',
            imgUrl: '/img/typeList23.jpeg'
          },
          {
            id: 2,
            name: '金骏眉',
            imgUrl: '/img/typeList24.jpeg'
          },
          {
            id: 3,
            name: '正山小种',
            imgUrl: '/img/typeList25.jpeg'
          },
          {
            id: 4,
            name: '云南滇红',
            imgUrl: '/img/typeList06.jpeg'
          },
          {
            id: 5,
            name: '祁门红茶',
            imgUrl: '/img/typeList26.jpeg'
          }
        ]
      },
      {
        id: 6,
        name: '白茶',
        data: [
          {
            id: 0,
            name: '白牡丹',
            imgUrl: '/img/typeList27.jpeg'
          },
          {
            id: 1,
            name: '牡丹王',
            imgUrl: '/img/typeList28.jpeg'
          },
          {
            id: 2,
            name: '白毫银针',
            imgUrl: '/img/typeList29.jpeg'
          },
          {
            id: 3,
            name: '寿眉',
            imgUrl: '/img/typeList30.jpeg'
          }
        ]
      }
    ]
  })
})
module.exports = router;
