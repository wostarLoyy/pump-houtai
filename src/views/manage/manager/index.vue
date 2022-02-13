<template>
  <div class="manage-boxs com">
    <el-row :gutter="10" v-loading="detail.loading">
      <!-- 第一列 -->
      <el-col :span="detail.tab" :xs="24">
        <div class="manage-boxs-item">
          <div class="manage-boxs-item-header">
            <h4>运营人员管理</h4>
            <el-input placeholder="请输入内容" v-model="input" class="input-with-select" style="width: 200px;">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addManager">添加人员</el-button>
          </div>
          <div class="manage-boxs-item-container">
            <!-- 表格 -->
            <el-table 
              ref="tableData"
              highlight-current-row
              :data="userTable" 
              @current-change="handlecurrentChange"
              style="width: 100%"
            >
              <el-table-column prop="userName" label="用户姓名" width=""></el-table-column>
              <el-table-column prop="email" label="邮箱" width=""></el-table-column>
              <el-table-column prop="phonenumber" label="手机号" width=""></el-table-column>
              <el-table-column prop="roleName" label="角色" width=""></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pageContainer">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableDetail.pageNum"
                :page-sizes="[10, 15, 20, 50]"
                :page-size="tableDetail.pageSize"
                layout="sizes, prev, pager, next, total"
                :total="tableDetail.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      center
      width="50%"
      top="20vh"
      class=""
      v-loading="dialog.loading"
      :visible.sync="dialog.show"
      :title="dialog.title"
      @closed="closeDialog"
    >
      <!-- <p class="dialog-p" v-show="dialog.belong">所属分类: {{ dialog.belong }}</p>
      <label class="dialog-label">
        {{ dialog.label }}
        <el-input v-model="dialog.value" />
      </label> -->
      <el-form ref="dialogForm" :model="dialogForm">
        <el-form-item label="姓名">
          <el-input v-model="dialogForm.userName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="dialogForm.phonenumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="dialogForm.email" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <!-- <el-input v-model="dialogForm.roleName"></el-input> -->
          <el-select v-model="dialogForm.roleId" placeholder="请选择角色"  style="width: 300px">
            <el-option v-for="(item, index) in userRole" :key="index" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="dialog.submitShow" type="primary" @click="dialog.submit">{{ dialog.submitText }}</el-button>
        <el-button v-show="dialog.changeShow" type="primary" @click="dialog.change">{{ dialog.changeText }}</el-button>
        <el-button v-show="dialog.deleteShow" type="danger" @click="dialog.delete">{{ dialog.deleteText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserManageAction, getUMDetailsAction, getRoleAction  } from "@/api/manage/userManager";
export default {
  name: "manageManager",
  data() {
    return {
      // 版本号
      version: "3.8.1",
      input: null,
      detail: {
        loading: false,
        show: false,
        tab: 24
      },
      userTable: [],
      userRole: [],
      currentRow: null,
      // table数据 分页数据
      tableDetail: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        currentPage: 1,
        searchValue: null,
      },
      dialog: {
        show: false,
        loading: false,
        title: 'xxxx',
        submitShow: false,
        changeShow: false,
        deleteShow: false,
        submit: this.detailsSubmit,
        change: this.detailsChange,
        delete: this.detailsDelete,
        submitText: '提交',
        changeText: '修改',
        deleteText: '删除',

      },
      dialogForm: {
        id: null,
        userName: null,
        email: null,
        phonenumber: null,
        roleId: null,
      }
    };
  },
  mounted() {
    this.getData()
    this.getRole()
  },
  methods: {
    // 获取表格数据
    getData() {
      this.detail.loading = true
      const params = {
        pageNum: this.tableDetail.pageNum,
        pageSize: this.tableDetail.pageSize
      }
      getUserManageAction(params).then((res) => {
        console.log("表格数据")
        console.log(res)
        this.tableDetail.total = res.data.total
        this.userTable = res.data.list
        this.detail.loading = false
      })
    },
    // 获取角色列表
    getRole() {
      getRoleAction().then((res) => {
        console.log('用户权限')
        console.log(res)
        this.userRole = res.data
      })
    },
    // 根据ID获取详细信息
    getDetailsData(val) {
      this.dialog.loading = true
      const list = {
        id: val,
        data: {
          pageNum: this.tableDetail.pageNum,
          pageSize: this.tableDetail.pageSize
        }
      }
      getUMDetailsAction(list).then((res) => {
        console.log('ID对应详情')
        console.log(res)
        const { id, userName, email, phonenumber, roleId } = res.data
        this.dialogForm.id = id
        this.dialogForm.userName = userName
        this.dialogForm.email = email
        this.dialogForm.phonenumber = phonenumber
        this.dialogForm.roleId = roleId
        this.dialog.loading = false
      })
    },

    // 选中表格中的一行
    handlecurrentChange(val, oldVal) {
      if (val) {
        this.dialog.show = true
        this.dialog.title = '用户详情'
        this.dialog.submitShow = false
        this.dialog.changeShow = true
        this.dialog.deleteShow = true
        this.getDetailsData(val.id)
      }
    },

    // 取消选择
    cancelSelect(row) {
      this.$refs.tableData.setCurrentRow(row)
    },
    // 修改每页数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.tableDetail.pageNum = 1
      this.tableDetail.pageSize = val
      this.getData()
    },
    // 页面跳转
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.tableDetail.pageNum = val
      this.getData()
    },
    // 添加成员
    addManager() {
      this.dialog.show = true
      this.dialog.title = '添加人员'
      this.dialog.submitShow = true
      this.dialog.changeShow = false
      this.dialog.deleteShow = false

    },
    // 对话框关闭事件
    closeDialog() {
      console.log('关闭对话框')
      const formName = ['id' , 'userName', 'email', 'phonenumber', 'roleId']
      formName.forEach((item) =>{ this.dialogForm[item] = null })
      this.cancelSelect()
    },
    // 添加，修改，删除 人员信息
    detailsSubmit() {

    },
    detailsChange() {

    },
    detailsDelete() {

    }

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
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #ccc;
        h4 {
          font-weight: bold;
          line-height: 25px;
          margin: 0;
        }
        > *:not(:last-child) {
          margin-right: 20px;
        }
      }
      &-container {
        padding: 15px;
      }
    } 

  }
  .pageContainer {
    text-align: center;
    padding: 20px 0;
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
  .dialog {
    &-p {
      font-weight: normal;
    }
    &-label {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      font-weight: normal;
      color: #666;
      .el-input {
        margin: 10px auto;
      }
    }
    &-footer {
      .el-button {
       
      }
    }
  }
</style>

