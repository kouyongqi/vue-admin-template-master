<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <!--对象数组和json数组都可以遍历-->
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>
<script>
import { getSubjectList } from '@/api/edu/subject'
export default {
  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        //注意这里的label不能变 后面的值是可以变的
        label: 'title'
      }
    }
  },
  created(){
     //this当前页面vue对象  限定范围
     this.getSubjectData()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    getSubjectData(){
        getSubjectList()
        .then(response => {
            this.data2 = response.data.subjects
        })
    },      
    filterNode(value, data) {
      if (!value) return true
      //输入值和实际值都小写
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>
