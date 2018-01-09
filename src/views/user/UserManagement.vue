<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keywords" placeholder="关键字" @keyup.enter.native="getUsers"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--<el-table-column type="selection" width="50"></el-table-column>-->
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="username" label="用户名" width="150" sortable>
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>姓名: {{ scope.row.username }}</p>
						<p>住址: {{ scope.row.address }}</p>
						<p>电话号码: {{ scope.row.phoneNumber }}</p>
						<p>Email: {{ scope.row.email }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.username }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="昵称" width="100" sortable></el-table-column>
			<el-table-column prop="sex" label="性别" width="100"  sortable>
				<template scope="scope">
					<div v-show='scope.row.sex==1'>女</div>
					<div v-show='scope.row.sex==0'>男</div>
				</template>
			</el-table-column>
			<el-table-column prop="birthday" label="出生日期" min-width="120" sortable></el-table-column>
			<!--<el-table-column prop="age" label="电话号码" width="120" sortable></el-table-column>-->
			<!--<el-table-column prop="addr" label="地址" min-width="150" sortable></el-table-column>-->
			<!--<el-table-column prop="age" label="Email" width="100" sortable></el-table-column>-->
			<el-table-column prop="userType" label="类别" width="100" sortable>
				<template scope="scope">
					<div v-show='scope.row.userType==0'>管理员</div>
					<div v-show='scope.row.userType==1'>普通用户</div>
				</template>
			</el-table-column>
			<el-table-column prop="accountSource" label="账户来源" width="120" sortable>
				<template scope="scope">
					<div v-show='scope.row.accountSource==0'>本站创建</div>
					<div v-show='scope.row.accountSource==1'>微信</div>
					<div v-show='scope.row.accountSource==2'>新浪</div>
				</template>
			</el-table-column>
			<el-table-column prop="regDate" label="注册日期" width="190" sortable></el-table-column>
			<el-table-column label="操作" width="160" ><!--fixed="right"-->
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" align="right">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.pageSize" :total="total">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="添加用户" v-model="addFormVisible" :close-on-click-modal="false" class="el-dialog-add-user">
			<el-form :model="dataForm" label-width="140px" :rules="dataFormRules" ref="dataForm" style="text-align:center;">
				<el-row >
					<el-col :span="18">
						<el-form-item label="用户名：" prop="username">
							<el-input  v-model="dataForm.username" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="18">
						<el-form-item label="密码：" prop="password">
							<el-input  v-model="dataForm.password" auto-complete="off" type="password">111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="18">
						<el-form-item label="用户类型：">
							<el-select v-model="userType" placeholder="请选择文章类别">
								<el-option v-for="item in userTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center">
				<el-button @click.native="addFormVisible = false"> &nbsp;取消&nbsp;</el-button>
				<el-button type="primary" @click.native="saveOrUpdate" :loading="addLoading">&nbsp;提交&nbsp;</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="用户信息修改" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="dataForm" label-width="90px" :rules="dataFormRules" ref="dataForm">
				<el-row >
					<el-col :span="11">
						<el-form-item label="用户名：" prop="username" >
							<el-input v-model="dataForm.username" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="密码：" prop="password" >
							<el-input  v-model="dataForm.password" auto-complete="off" type="password">111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="11">
						<el-form-item label="昵称：" prop="username">
							<el-input v-model="dataForm.nickname" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="生日：">
							<el-date-picker type="date" placeholder="选择日期" v-model="dataForm.birthday"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="11">
						<el-form-item label="性别：">
							<el-radio-group v-model="dataForm.sex">
								<el-radio class="radio" :label="0">男</el-radio>
								<el-radio class="radio" :label="1">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="用户类型：">
							<el-select v-model="dataForm.userType" placeholder="请选择文章类别">
								<el-option v-for="item in userTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="11">
						<el-form-item label="电话：" prop="phoneNumber">
							<el-input  v-model="dataForm.phoneNumber" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="Email：" prop="email">
							<el-input  v-model="dataForm.email" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="22">
						<el-form-item label="地址：">
							<el-input type="textarea" v-model="dataForm.address"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="saveOrUpdate" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script src="../../js/user/UserManagement.js"></script>

<style scoped>
	.el-dialog-add-user{
		position:fixed;
		top:5%;
		right:0;
		left:0;
		bottom:0;
		margin:auto;
		width: 1000px;
	}
	.dialog-footer{
		margin-top:-30px;
		padding-bottom: 10px;
		text-align: center;
	}
</style>
