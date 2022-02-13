import request from '@/utils/request'

// 登录方法 - 密码登录
export function login(phonenumber, password, code, uuid) {
  const data = {
    phonenumber,
    password,
    code,
    uuid
  }
  return request({
    url: '/sys/loginPassword',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
export function loginBPhone(phonenumber, code, uuid) {
  const data = {
    phonenumber,
    code,
    uuid
  }
  return request({
    url: '/sys/loginPhone',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/sysUser/getInfo',
    headers: {
      isToken: true,
    },
    method: 'post'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    headers: {
      isToken: true,
    },
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/sysCaptcha/getImgCaptchaICode',
    headers: {
      isToken: false
    },
    method: 'post',
    timeout: 20000
  })
}
// 手机验证码
export function postPhoneCode(data) {
  return request({
    url: '/sysCaptcha/getPhonenCaptchaICode',
    headers: {
      isToken: false
    },
    method: 'post',
    timeout: 20000,
    data: {
      uuid: data.uuid,
      phonenumber: data.phonenumber,
      code: data.code,
    }
  })
}