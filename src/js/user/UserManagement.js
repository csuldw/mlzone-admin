import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, saveOrUpdateUser, checkUserExistByUsername } from '../../api/api';
import ElCol from "element-ui/packages/col/src/col";

export default {
	components: {ElCol},
	data() {
        let checkUsername = (rule, value, callback) => {
            let para = {
                'username': value
            }
            console.log(this.pastValue)
            if(this.pastValue === value) {
                callback()
            }else{
                checkUserExistByUsername(para).then(function (res) {
                    if (res.result === "success" && res.isExist === true) {
                        callback("用户名已占用!")
                    } else {
                        callback()
                    }
                })
				.catch(function () {
					callback(new Error('服务异常'))
				})
			}
        };
        let validPhone = (rule, value,callback)=>{
        	console.log(value)
            if (!value){
                callback(new Error('请输入电话号码'))
            }else  if (!util.isValidPhone(value)){
                callback(new Error('请输入正确的11位手机号码'))
            }else {
                callback()
            }
        };
		return {
            filters : {
                pageNum: 1,
                pageSize: 10,
                keywords: ''
            },
			users: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			userTypeList: [{
					id: 0,
					label: '管理员'
				}, {
					id: 1,
					label: '普通用户'
				}],
			userType: 0,

			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},
			pastValue: '',
			dataForm:{
                id: 0,
                username: '',
                nickname: -1,
				password: '',
                sex: 0,
                birthday: '',
                address: '',
				userType: 1,
                accountSource: 0
			},
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			dataFormRules: {
				username: [
                    { validator: checkUsername, trigger: 'blur' },
                    { required: true,message: '请输入用户名',trigger: 'blur' },
					{ min: 2,max: 25,message: '长度在 4 到 25 个字符'}
				],
				password: [
                    {required: true, message: '请输入密码',trigger: 'blur'},
					{min: 6,max: 32,message: '长度在 6 到 30 个字符'},
				],
                phoneNumber : [
                    { required: true, trigger: 'blur', validator: validPhone }
				],
                email: [
                    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur'}
                ],
			},
		}

	},
	methods: {
		//性别显示转换
		formatSex: function (row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
        handleSizeChange(val) {
            this.filters.pageSize = val;
            this.handleCurrentChange(1);
            this.getUsers();
        },
        handleCurrentChange(val) {
            this.filters.pageNum = val;
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
		// //删除
		// handleDel: function (index, row) {
		// 	this.$confirm('确认删除该记录吗?', '提示', {
		// 		type: 'warning'
		// 	}).then(() => {
		// 		this.listLoading = true;
		// 		//NProgress.start();
		// 		let para = { id: row.id };
		// 		removeUser(para).then((res) => {
		// 			this.listLoading = false;
		// 			//NProgress.done();
		// 			this.$message({
		// 				message: '删除成功',
		// 				type: 'success'
		// 			});
		// 			this.getUsers();
		// 		});
		// 	}).catch(() => {
        //
		// 	});
		// },
		//显示编辑界面
		handleEdit: function (index, row) {
			this.editFormVisible = true;
			this.dataForm = Object.assign({}, row);
			this.pastValue = this.dataForm.username
			console.log(this.dataForm)
		},
		//显示新增界面
		handleAdd: function () {
			this.addFormVisible = true;
			this.dataForm = {
                id: 0,
                username: '',
                nickname: '',
                password: '',
                sex: 0,
                birthday: '',
                address: '',
                userType: 1
            };
		},
		//编辑
        saveOrUpdate: function () {
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
	},
	mounted() {
		this.getUsers();
	}
}
