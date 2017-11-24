import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {getArticleListByPage, removeUser, batchRemoveUser, editUser, addUser, getArticleInfoListByPage, saveOrUpdateArticleInfo} from '../../api/api';
import ElCol from "element-ui/packages/col/src/col";
import ElRow from "element-ui/packages/row/src/row";

export default {
    components: {
        ElRow,
        ElCol},
    data() {
        return {
            filters : {
                pageNum: 1,
                pageSize: 0
            },
            articleList: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            postType: '原创',
            articleType:'深度学习',
            articleTypeList: [{
                value: 'typ1',
                label: '机器学习'
            }, {
                value: 'type2',
                label: '大数据'
            }, {
                value: 'type3',
                label: '深度学习'
            }],

            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
            },
            //编辑界面数据
            dataForm: {
                id: 0,
                title: '',
                author: 'zola',
                userId: -1,
                categoryId: 0,
                publicDate: '',
                postType: '',
                isPublish: 1
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            dataFormRules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
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
            this.getArticleInfos();
        },

        getArticleInfos() {
            let para = this.filters;
            console.log(para.pageNum)
            this.listLoading = true;
            getArticleListByPage(para).then((res) => {
                this.total = res.data.total;//res.data.total;
                this.articleList = res.data.list; //res.data.articleList;
                console.log(this.articleList)
                this.listLoading = false;
            });
        },

        //获取用户列表
        // getUsers() {
        //     let para = {
        //         page: this.page,
        //         name: this.filters.name
        //     };
        //     this.listLoading = true;
        //     //NProgress.start();
        //     getUserListPage(para).then((res) => {
        //         this.total = res.data.total;
        //         this.users = res.data.users;
        //         this.listLoading = false;
        //         //NProgress.done();
        //     });
        // },
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
                    this.getArticleInfos();
                });
            }).catch(() => {

            });
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.dataForm = Object.assign({}, row);
        },
        //显示新增界面
        addArticle: function () {
            this.addFormVisible = true;
            this.dataForm = {
                id: 0,
                title: 'qwe',
                author: 'zola',
                userId: 1,
                categoryId: 0,
                publicDate: '',
                postType: '',
                isPublish: 1
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
                        para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        editUser(para).then((res) => {
                            this.editLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['dataForm'].resetFields();
                            this.editFormVisible = false;
                            this.getArticleInfos();
                        });
                    });
                }
            });
        },
        //新增
        saveOrUpdate: function () {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        this.dataForm = Object.assign({}, this.dataForm);
                        let para = this.dataForm;
                        console.log(para);
                        saveOrUpdateArticleInfo(para).then((res) => {
                            this.addLoading = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['dataForm'].resetFields();
                            this.addFormVisible = false;
                            this.getArticleInfos();
                        }).catch(function (error) {
                            console.log(error);
                        });
                    });
                }
            });
        },

        //新增
        addSubmit: function () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        addUser(para).then((res) => {
                            this.addLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getArticleInfos();
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
                    this.getArticleInfos();
                });
            }).catch(() => {

            });
        }
    },
    mounted() {
        this.getArticleInfos();
    }
}