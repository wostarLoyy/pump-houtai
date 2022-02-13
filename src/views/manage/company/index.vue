<template>
 <div class="manage-box com">
    <el-row :gutter="10" v-loading="detail.loading">
      <!-- 第一列 -->
      <el-col :span="detail.tab" :xs="24">
        <div class="manage-box-item">
          <div class="manage-box-item-header">
            <h4>企业管理</h4>
          </div>
          <div class="manage-box-item-container">
            <ul class="list">
              <li 
                class="list-item" 
                v-for="(item, index) in companyData_1" 
                :key="item.id"
                :class="{active:item.active}"
                @click="selectList(index)"
              >
                <p class="list-text">
                  {{ item.name }}
                </p>
                <p class="list-text">
                  {{ item.value }}
                </p>
              </li>
            </ul>
          </div>
          <el-button @click.native="showDetails"> 23</el-button>
        </div>
      </el-col>
      <!-- 第二列 -->
      <el-col :span="detail.tab" :xs="24">
        <div class="manage-box-item">
          <div class="manage-box-item-header">
            <h4>{{ companyData_1_select.name }}</h4>
          </div>
          <div class="manage-box-item-container">
            

          </div>
        </div>
      </el-col>
      <!-- 第三列 -->
      <el-col :span="detail.tab" :xs="24" v-show="detail.show">
        <div class="manage-box-item">xianshiyincang</div>
      </el-col>
    </el-row>
 </div>
</template>

<script>
export default {
  name: "manageCompany",
  data() {
    return {
      // 版本号
      version: "3.8.1",
      detail: {
        loading: false,
        show: false,
        tab: 12
      },
      companyData_1: [{
        id: 1,
        name: '已通过',
        value: 0,
        active: true,
      }, {
        id: 2,
        name: '申请中',
        value: 0,
        active: false,
      }, {
        id: 3,
        name: '已拒绝',
        value: 0,
        active: false,
      }, {
        id: 4,
        name: '已暂停',
        value: 0,
        active: false,
      }, {
        id: 5,
        name: '已禁用',
        value: 0,
        active: false,
      }],
      companyData_1_select: {
        id: 1,
        name: '已通过'
      },
      companyData_2_config: {
        dataCurrent: 1,
        dataSize: 10,
        dataTotal: 100,
        dataFilterDate: 1,
        dataFilterNumber: 1
      }
    };
  },
  methods: {
    showDetails() {
      this.detail.loading = true
      setTimeout(() => {
        this.detail.loading = false
        this.detail.show = !this.detail.show
        this.detail.tab = this.detail.tab ===8 ? 12 : 8
      }, 500)
    },
    selectList(val) {
      const selectIndex = val
      if(this.companyData_1[selectIndex].active) {
        return
      } else {
        this.companyData_1.map((item) => {
          item.active = false
        })
        this.companyData_1[selectIndex].active = true
        this.companyData_1_select.id = this.companyData_1[selectIndex].id
        this.companyData_1_select.name = this.companyData_1[selectIndex].name
      }
      // console.log(this.companyData_1_select.name)
    }
  },
};
</script>

<style scoped lang="scss">
  .manage-box {
   &-item {
     background-color: #fff;
     min-height: calc(100vh - 60px);
    //  margin-bottom: 20px;
    &-header {
      padding: 15px;
      border-bottom: 1px solid #ccc;
      h4 {
        line-height: 25px;
        margin: 0;
      }
    }
   } 
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

