<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getArticleInfos">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticle">添加文章</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="articleList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <!--<el-table-column type="selection" width="55"></el-table-column>-->
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" width="140" sortable></el-table-column>
      <el-table-column prop="userId" label="作者" width="120" sortable></el-table-column>
      <el-table-column prop="categoryId" label="文章类别" width="120" sortable></el-table-column>
      <el-table-column prop="publicDate" label="发表日期" width="120" sortable></el-table-column>
      <el-table-column prop="postType" label="发表类型" min-width="120" sortable></el-table-column>
      <el-table-column prop="isPublish" label="是否发表" min-width="120" sortable></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;"></el-pagination>
    </el-col>

    <!--新增界面-->
    <el-dialog title="添加文章" v-model="addFormVisible" :close-on-click-modal="false" class="el-dialog-add-article">
      <el-form :model="dataForm" label-width="100px" :rules="addFormRules" ref="dataForm" style="text-align:center;">
        <el-row >
          <el-col span="22">
            <el-form-item label="标题：" prop="title">
              <el-input  v-model="dataForm.title" auto-complete="on" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="作者：">
              <el-input  v-model="dataForm.userId" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="文章类别：">
              <el-select v-model="articleType" placeholder="请选择文章类别">
                <el-option v-for="(item, ids) in articleTypeList" :key="ids" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col span="18" align="left">
            <el-form-item label="上传文章：">
              <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :limit="1"
                      :clearFiles="true"
                      :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="addSubmit">上传到服务器</el-button>
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col span="18">
            <el-form-item label="关键字" prop="phone">
              <el-input  v-model="dataForm.userId" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click.native="saveOrUpdate" :loading="addLoading">&nbsp;提交发表&nbsp;</el-button>
        <el-button @click.native="addFormVisible = false"> &nbsp;取消操作&nbsp;</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="修改文章信息" v-model="editFormVisible" :close-on-click-modal="false" class="el-dialog-add-article">
      <el-form :model="dataForm" label-width="100px" :rules="editFormRules" ref="dataForm">
        <el-row >
          <el-col span="22">
            <el-form-item label="标题：" prop="name">
              <el-input  v-model="dataForm.title" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="11">
            <el-form-item label="作者：" prop="pass">
              <el-input  v-model="dataForm.userId" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="文章类别：">
              <el-select v-model="articleType" placeholder="请选择文章类别">
                <el-option v-for="(item, ids) in articleTypeList" :key="ids" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col span="11">
            <el-form-item label="发表日期：" prop="phone">
              <el-input  v-model="dataForm.publicDate" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col span="18" align="left">
            <el-form-item label="上传文章：">
              <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :limit="1"
                      :clearFiles="true"
                      :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="editSubmit">上传到服务器</el-button>
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col span="22">
            <el-form-item label="关键字：" prop="phone">
              <el-input  v-model="dataForm.age" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col span="11">
            <el-form-item label="发表类型：">
              <el-radio-group v-model="dataForm.sex">
                <el-radio class="radio" :label="1">原创</el-radio>
                <el-radio class="radio" :label="0">转载</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col span="11">
            <el-form-item label="是否发表：">
              <el-radio-group v-model="dataForm.aa">
                <el-radio class="radio" :label="1">是</el-radio>
                <el-radio class="radio" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script src="../../js/article/ArticleManagement.js"></script>

<style scoped>
  .el-dialog-add-article{
    position:fixed;
    top:0;
    right:0;
    left:0;
    bottom:0;
    margin:auto;
    width: 1300px;
  }
  .dialog-footer{
    margin-top:-30px;
    padding-bottom: 10px;
    text-align: center;
  }
</style>