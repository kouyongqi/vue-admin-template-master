import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function getPageList(current,limit,teacherQuery) {
  return request({
    url: `/edu/teacher/pageTeacherConditionnal/${current}/${limit}`,
    method: 'post',
    //data表示将对象转成json进行传递  RequestBody接收json数据封装到对象中
    data: teacherQuery
  })
}

export function deleteTeacher(id) {
  return request({
    url: `/edu/teacher/${id}`,
    method: 'delete',
  })
}

export function addTeacher(teacher) {
  return request({
    url: `/edu/teacher/saveTeacher`,
    method: 'post',
    data:teacher
  })
}

export function getTeacherInfo(id) {
  return request({
    url: `/edu/teacher/getTeacher/${id}`,
    method: 'get',
  })
}

export function updateTeacher(teacher) {
  return request({
    url: `/edu/teacher/updateTeacher`,
    method: 'post',
    data:teacher
  })
}




