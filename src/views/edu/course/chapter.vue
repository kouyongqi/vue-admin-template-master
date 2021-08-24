<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="课程发布"/>
    </el-steps>

    <el-button type="text" @click="openadddialog()">添加章节</el-button>

    <!-- 添加和修改章节表单弹框 :visible.sync :model属性单向绑定-->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapterInfo" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapterInfo.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapterInfo.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>    

    <!--显示章节信息-->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterNestedList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                    <el-button type="text" @click="openaddvideodialog(chapter.id)">添加课时</el-button>
                    <el-button style="" type="text" @click="openeditdialog(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="deletechapter(chapter.id)">删除</el-button>
                </span>
            </p>
            <!-- 添加和修改课时(视频)表单 -->
            <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
              <el-form :model="videoInfo" label-width="120px">
                <el-form-item label="课时标题">
                  <el-input v-model="videoInfo.title"/>
                </el-form-item>
                <el-form-item label="课时排序">
                  <el-input-number v-model="videoInfo.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费">
                  <el-radio-group v-model="videoInfo.isFree">
                    <el-radio :label="true">免费</el-radio>
                    <el-radio :label="false">默认</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="上传视频">
                    <el-upload
                          :on-success="handleVodUploadSuccess"
                          :on-remove="handleVodRemove"
                          :before-remove="beforeVodRemove"
                          :on-exceed="handleUploadExceed"
                          :file-list="fileList"
                          :action="BASE_API+'/edu/vod/uploadfile'"
                          :limit="1"
                          class="upload-demo">
                    <el-button size="small" type="primary">上传视频</el-button>
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持1G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                        <i class="el-icon-question"/>
                    </el-tooltip>
                    </el-upload>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
                <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
              </div>
            </el-dialog>                       
            <!--课时视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click="openeditvideodialog(video.id)">编辑</el-button>
                            <el-button type="text" @click="deletevideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { getAllChapters,addChapterInfo,deleteChapterInfo,getChapterInfo,updateChapterInfo } from '@/api/edu/chapter'
import { addVideoInfo,deleteVideoInfo,getVideoInfo,updateVideoInfo,deleteVod } from '@/api/edu/video'
export default {
  data() {
    return {
      //章节
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterNestedList:[],
      dialogChapterFormVisible:false,
      chapterInfo:{
         title:'',
         sort:'',
         courseId:''
      },
      //课时
      videoInfo:{
        title: '',
        sort: 0,
        isFree: false,  
        videoSourceId:'',
        videoOriginalName:''      
      },
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      //课时视频
      BASE_API:'http://localhost:9001',
      fileList:[]      //上传视频列表
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
        //将获取到的路径id赋值给courseid
        this.chapterInfo.courseId = this.$route.params.id;
        //调用getChapterList()赋值给chapterNestedList 随后渲染页面
        this.getChapterList()
    }
  },
  methods: {
    getChapterList(){
        getAllChapters(this.chapterInfo.courseId)
         .then(response =>{
             this.chapterNestedList = response.data.chaptervos
             //调用set方法赋值到vue对象中
         }) 
    },
    previous() {
      this.$router.push({ path: '/course/info/'+this.chapterInfo.courseId })
    },
    next(){
      //跳转页面
      this.$router.push({ path: '/course/publish/'+this.chapterInfo.courseId })
    },

    //添加时，
    openadddialog(){
        this.dialogChapterFormVisible=true;
        this.chapterInfo.title=''
        this.chapterInfo.sort=0      
    },

    openaddvideodialog(chapterid){
        this.dialogVideoFormVisible=true;
        this.videoInfo.title=''
        this.videoInfo.sort=0 
        this.videoInfo.isFree=false

        this.videoInfo.chapterId = chapterid
        this.videoInfo.courseId = this.chapterInfo.courseId

        this.fileList = []
    },    

    openeditdialog(chapterid){
       this.dialogChapterFormVisible=true;
       getChapterInfo(chapterid)
        .then(response =>{
           this.chapterInfo = response.data.chapter
        })
    },

    openeditvideodialog(videoid){
       this.dialogVideoFormVisible=true;
       getVideoInfo(videoid)
        .then(response =>{
           this.videoInfo = response.data.video
        })     
    },

    deletechapter(chapterid){
      deleteChapterInfo(chapterid)
        .then(response =>{
              //提示信息
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              })              
              //刷新渲染课程大纲页面
              this.getChapterList();            
        })
    },

    deletevideo(videoid){
      deleteVideoInfo(videoid)
        .then(response =>{
              //提示信息
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              })              
              //刷新渲染课程大纲页面
              this.getChapterList();            
        })
    }, 
    
    //上传成功后的回调函数（等待数据上传成功，返回数据，执行该函数） 异步请求（如果想要获得返回数据，必须等待异步请求结束）
    handleVodUploadSuccess(response,file,fileList){
        this.videoInfo.videoSourceId = response.data.vodid;
        this.videoInfo.videoOriginalName = file.name;   
    },

    //超过上传上限
    handleUploadExceed(file,fileList){
       this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    //上传成功之后执行（此时异步请求已经返回数据） 为了防止数据继续添加到数据库
    beforeVodRemove(file,fileList){
       return this.$confirm(`确定移除 ${file.name}？`)
    },

    handleVodRemove(file, fileList){
       deleteVod(this.videoInfo.videoSourceId)
         .then(response =>{
                    //提示信息
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                    
                    //清空相关信息
                    this.fileList = [],
                    this.videoInfo.videoSourceId = '',
                    this.videoInfo.videoOriginalName = ''                       
         })
    },

    saveOrUpdateVideo(){
      if(this.videoInfo.id){
         updateVideoInfo(this.videoInfo)
          .then(response =>{
                    //关闭弹框
                    this.dialogVideoFormVisible = false
                    //提示信息
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    })
                    //刷新渲染课程大纲页面
                    this.getChapterList();            
          })  
      }else{
         addVideoInfo(this.videoInfo)
          .then(response =>{
                    //关闭弹框
                    this.dialogVideoFormVisible = false
                    //提示信息
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    })
                    //刷新渲染课程大纲页面
                    this.getChapterList();            
          })        

      }
    },

    saveOrUpdate() {
        if(this.chapterInfo.id){
            updateChapterInfo(this.chapterInfo)
              .then(response =>{
                   //关闭弹框
                    this.dialogChapterFormVisible = false
                    //提示信息
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    })
                    //刷新渲染课程大纲页面
                    this.getChapterList();
              })            
        }else{
            addChapterInfo(this.chapterInfo)
              .then(response =>{
                    //关闭弹框
                    this.dialogChapterFormVisible = false
                    //提示信息
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    })
                    //刷新渲染课程大纲页面
                    this.getChapterList();
              })
        }

    }


  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>