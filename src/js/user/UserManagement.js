import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, saveOrUpdateUser, addUser } from '../../api/api';
import ElCol from "element-ui/packages/col/src/col";

export default {
	components: {ElCol},
	data() {
		return {
            filters : {
                pageNum: 1,
                pageSize: 0,
                keywords: ''
            },
			users: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			userTypeList: [{
					value: 'typ1',
					label: '管理员'
				}, {
					value: 'type2',
					label: '普通用户'
				}],
			userType: '管理员',

			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},

			dataForm:{
                id: 0,
                username: '',
                nickname: -1,
				password: '',
                sex: 0,
                birthday: '',
                address: ''
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			dataFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
		}
	},
	methods: {
		//性别显示转换
		formatSex: function (row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//获取用户列表
		getUsers() {
			let para = this.filters;
			this.listLoading = true;
			//NProgress.start();
			getUserListPage(para).then((res) => {
				this.total = res.data.total;
				this.users = res.data.list;
				this.listLoading = false;
				//NProgress.done();
			});
		},
		//删除
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { id: row.id };
				removeUser(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getUsers();
				});
			}).catch(() => {

			});
		},
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.dataForm = Object.assign({}, row);
			console.log(this.dataForm)
		},
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.dataForm = {
                id: 0,
                username: '',
                nickname: -1,
                password: '',
                sex: 0,
                birthday: '',
                address: ''
            };
		},
		//编辑
		editSubmit: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.dataForm);
						para.birthday = (!para.birthday || para.birthday == '') ? '' : util.formatDate.format(new Date(para.birthday), 'yyyy-MM-dd');
                        saveOrUpdateUser(para).then((res) => {
							this.editLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['dataForm'].resetFields();
							this.editFormVisible = false;
							this.getUsers();
						});
					});
				}
			});
		},
		//新增
		addSubmit: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.dataForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						addUser(para).then((res) => {
							this.addLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['dataForm'].resetFields();
							this.addFormVisible = false;
							this.getUsers();
						});
					});
				}
			});
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		//批量删除
		batchRemove: function () {
			var ids = this.sels.map(item => item.id).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { ids: ids };
				batchRemoveUser(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getUsers();
				});
			}).catch(() => {

			});
		}
	},
	mounted() {
		this.getUsers();
	}
}
