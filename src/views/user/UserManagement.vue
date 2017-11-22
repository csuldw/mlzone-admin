<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
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
			<el-table-column type="selection" width="50"></el-table-column>
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="name" label="用户名" width="100" sortable>
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>姓名: {{ scope.row.name }}</p>
						<p>住址: {{ scope.row.addr }}</p>
						<p>电话号码: {{ scope.row.phone }}</p>
						<p>Email: {{ scope.row.email }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.name }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="昵称" width="100" sortable></el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>
			<el-table-column prop="birth" label="出生日期" min-width="120" sortable></el-table-column>
			<!--<el-table-column prop="age" label="电话号码" width="120" sortable></el-table-column>-->
			<!--<el-table-column prop="addr" label="地址" min-width="150" sortable></el-table-column>-->
			<!--<el-table-column prop="age" label="Email" width="100" sortable></el-table-column>-->
			<el-table-column prop="age" label="类别" width="100" sortable></el-table-column>
			<el-table-column prop="age" label="账户来源" width="120" sortable></el-table-column>
			<el-table-column prop="birth" label="注册日期" width="120" sortable></el-table-column>
			<el-table-column label="操作" width="140" ><!--fixed="right"-->
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" align="right">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="添加用户" v-model="addFormVisible" :close-on-click-modal="false" class="el-dialog-add-user">
			<el-form :model="addForm" label-width="140px" :rules="addFormRules" ref="addForm" style="text-align:center;">
				<el-row >
					<el-col span="18">
						<el-form-item label="用户名：" prop="name">
							<el-input  v-model="addForm.name" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col span="18">
						<el-form-item label="密码：" prop="pass">
							<el-input  v-model="addForm.password" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col span="18">
						<el-form-item label="用户类型：">
							<el-select v-model="userType" clearable placeholder="请选择">
								<el-option v-for="(item, ids) in userTypeList" :key="ids" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center">
				<el-button @click.native="addFormVisible = false"> &nbsp;取消&nbsp;</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">&nbsp;提交&nbsp;</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="用户信息修改" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
				<el-row >
					<el-col span="11">
						<el-form-item label="用户名：" prop="name">
							<el-input v-model="editForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col span="11">
						<el-form-item label="密码：" prop="pass">
							<el-input  v-model="addForm.password" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col span="11">
						<el-form-item label="昵称：" prop="name">
							<el-input v-model="editForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col span="11">
						<el-form-item label="生日：">
							<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col span="11">
						<el-form-item label="性别：">
							<el-radio-group v-model="editForm.sex">
								<el-radio class="radio" :label="1">男</el-radio>
								<el-radio class="radio" :label="0">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col span="11">
						<el-form-item label="用户类型：">
							<el-select v-model="userType" clearable placeholder="请选择">
								<el-option v-for="(item, ids) in userTypeList" :key="ids" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col span="11">
						<el-form-item label="电话：" prop="phone">
							<el-input  v-model="addForm.name" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
					<el-col span="11">
						<el-form-item label="Email：" prop="email">
							<el-input  v-model="addForm.age" auto-complete="off" >111</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col span="22">
						<el-form-item label="地址：">
							<el-input type="textarea" v-model="editForm.addr"></el-input>
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