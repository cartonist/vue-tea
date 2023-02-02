// 验证数据库中的用户相关内容
const User = {
  // 查询手机号
  queryUserTel( option ) {
    return 'select * from user where tel = '+option.username+''
  },
  // 查询手机号和密码
  qeuryUserPwd(option) {
    return 'select * from user where (tel = '+option.username+') and pwd ='+option.password+''
  },
  // 添加用户
  addUser(option) {
    let username = option.username
    let password = option.password || '666666'

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

    return 'insert into user(tel, pwd, imgUrl, nickName, token) values("'+username+'", "'+password+'", "/img/user02.jpg", "用户'+username+'", "'+token+'")'
  },
  // 修改用户的密码
  recovery(option) {
    let username = option.username
    let password = option.password
    return 'update user set pwd = "'+password+'" where tel = "'+username+'"'
  }
}
exports = module.exports = User