<template>
  <div class="app-container">
        <template>
        <div class="app-container">
            <el-form label-width="120px">
            <el-form-item label="讲师名称">
                <el-input v-model="teacher.name"/>
            </el-form-item>
            <el-form-item label="讲师排序">
                <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
            </el-form-item>
            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                <!--
                    数据类型一定要和取出的json中的一致，否则没法回填
                    因此，这里value使用动态绑定的值，保证其数据类型是number
                -->
                <el-option :value="1" label="高级讲师"/>
                <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>
            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career"/>
            </el-form-item>
            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>
            <!-- 讲师头像：TODO -->
            <el-form-item label="讲师头像">
                <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar"/>
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
                </el-button>
                <!--
                v-show：是否显示上传组件
                :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                :url：后台上传的url地址，直接使用组件所带的url，而不是使用ajax请求
                @close：关闭上传组件
                @crop-upload-success：上传成功后的回调 
                -->
                <image-cropper
                            v-show="imagecropperShow"
                            :width="300"
                            :height="300"
                            :key="imagecropperKey"
                            :url="BASE_API+'/edu/ossfile/upload'"
                            field="file"
                            @close="close"
                            @crop-upload-success="cropSuccess"/>
            </el-form-item>            
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
            </el-form-item>
            </el-form>
        </div>
        </template>
  </div>
</template>
<script>
import { addTeacher,getTeacherInfo,updateTeacher } from '@/api/edu/teacher'
//引入组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  //声明上传文件组件
  components: { ImageCropper, PanThumb },   
  data() {
    return {   //定义变量、赋初始值
        teacher:{
            name:'',
            sort:1,
            level:1,
            career:'',
            intro:'',
            avatar:''
        },
        imagecropperShow:false, //默认不弹出上传组件
        imagecropperKey:0,      //上传组件id
        BASE_API:process.env.BASE_API, //nginx url地址
        saveBtnDisabled:false //点击提交后，禁止在此点击
    }
  },
  created() {
    this.init()    
  },
  watch: {            //路由监听，为了监视路由的变化，执行相应方法
    $route(to, from) {
      this.init()
    }
  },  
  methods: {    //定义方法   method中定义的方法如何互相调用 也要用this(当前页面vue对象) 除了从外部导入的方法不需要(当前vue中的变量、方法的使用/调用都要用this)
       init(){
        //如果是修改，判断路径是否有参数，有参数回显数据  在渲染页面前
        if (this.$route.params && this.$route.params.id) {
            const id = this.$route.params.id
            //调用当前vue对象的方法 created中调用方法用this
            this.fetchDataById(id)
        }else{
            this.resetData()
        }              
       },
       saveOrUpdate(){
           if (this.$route.params && this.$route.params.id) {
            updateTeacher(this.teacher)
                .then(response => {
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                    //跳转路由到讲师列表页面(router全局路由器，route当前url路由)
                    this.$router.push({path:'/teacher/list'})                    
                })
           }else{
            addTeacher(this.teacher)
                .then(response => {
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    })
                    //跳转路由到讲师列表页面(router全局路由器，route当前url路由)
                    this.$router.push({path:'/teacher/list'})                    
                })               
           }
       },
       fetchDataById(id){
            getTeacherInfo(id)
               .then(response =>{
                   this.teacher = response.data.teacher
               })
       },
       resetData(){
            //清空讲师信息
            this.teacher={
                name:'',
                sort:1,
                level:1,
                career:'',
                intro:''                
            }
        },
        close(){
            //关闭上传文件窗口
            this.imagecropperShow=false;
            //上传组件初始化(防止与上次重复)
            this.imagecropperKey=this.imagecropperKey+1;
        },
        cropSuccess(data){
            //cropSuccess返回的data数据  相当于response.data
            //将oss地址赋给teacher.avatar
            this.teacher.avatar=data.url;
            //关闭上传文件窗口
            this.imagecropperShow=false;  
            //上传组件初始化
            //上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey=this.imagecropperKey+1;                        
        }
  }  
}

</script>
      