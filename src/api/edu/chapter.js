import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function getAllChapters(courseid) {
    return request({
      url: `/edu/chapter/getAllChapterVo/${courseid}`,
      method: 'get',
    })
  }

export function addChapterInfo(chapter) {
    return request({
      url: `/edu/chapter/addChapter`,
      method: 'post',
      data:chapter
    })
  }
  
export function deleteChapterInfo(chapterid) {
    return request({
      url: `/edu/chapter/deleteChapter/${chapterid}`,
      method: 'delete',
    })
  }

export function getChapterInfo(chapterid) {
    return request({
      url: `/edu/chapter/getChapter/${chapterid}`,
      method: 'get',
    })
  }


export function updateChapterInfo(chapter) {
    return request({
      url: `/edu/chapter/updateChapter`,
      method: 'post',
      data:chapter
    })
  } 



