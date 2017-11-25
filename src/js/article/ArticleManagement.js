import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {getArticleListByPage, removeUser, deleteArticleInfoById, batchRemoveUser, editUser, addUser, getArticleInfoListByPage, saveOrUpdateArticleInfo} from '../../api/api';
import ElCol from "element-ui/packages/col/src/col";
import ElRow from "element-ui/packages/row/src/row";

export default {
    components: {
        ElRow,
        ElCol
    },
    data() {
        return {
            filters : {
                pageNum: 1,
                pageSize: 0
            },
            //数据
            dataForm: {
                id: 0,
                title: '',
                author: '',
                userId: 0,
                categoryId: 0,
                publicDate: '',
                postType: '',
                isPublish: 1,
                userEntity: { }
            },
            articleList: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            postType: '原创',
            articleType:'深度学习',
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            dataFormRules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                ]
            },
            uploadParams: {
            },
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
        }
    },
    methods: {
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

        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = { id: row.id };
                deleteArticleInfoById(para).then((res) => {
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
        handleSendBefore(file) {
            var _thisTemp = this;
            // var index = _thisTemp.curUploadIndex;
            var flag = true;
            //限制文件大小
            if (file.size > 104857600) {
                this.$message.error("请上传小于100M的文件");
                return false;
            }
            console.log("start upload!");
            //文件上传去重
            // _thisTemp.paramsData[index].uploadFiles.forEach(function (value, index) {
            //     var fileArray = value.split('/-/');
            //     var fileItem = {
            //         type: fileArray[0],
            //         fileName: fileArray[1],
            //         fileType: fileArray[2],
            //         fileSize: fileArray[3],
            //     };
            //     if (fileItem.fileName == file.name && fileItem.fileSize == file.size) {
            //         flag = false;
            //         return;
            //     }
            // })
            if (!flag) {
                return false;
            }
        },
        uploadSuccess (response, file, fileList) {
            console.log('上传文件', response)
        },
        // 上传错误
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！', file.name)
        },

        //显示新增界面
        addArticle: function () {
            this.addFormVisible = true;
            this.dataForm = {
                id: 0,
                title: '',
                author: '',
                categoryId: 0,
                publicDate: '',
                postType: 0,
                isPublish: 1
            };
        },
        saveOrUpdate: function () {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        this.dataForm = Object.assign({}, this.dataForm);
                        let para = this.dataForm;
                        saveOrUpdateArticleInfo(para).then((res) => {
                            this.addLoading = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['dataForm'].resetFields();
                            this.addFormVisible = false;
                            this.editFormVisible = false;
                            this.getArticleInfos();
                        }).catch(function (error) {
                            console.log(error);
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
        this.getArticleInfos();
    }
}