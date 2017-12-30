<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keywords" placeholder="关键字" @keyup.enter.native="getArticleInfos"></el-input>
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
      <el-table-column prop="author" label="作者" width="120" sortable></el-table-column>
      <el-table-column prop="articleCategoryEntity.categoryName" label="文章类别" width="120" sortable></el-table-column>
      <el-table-column prop="postType" label="发表类型" min-width="120">
        <template scope="scope">
          <div v-show='scope.row.postType==0'  @click='updateBugStatus(scope.$index, scope.row)'>原创</div>
          <div v-show='scope.row.postType==1'  @click='updateBugStatus(scope.$index, scope.row)'>转载</div>
        </template>
      </el-table-column>
      <el-table-column prop="isPublish" label="是否发表" min-width="120">
        <template scope="scope">
          <div v-show='scope.row.isPublish==1'  @click='updateBugStatus(scope.$index, scope.row)'>是</div>
          <div v-show='scope.row.isPublish==0'  @click='updateBugStatus(scope.$index, scope.row)'>否</div>
        </template>
      </el-table-column>
      <el-table-column prop="publicDate" label="发表日期" width="200"></el-table-column>
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
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.pageSize" :total="total" style="float:right;"></el-pagination>
    </el-col>

    <!--新增界面-->
    <el-dialog title="添加文章" v-model="addFormVisible" @close="cancelAdd" :close-on-click-modal="false" class="el-dialog-add-article">
      <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" style="text-align:center;">
        <el-row >
          <el-col :span="22">
            <el-form-item label="标题：" prop="title">
              <el-input  v-model="dataForm.title" auto-complete="on" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文章类别：">
              <el-select v-model="articleType" placeholder="请选择文章类别">
                <el-option v-for="item in articleTypeList" :key="item.id" :label="item.categoryName" :value="item.categoryName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="18" align="left">
            <el-form-item label="上传文章：">
              <el-upload class="upload-demo"
                         action="http://localhost:8080/MLZone/file/uploadFile.do"
                         :on-success="uploadArticleFileSuccess"
                         :onError="uploadError"
                         :data="uploadArticleParams"
                         :limit=1
                         ref="uploadFileAdd"
                         :before-upload="handleSendBefore">
                <el-button size="small" type="primary"  @click="clearUploadFileAdd">文件上传</el-button>
                <span class="el-upFilload__tip" slot="tip" style="margin-left:10px;">请上传md格式内容的文件.</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="18" align="left">
            <el-form-item label="展示图片：">
              <el-upload class="upload-demo"
                         action="http://localhost:8080/MLZone/file/uploadFile.do"
                         :on-success="uploadArticleCoverSuccess"
                         :onError="uploadError"
                         :data="uploadImageParams"
                         :limit=1
                         ref="uploadImageAdd"
                         :before-upload="handleImgSendBefore">
                <el-button size="small" type="primary"  @click="clearUploadImageAdd">图片上传</el-button>
                <span class="el-upFilload__tip" slot="tip" style="margin-left:10px;">请上传图片格式内容的文件.</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="18">
            <el-form-item label="关键字：" prop="phone">
              <el-input  v-model="dataForm.userId" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="11">
            <el-form-item label="作者：">
              <el-input  v-model="dataForm.author" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
        </el-row >
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click.native="saveOrUpdate('save')" :loading="addLoading">&nbsp;提交发表&nbsp;</el-button>
        <el-button @click.native="cancelAdd"> &nbsp;取消操作&nbsp;</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="修改文章信息" v-model="editFormVisible" @close="cancelEdit" :close-on-click-modal="false" class="el-dialog-add-article">
      <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm">
        <el-row >
          <el-col :span="22">
            <el-form-item label="标题：" prop="title">
              <el-input  v-model="dataForm.title" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文章类别：">
              <el-select v-model="dataForm.categoryId" placeholder="请选择文章类别">
                <el-option v-for="item in articleTypeList" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="18" align="left">
            <el-form-item label="上传文章：">
              <el-upload class="upload-demo"
                         action="http://localhost:8080/MLZone/file/uploadFile.do"
                         :on-success="uploadArticleFileSuccess"
                         :onError="uploadError"
                         :data="uploadArticleParams"
                         :limit=1
                         ref="uploadFileEdit"
                         :before-upload="handleSendBefore"
                         >
                <el-button size="small" type="primary" @click="clearUploadFileEdit" >文件上传</el-button>
                <span class="el-upload__tip" slot="tip" style="margin-left:10px;">请上传MD格式内容的文件.</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="18" align="left">
            <el-form-item label="展示图片：">
              <el-upload class="upload-demo"
                         action="http://localhost:8080/MLZone/file/uploadFile.do"
                         :on-success="uploadArticleCoverSuccess"
                         :onError="uploadError"
                         :data="uploadImageParams"
                         :limit=1
                         ref="uploadImageEdit"
                         :before-upload="handleImgSendBefore">
                <el-button size="small" type="primary"  @click="clearUploadImageEdit">图片上传</el-button>
                <span class="el-upFilload__tip" slot="tip" style="margin-left:10px;">请上传图片格式内容的文件.</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="22">
            <el-form-item label="关键字：">
              <el-input  v-model="dataForm.keywords" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="作者：">
              <el-input  v-model="dataForm.author" auto-complete="off" >111</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="11">
            <el-form-item label="发表类型：">
              <el-radio-group v-model="dataForm.postType">
                <el-radio class="radio" :label="0">原创</el-radio>
                <el-radio class="radio" :label="1">转载</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--<el-row >-->
            <!--<el-col :span="11">-->
              <!--<el-form-item label="发表日期：" >-->
                <!--<el-input  v-model="dataForm.publicDate" auto-complete="off" >111</el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <el-col :span="11">
            <el-form-item label="是否发表：">
              <el-radio-group v-model="dataForm.isPublish">
                <el-radio class="radio" :label="1">是</el-radio>
                <el-radio class="radio" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click.native="saveOrUpdate('update')" :loading="editLoading">&nbsp;保存修改&nbsp;</el-button>
        <el-button @click.native="cancelEdit"> &nbsp;取消操作&nbsp;</el-button>
      </div>
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="editFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="saveOrUpdate" :loading="editLoading">提交</el-button>-->
      <!--</div>-->
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
    width: 1600px;
  }
  .dialog-footer{
    margin-top:-30px;
    padding-bottom: 10px;
    text-align: center;
  }
</style>