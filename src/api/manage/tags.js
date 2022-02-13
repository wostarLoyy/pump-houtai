import request from '@/utils/request'

// 获取所有一级标签
export function getFirstLevelTagsAction() {
  const data = {
    // phonenumber,
    // code,
    // uuid
  }
  return request({
    url: '/label/oneLable/getAllOneLevelLabels',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 获取ID对应的全部二级标签
export function getSecondLevelTagsAction(id) {
  const data = {
    // phonenumber,
    // code,
    // uuid
  }
  return request({
    url: `/label/oneLable/${id}/getTwoLevelLabels`,
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 删除ID对应的标签
export function deleteTagsAction(id) {
  const data = {
    // phonenumber,
    // code,
    // uuid
  }
  return request({
    url: `/label/oneLable/${id}/deleteLable`,
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 修改/ 删除 ID对应标签信息
export function updateTagsAction(params) {
  const id = params.id
  const data = params.data
  return request({
    url: `/label/oneLable/${id}/updateLable`,
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}

// 增加一级/二级标签
export function addTagAction(val) {
  const data = val
  return request({
    url: '/label/addLable',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
