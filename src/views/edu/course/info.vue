<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="课程发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">

        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="oneSubjectLevelChange">
          <el-option
            v-for="onesubject in oneSubjects"
            :key="onesubject.id"
            :label="onesubject.title"
            :value="onesubject.id"/>
        </el-select>

        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="twosubject in twoSubjects"
            :key="twosubject.id"
            :label="twosubject.title"
            :value="twosubject.id"/>
        </el-select>        
      </el-form-item>      
      <!-- 课程讲师 TODO 所选择的value值会赋值到courseInfo.teacherId中-->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO 自动上传-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/edu/ossfile/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>  

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import { addCourseInfo,getCourseTeacherInfo,getCourseInfo,updateCourseInfo } from '@/api/edu/course'
import { getSubjectList } from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce' //引入组件
export default {
  components: { Tinymce }, //声明组件
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      //不定义初始值(没有数据可以渲染) 整个页面就会渲染失败，加载失败
      //数据先进行初始化，之后会调用created方法对数据重新赋值，然后数据渲染（初始化值、重新赋值的数据）
      courseInfo:{
        id:'',
        title: '',
        subjectId: '', //二级分类id
        subjectParentId:'',//一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/image1.jpg',
        price: 0  
      },
      BASE_API:'http://localhost:9001',
      teacherList:[],
      oneSubjects:[],
      twoSubjects:[],
      courseid:''
    }
  },
  created() {
    //created中执行多个异步请求函数时 函数的执行顺序未知，谁先返回也不确定 所以created中函数最好不要使用还没返回的变量
    this.init()   
  },
  watch: {            //路由监听，为了监视路由的变化，执行相应方法
    $route(to, from) {
      this.init()
    }
  },   
  methods: {
    init(){
          //vue对象实例化后 立即调用方法进行数据赋值，随后数据渲染
          this.getOneSubjects()
          this.CourseTeacherInfo()    
          if (this.$route.params && this.$route.params.id) {
              //将获取到的路径id赋值给courseid (直接赋值，该值可以被其他函数获取)
              this.courseid = this.$route.params.id
              this.getCourseInfoById()
              this.getTwoSubjects()
          }else{
              this.resetData()
          }            
    },    
    //封面上传成功
    handleAvatarSuccess(response,file){
       this.courseInfo.cover = response.data.url
    },
   //封面上传前(结果返回为true 才上传)
    beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M      
    },
    //一级课程发生改变
    oneSubjectLevelChange(value){
       //value就是subjectParentId变动时返回的id
       //此时异步请求数据返回
       for(var i=0;i<this.oneSubjects.length;i++){
          if(value === this.oneSubjects[i].id){
             this.courseInfo.subjectId = ''
             this.twoSubjects = this.oneSubjects[i].children
          }
       }
    },
    getTwoSubjects(){
      //需要调用getSubjectList获取到课程分类数据(比较特殊)
      //此时异步请求数据未返回
      getSubjectList()
       .then(response => {
          var oneSubjects = response.data.subjects;
          for(var i=0;i<oneSubjects.length;i++){
              if(this.courseInfo.subjectParentId === oneSubjects[i].id){
                this.twoSubjects = oneSubjects[i].children
              }
          }           
       })       
    },
    getCourseInfoById(){
      getCourseInfo(this.courseid)
        .then(response =>{
          this.courseInfo = response.data.courseinfo
        })
    },
    //得到一级课程数据（包含二级课程）
    getOneSubjects(){
       getSubjectList()
        .then(response =>{
          this.oneSubjects = response.data.subjects;
        })
    },
    CourseTeacherInfo(){
       getCourseTeacherInfo()
        .then(response =>{
          this.teacherList = response.data.items
        })
    },
    resetData(){
        //清空课程信息
      this.courseInfo ={
          id:'',
          title: '',
          subjectId: '', //二级分类id
          subjectParentId:'',//一级分类id
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/image1.jpg',
          price: 0  
      },
      this.teacherList=[],
      this.oneSubjects=[],
      this.twoSubjects=[],
      this.courseid=''              
    },    
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.id) {
        updateCourseInfo(this.courseInfo)
          .then(response =>{
                //提示信息
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                //跳转页面
                this.$router.push({ path: '/course/chapter/'+this.courseid })                             
          })
      }else{
        //路由跳转(路由跳转地址以router的path: '/course'打头) 添加成功后 才执行then后的方法
        addCourseInfo(this.courseInfo)
          .then(response =>{
                //提示信息
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })  
                //跳转页面
                this.$router.push({ path: '/course/chapter/'+response.data.courseid })
          })
      }
    }
  }
}
</script>
<!--组件样式-->
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>