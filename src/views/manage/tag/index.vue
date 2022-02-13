<template>
  <div class="manage-box tags" v-loading="showLoading">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="manage-box-header">
          <div class="manage-box-header-left">
            <h3 class="mr10">标签管理</h3>
            <el-tooltip placement="right" effect="light">
              <div slot="content">
                <ul style="margin: 0;">
                  <li>标签管理用于用户在泵业垂搜中心精确筛选产品类型，<br/>从而进一步通过技术参数筛选出需要的产品型号。</li>
                  <li>标签的增/删/改/禁将影响到垂搜中心所有产品。</li>
                </ul>
              </div>
              <el-button>Top center</el-button>
              <svg-icon icon-class="tips" />
            </el-tooltip>
          </div>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="tagsDialog">添加标签分类</el-button>
        </div>
      </el-col>

      <el-col :span="24">
        <el-collapse class="collapse" @change="collapseChange" accordion>
          <el-collapse-item class="collapse-item" v-for="(item, index) in tags" :key="index" :name="index">
            <template slot="title">
              <el-row style="flex: 1;">
                <el-col :span="12">
                   {{ item.labelName }} ( {{item.twoLevelCount}} )
                </el-col>
                <el-col :span="4" class="alc">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click.stop="tagDialog(item.labelName, item.id)">添加标签</el-button>
                </el-col>
                <el-col :span="2" class="alc">
                  <el-button type="text" @click.stop="editTags(item.id, item.labelName)">编辑</el-button>
                </el-col>
                <el-col :span="4" class="alc">
                  <el-button type="text" @click.stop="toggleForbiddenTags(item.id, 1)">禁用</el-button>
                </el-col>
                <el-col :span="2" class="alc">
                  <el-button type="text" @click.stop="deleteTags(item.id)">删除</el-button>
                </el-col>
              </el-row>
            </template>
            
            <ul class="collapse-ul" v-loading="showLoadingTwoLevel">
              <li class="collapse-li" v-for="(item, index) in tagItem" :key="index">
                <el-row>
                  <el-col :span="6">
                    {{ item.labelName }}  
                  </el-col>
                  <el-col :span="10">
                    已被{{  }}条数据引用
                  </el-col>
                  <!-- <el-col :span="4" class="alc">
                    <el-button type="primary" size="small" icon="el-icon-plus" >添加标签</el-button>
                  </el-col> -->
                  <el-col :span="2" class="alc">
                    <el-button type="text" @click.stop="editTags(item.id, item.labelName)">编辑</el-button>
                  </el-col>
                  <el-col :span="4" class="alc">
                    <el-button v-if="Number(item.labelStatus) === 1" type="text" @click.stop="toggleForbiddenTags(item.id, item.labelName, item.labelStatus)">禁用</el-button>
                    <div v-else>
                      已禁用，
                      <el-button type="text" @click.stop="">启用</el-button>
                    </div>
                  </el-col>
                  <el-col :span="2" class="alc">
                    <el-button type="text" @click.stop="deleteTags(item.id)">删除</el-button>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      

    </el-row>
    <el-dialog
      center
      width="30%"
      top="20vh"
      class="dialog"
      :visible.sync="dialog.show"
      :title="dialog.title" 
    >
      <p class="dialog-p" v-show="dialog.belong">所属分类: {{ dialog.belong }}</p>
      <label class="dialog-label">
        {{ dialog.label }}
        <el-input v-model="dialog.value" />
      </label>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog.submit">{{ dialog.submitText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFirstLevelTagsAction, getSecondLevelTagsAction, addTagAction, deleteTagsAction, updateTagsAction  } from "@/api/manage/tags";

export default {
  name: "manageTag",
  data() {
    return {
      // 版本号
      version: "3.8.1",
      showLoading: false,
      showLoadingTwoLevel: false,
      activeChild: null,
      tags: [
      //   {
      //   id: 1,
      //   name: '按行业',
      //   value: 9,
      // }, {
      //   id: 2,
      //   name: '按原理',
      //   value: 9,
      // }, {
      //   id: 3,
      //   name: '按用途',
      //   value: 9,
      // }, {
      //   id: 4,
      //   name: '按介质',
      //   value: 9,
      // }, {
      //   id: 5,
      //   name: '按结构',
      //   value: 9,
      // }
      ],
      tagItem: [
         {
            "id": null,
            "labelName": null,
            "labelLevel": null,
            "labelParentId": null,
            "labelStatus": null,
            "createTime": null,
            "updateTime": null
        },
      ],
      dialog: {
        show: false,
        title: 'xxxx',
        belong: null,
        belongID: null,
        label: 'xxxx',
        value: 'xxx',
        submit: this.addTags,
        submitText: '确定'
      },
      select: {
        id: null,
        name: null,
        status: 1,
      }
    };
  },
  mounted() {
    this.showLoading = true
    this.getTags_1()
  },
  methods: {
    async getTagsData() {
      this.showLoading = true
      await this.getTags_1()
      if (typeof(this.activeChild) === 'number') {
        this.showLoadingTwoLevel = true
        await this.getTags_2(this.activeChild)
      }
    },
    // 获取一级标签
    getTags_1() {
      // console.log('tags')
      getFirstLevelTagsAction().then((res) => {
        this.tags = res.data
        this.showLoading = false;
      })
    },
    // 获取二级标签
    getTags_2(val) {
      const id = this.tags[val].id
      getSecondLevelTagsAction(id).then((res) => {
        this.tagItem = res.data
        this.showLoadingTwoLevel = false
      })
    },
    goTarget(href) {
      window.open(href, "_blank");
    },
    // 折叠面板缩放
    collapseChange(val) {
      this.activeChild = val
      this.tagItem = [{
          "id": null,
          "labelName": null,
          "labelLevel": null,
          "labelParentId": null,
          "labelStatus": null,
          "createTime": null,
          "updateTime": null
        }]
      if(typeof(val) === 'number') {
        this.showLoadingTwoLevel = true
        this.getTags_2(val)
      }
    },
    // 一级标签对话框属性
    tagsDialog() {
      this.dialog.show = true;
      this.dialog.title = '添加标签分类'
      this.dialog.belong = null
      this.dialog.belongID = null
      this.dialog.label = '标签分类名称'
      this.dialog.value = null
      this.dialog.submitText = '提交'
      this.dialog.submit = this.addTags
    },
    // 二级标签对话框属性
    tagDialog(name, id) {
      this.dialog.show = true
      this.dialog.title = '添加标签'
      this.dialog.belong = name
      this.dialog.belongID = id
      this.dialog.label = '标签名称'
      this.dialog.value = null
      this.dialog.submitText = '提交'
      this.dialog.submit = this.addTag
    },
    // 添加一级标签
    addTags() {
      // console.log('添加标签分类')
      if(this.dialog.value) {
        const params = {
          labelName: this.dialog.value,
          labelLevel: 1
        }
        addTagAction(params).then((res) => {
          this.dialog.show = false
          // this.showLoading = true
          this.$message.success('添加标签成功！')
          this.getTagsData()
          // this.getTags_1()
        })
      }
      
    },
    // 添加二级标签
    addTag() {
      console.log('添加标签')
      if(this.dialog.value) {
         const params = {
          labelName: this.dialog.value,
          labelLevel: 2,
          labelParentId: this.dialog.belongID
        }
        addTagAction(params).then((res) => {
          this.dialog.show = false
          this.$message.success('添加标签成功！')
          this.getTagsData()
          // if (typeof(this.activeChild) === 'number') {
          //   this.showLoadingTwoLevel = true
          //   this.getTags_2(this.activeChild)
          // }
        })
      }
    },
    // 提交修改过的标签分类
    postEditTasgs() {
      // console.log('修改标签分类')
      // console.log('id:'+this.select.id+'name:' +this.select.name)
      const list = {
        id: this.select.id,
        data: {
          labelName: this.dialog.value,
          // labelStatus: this.select.status
        }
      }
      updateTagsAction(list).then((res) => {
        this.dialog.show = false
        this.$message.success('标签修改成功！')
        this.getTagsData()
      })
    },
    // 标签分类
    // 编辑标签分类
    editTags(id, name) {
      this.select.id = id
      this.select.name = name
      // this.select.status = status
      this.dialog.show = true
      this.dialog.title = '编辑标签名称'
      this.dialog.belong = null
      this.dialog.label = '标签分类名称'
      this.dialog.value = this.select.name
      this.dialog.submitText = '确定'
      this.dialog.submit = this.postEditTasgs
    },
    // 禁用标签分类
    toggleForbiddenTags(id, name, status) {
      const list  = {
        id: id,
        data: {
          labelName: name,
          labelStatus: Number(status) === 1 ? '2' : '1'
        }
      }
      console.log(Number(status))
      if (Number(status) === 1) {
        this.$confirm('确定禁用当前标签分类吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          
        }).then(() => {
          updateTagsAction(list).then((res) => {
            this.$message.success('标签修改成功！')
            this.getTagsData()
          })
        }).catch(() => {})
      } else {
        this.$confirm('确定启用当前标签分类吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          
        }).then(() => {
          updateTagsAction(list).then((res) => {
            this.$message.success('标签修改成功！')
            this.getTagsData()
          })
        }).catch(() => {})
      }
      
    },
    // 启用标签分类
    startTags() {

    },
    // 删除标签分类
    deleteTags(val) {
      this.$confirm('确定删除当前标签分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
        
      }).then(() => {
        deleteTagsAction(val).then((res) => {
          this.$message.success('已删除！')
          this.getTagsData()
        })
      }).catch(() => {})
    }

  },
};
</script>

<style lang="scss">
  .alc {
    text-align: center;
  }
  .collapse {
    &-item {
      .el-collapse-item__wrap {
        background-color: #f6f6f6;
      }
    }
    &-ul, &-li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    &-ul {
      margin-bottom: -25px;
    }
    &-li {
      line-height: 36px;
      padding: 5px;
      padding-right: 20px;
      border-bottom: 1px solid #ccc;
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
        width: 60%;
      }
    }
  }
</style>

