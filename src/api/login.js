import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function login(username, password) {
  return request({
    url: '/edu/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/edu/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/edu/admin/logout',
    method: 'post'
  })
}
