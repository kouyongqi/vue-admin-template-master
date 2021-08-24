import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function getSubjectList() {
  return request({
    url: `/edu/subject/getAllSubject`,
    method: 'get',
  })
}







