import { getUserList } from '../../api/api';
//import NProgress from 'nprogress'
export default {
	data() {
		return {
			filters: {
				name: ''
			},
			loading: false,
			users: [
			]
		}
	},
	methods: {
		//性别显示转换
		formatSex: function (row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		//获取用户列表
		getUser: function () {
			let para = {
				name: this.filters.name
			};
			this.loading = true;
			//NProgress.start();
			getUserList(para).then((res) => {
				this.users = res.data.users;
				this.loading = false;
				//NProgress.done();
			});
		}
	},
	mounted() {
		this.getUser();
	}
};
