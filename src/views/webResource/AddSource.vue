<template>
	<el-form  :model="dataForm" label-width="100px" :rules="dataFormRules" style="margin:20px; width:100%; min-height:600px;" ref="dataForm">
		<el-row>
			<el-col :span="10">
				<el-form-item label="资源名称：" prop="name">
					<el-input v-model="dataForm.name"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="10">
				<el-form-item label="资源链接：" prop="url">
					<el-input v-model="dataForm.url"></el-input>
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
			<el-col :span="10">
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
		<el-form-item label="资源类型：" >
			<el-select v-model="dataForm.sourceType" placeholder="请选择文章类别">
				<el-option label="开源框架" value="openSource"></el-option>
				<el-option label="互动链接" value="link"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="资源描述：" prop="desc">
			<div class="source-desc-item">
				<el-input
						type="textarea"
						:rows="4"
						placeholder="请输入内容"
						v-model="dataForm.desc">
				</el-input>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click.native="saveOrUpdate">立即提交</el-button>
			<el-button @click.native.prevent @click.native="cancelSave">重新编辑</el-button>
		</el-form-item>
	</el-form>
</template>

<script src="../../js/webResource/AddSource.js"></script>

<style>
	#editor {
		margin: auto;
		width: 100%;
		height: 580px;
	}
	.source-desc-item{
		width: 90%;
	}
</style>