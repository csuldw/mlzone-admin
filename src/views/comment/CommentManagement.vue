<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getArticleByPage">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column prop="sex" label="评论人" width="120" sortable></el-table-column>
			<el-table-column prop="name" label="被评论人" width="120" :formatter="formatSex" sortable></el-table-column>
			<el-table-column prop="age" label="评论内容" width="150" sortable></el-table-column>
			<el-table-column prop="birth" label="发表日期" width="120" sortable></el-table-column>
			<el-table-column prop="postType" label="所属文章" min-width="120" sortable></el-table-column>

			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;"></el-pagination>
		</el-col>

	</section>
</template>

<script src="../../js/comment/CommentManagement.js"></script>

<style scoped>

</style>