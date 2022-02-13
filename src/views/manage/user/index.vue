<template>
  <div class="manage-boxs com">
    <el-row :gutter="10" v-loading="detail.loading">
      <!-- 第一列 -->
      <el-col :span="detail.tab" :xs="24">
        <div class="manage-boxs-item">
          <div class="manage-boxs-item-header">
            <h4>用户管理</h4>
          </div>
          <div class="manage-boxs-item-container">
            <el-table :data="userTable" style="width: 100%">
              <el-table-column prop="name" label="用户姓名" width=""></el-table-column>
              <el-table-column prop="company" label="企业" width=""></el-table-column>
              <el-table-column prop="phone" label="手机号" width=""></el-table-column>
              <el-table-column prop="registTime" label="注册时间" width=""></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "manageUser",
  data() {
    return {
      // 版本号
      version: "3.8.1",
      detail: {
        loading: false,
        show: false,
        tab: 24
      },
      userTable: [{
        name: 'name',
        company: 'company',
        phone: 'phone',
        registTime: 'time',
      }, {
         name: 'name11',
        company: 'company11',
        phone: 'phone11',
        registTime: 'time11',
      }, {
         name: 'name22',
        company: 'company22',
        phone: 'phone22',
        registTime: 'time22',
      }, {
         name: 'name33',
        company: 'company33',
        phone: 'phone33',
        registTime: 'time33',
      }, {
         name: 'name44',
        company: 'company44',
        phone: 'phone44',
        registTime: 'time44',
      }]
      
    };
  },
  methods: {
    
  },
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";
  .manage-boxs {
    padding: 5px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    background-color: #fff;
    &-item {
      background-color: #fff;
      min-height: calc(100vh - 60px);
      //  margin-bottom: 20px;
      &-header {
        padding: 15px;
        border-bottom: 1px solid #ccc;
        h4 {
          font-weight: bold;
          line-height: 25px;
          margin: 0;
        }
      }
      &-container {
        padding: 15px;
      }
    } 

  }
  .manage-box {
   
  }
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    &-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      &:hover {
        background-color: #eee;
      }
      &.active {
        background-color: #eee;
      }
    }
    &-text {
      margin: 0;
      line-height: 25px;
      cursor: default;
    }
  }
</style>

