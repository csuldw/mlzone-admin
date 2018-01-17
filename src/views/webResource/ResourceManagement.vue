<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keywords" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getWebResourceList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="resourceList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="name" label="资源名称" width="150" sortable></el-table-column>
			<el-table-column prop="url" label="资源链接" min-width="350" sortable></el-table-column>
			<el-table-column prop="author" label="作者" width="200" sortable></el-table-column>
			<el-table-column prop="sourceType" label="资源类型" width="310" sortable></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.pageSize" :total="total" style="float:right;"></el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="修改资源信息" v-model="editFormVisible" @close="cancelEdit" :close-on-click-modal="false" class="el-dialog-add-article">
			<el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm">
				<el-row >
					<el-col :span="22">
						<el-form-item label="资源名称：" prop="name">
							<el-input  v-model="dataForm.name" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="22">
						<el-form-item label="资源链接：" prop="url">
							<el-input  v-model="dataForm.url" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="作者：" prop="author">
							<el-input v-model="dataForm.author"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="18">
						<el-form-item label="展示图片：">
							<el-upload class="upload-demo"
									   action="http://localhost:8080/MLZone/file/uploadFile.do"
									   :on-success="uploadAvatorSuccess"
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
						<el-form-item label="资源类型：" >
							<el-select v-model="dataForm.sourceType" placeholder="请选择文章类别">
								<el-option label="开源框架" value="openSource"></el-option>
								<el-option label="互动链接" value="link"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="31">
						<el-form-item label="资源描述：" prop="desc">
							<div class="source-desc-item">
								<el-input
										type="textarea"
										:rows="5"
										placeholder="请输入内容"
										v-model="dataForm.desc">
								</el-input>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center">
				<el-button type="primary" @click.native="saveOrUpdate('update')">&nbsp;保存修改&nbsp;</el-button>
				<el-button @click.native="cancelEdit"> &nbsp;取消操作&nbsp;</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script src="../../js/webResource/ResourceManagement.js"></script>

<style scoped>

</style>
