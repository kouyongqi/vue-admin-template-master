import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function createStaticsData(day) {
    return request({
      url: `/statistics/daily/saveStaticsInfo/${day}`,
      method: 'get',
    })
  }

export function getDateAndDataInfo(searchObject) {
    return request({
      url: `/statistics/daily/getDateAndData`,
      method: 'post',
      data:searchObject
    })
  }

