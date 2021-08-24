<template>
  <div class="app-container">
  <!--查询课程-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="CourseQuery.name" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-input v-model="CourseQuery.price" placeholder="课程价格"/>
      </el-form-item>      

      <el-form-item>
        <el-select v-model="CourseQuery.status" clearable placeholder="课程状态">
          <el-option :value="'Normal'" label="已发布"/>
          <el-option :value="'Draft'" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="CourseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="CourseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getCoursePageData()">查询</el-button>
      <el-button type="default" @click="resetCourseData()">清空</el-button>
    </el-form>  

  <!--查询分页列表-->
  <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <!--slot-scope获取作用域插槽:data绑定的数据-->
        <template slot-scope="scope">
          {{ (currentpage - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />

      <el-table-column label="课程发布状态" width="80">
        <template slot-scope="scope">
          <!--scope.row.对象属性 获取对象属性值-->
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" />

      <el-table-column prop="price" label="课程价格" width="60" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" width="100">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" width="100">编辑课程大纲信息</el-button>
          </router-link>          
          <el-button type="danger" size="mini" icon="el-icon-delete" width="100" @click="removeCourseDataById(scope.row.id)">删除课程</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      :current-page="currentpage"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getCoursePageData"
    />
    <!--绑定事件调用方法getPageData-->
    <!--current-change currentPage 改变时会触发 回调参数当前页作为getCoursePageData的参数-->

  </div>
</template>

<script>
import { getCoursePageList,deleteCourse } from '@/api/edu/course'

export default {
  data() {
    return {   //定义变量、赋初始值
      currentpage: 1,
      limit: 3,
      CourseQuery: {},
      list: [],
      total: 0,
    }
  },
  created() {
    this.getCoursePageData()
  },
  methods: {
    getCoursePageData(currentpage=1) {
      //currentpage根据分页变换传值进来赋值给vue对象  分页需要currentpage
      this.currentpage = currentpage
      getCoursePageList(this.currentpage,this.limit,this.CourseQuery)
      .then(response => {
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    resetCourseData(){
        //清空条件
        this.CourseQuery={}
        //随后将讲师分页显示(默认返回第一页数据)
        this.getCoursePageData()
    },
    removeCourseDataById(courseid){
      this.$confirm('此操作将永久删除该课程记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCourse(courseid)
          .then(response => {
              //提示信息
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //刷新分页数据
              this.getCoursePageData(this.currentpage)
          })
        })
    }          
  }  
}
//this指代当前vue实例对象
</script>