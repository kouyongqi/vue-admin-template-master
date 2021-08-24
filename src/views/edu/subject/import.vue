<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/static/test.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <!--表单提交action，非ajax-->
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/edu/subject/readfile'"
          name="file"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default{
    data(){
        return {
            BASE_API:'http://localhost:9001', // 接口API地址
            loading:false,
            fileUploadBtnText:'上传到服务器', // 按钮文字
            importBtnDisabled:false  // 按钮是否禁用 不可重复点击
        }
    },

    created(){
    },

    methods: {
       //上传文件
       submitUpload(){
            this.fileUploadBtnText = '正在上传'
            this.importBtnDisabled = true
            this.loading = true
            //将表单数据提交的web服务器
            this.$refs.upload.submit()
       },

       //文件上传成功
       fileUploadSuccess(response){
        if (response.success === true) {
            this.loading = false
            this.$message({
            type: 'success',
            message: '课程分类导入成功'
            })
         }
         //跳转路由到讲师列表页面(router全局路由器，route当前url路由)
         this.$router.push({path:'/subject/list'})           
       },

       //文件上传失败
       fileUploadError(){
            this.loading = false
            this.$message({
            type: 'success',
            message: '课程分类导入失败'
        })
      }
    }
}
</script>