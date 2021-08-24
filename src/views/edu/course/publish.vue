<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>
    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>
    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="published">发布课程</el-button>
    </div>
  </div>
</template>
<script>
import { getCoursePublishInfo,PublishedCourse } from '@/api/edu/course'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId:'',
      coursePublish:{
        cover:'',
        title:'',
        lessonNum:0,
        subjectLevelOne:'',
        subjectLevelTwo:'',
        teacherName:'',
        price:0
      }
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
        //将获取到的路径id赋值给courseid
        this.courseId = this.$route.params.id;
        this.getCoursePublish()
    }    
  },
  methods: {
    previous() {
      this.$router.push({ path: '/course/chapter/'+this.courseId })
    },
    getCoursePublish(){
         getCoursePublishInfo(this.courseId)
           .then(response =>{
             this.coursePublish = response.data.coursePublishVo
      })
    },
    published(){
        //使用.then会保证修改完以后才执行之后操作
        PublishedCourse(this.courseId)
          .then(response =>{
                //提示信息
                this.$message({
                    type: 'success',
                    message: '发布成功!'
                })                 
                this.$router.push({ path: '/course/list' })
          })
    }
  }
}
//整个页面执行完以后，才会进行数据渲染,针对非静态数据（如果数据不存在，渲染时也会发生错误）
</script>
<style scoped>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}
.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>