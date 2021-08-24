import request from '@/utils/request'
//request帮我们封装返回响应data reponse.data

export function addVideoInfo(video) {
    return request({
      url: `/edu/video/addVideo`,
      method: 'post',
      data:video
    })
  }
  
export function deleteVideoInfo(videoid) {
    return request({
      url: `/edu/video/deleteVideo/${videoid}`,
      method: 'delete',
    })
  }

export function getVideoInfo(videoid) {
    return request({
      url: `/edu/video/getVideo/${videoid}`,
      method: 'get',
    })
  }


export function updateVideoInfo(video) {
    return request({
      url: `/edu/video/updateVideor`,
      method: 'post',
      data:video
    })
  }

  export function deleteVod(videoSourceId) {
    return request({
      url: `/edu/vod/deletevod/${videoSourceId}`,
      method: 'delete',
    })
  }
