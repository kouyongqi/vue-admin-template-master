import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function addCourseInfo(courseInfo) {
  return request({
    url: `/edu/course/saveCourse`,
    method: 'post',
    data:courseInfo
  })
}

export function getCourseTeacherInfo() {
    return request({
      url: `/edu/teacher/findAll`,
      method: 'get',
    })
  }

export function getCourseInfo(courseid) {
    return request({
      url: `/edu/course/getCourseInfo/${courseid}`,
      method: 'get',
    })
  }

export function updateCourseInfo(courseInfo) {
  return request({
    url: `/edu/course/updateCourseInfo`,
    method: 'post',
    data:courseInfo
  })
}

export function getCoursePublishInfo(courseid) {
  return request({
    url: `/edu/course/getCoursePublish/${courseid}`,
    method: 'get',
  })
}

export function PublishedCourse(courseid) {
  return request({
    url: `/edu/course/published/${courseid}`,
    method: 'put',
  })
}

export function getCoursePageList(current,limit,CourseQuery) {
  return request({
    url: `/edu/course/pageCourseConditionnal/${current}/${limit}`,
    method: 'post',
    //data表示将对象转成json进行传递  RequestBody接收json数据封装到对象中
    data: CourseQuery
  })
}

export function deleteCourse(courseid) {
  return request({
    url: `/edu/course/${courseid}`,
    method: 'delete',
  })
}



