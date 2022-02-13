import request from '@/utils/request'

// 获取所有一级标签
export function getUserManageAction(params) {
  const data = {
    // phonenumber,
    // code,
    // uuid
  }
  return request({
    url: '/sysUser/selCmsUsersList',
    headers: {
      isToken: true
    },
    method: 'post',
    data: params
  })
}

//  根据ID获取详情
export function getUMDetailsAction(list) {
  const id = list.id
  const data = list.data
  return request({
    url: `/sysUser/${id}/selCmsUserInfoById`,
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 获取角色列表 
export function getRoleAction() {
  const data= {}
  return request({
    url: '/sysUser/selUserRole',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

