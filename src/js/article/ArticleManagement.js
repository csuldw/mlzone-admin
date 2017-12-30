import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {getArticleListByPage, deleteArticleInfoById, getArticleCategoryListByParam, saveOrUpdateArticleInfo, deleteFile} from '../../api/api';
import ElCol from "element-ui/packages/col/src/col";
import ElRow from "element-ui/packages/row/src/row";

export default {
    components: {
        ElRow,
        ElCol
    },
    data: function () {
        return {
            filters: {
                pageNum: 1,
                pageSize: 10
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
                filePath: '',
                imagePath: '',
                userEntity: {}
            },
            saveType: '',
            articleList: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            postType: '原创',
            articleType: '深度学习',
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            dataFormRules: {
                title: [
                    {required: true, message: '请输入文章标题', trigger: 'blur'}
                ]
            },
            uploadImageParams: {
                uploadType: "images"
            },
            uploadArticleParams: {
                uploadType: "article"
            },
            articleTypeList: [{
                value: 'type1',
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
    computed:{

    },
    methods: {
        handleSizeChange(val) {
            this.filters.pageSize = val;
            this.handleCurrentChange(1);
            this.getArticleInfos();
        },
        handleCurrentChange(val) {
            this.filters.pageNum = val;
            this.getArticleInfos();
        },
        getArticleCategoryInfo(){
            let para = {}
            getArticleCategoryListByParam(para).then((res) => {
                this.articleTypeList = res.data
            });
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
        handleImgSendBefore(file){
            if(this.dataForm.imagePath !== '' && this.dataForm.imagePath !== null ) {
                let para = { filePath: this.dataForm.imagePath };
                deleteFile(para).then((res) => {
                    if(res.result === "success") {
                        this.dataForm.imagePath='';
                        console.log("删除成功");
                    }
                });
            }
            const isJPG = ( file.type === 'image/png' || file.type === 'image/jpeg');
            const isLt2M = file.size / 1024 / 1024 < 3;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是JPG/PNG格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过3MB!');
            }
            return isJPG && isLt2M;
        },
        handleSendBefore(file) {
            if(this.dataForm.filePath !== '' && this.dataForm.filePath !== null ) {
                let para = { filePath: this.dataForm.filePath };
                deleteFile(para).then((res) => {
                    if(res.result === "success") {
                        this.dataForm.filePath = '';
                        console.log("删除成功");
                    }
                });
            }
            //限制文件大小
            if (file.size > 104857600) {
                this.$message.error("请上传小于100M的文件");
                return false;
            }
            var fileNameArr = file.name.split(".")
            if(fileNameArr[fileNameArr.length - 1].toLowerCase() != "md") {
                this.$message.error("请上传md格式的文件!");
                return false;
            }
            console.log("start upload!");
        },
        uploadArticleFileSuccess (response, file, fileList) {
            this.dataForm.filePath = response.filePath;
            console.log('上传文件', response.filePath)
        },
        uploadArticleCoverSuccess (response, file, fileList) {
            this.dataForm.imagePath = response.filePath;
            console.log('上传图片', response.filePath)
        },
        // 上传错误
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！', file.name)
        },
        clearUploadFileEdit(){
            console.log("clear clearUploadFileEdit file!")
            this.$refs.uploadFileEdit.clearFiles();
            this.dataForm.filePath=''
        },
        clearUploadImageEdit(){
            console.log("clear clearUploadImageEdit file!")
            this.$refs.uploadImageEdit.clearFiles();
            this.dataForm.imagePath=''
        },
        clearUploadFileAdd(){
            console.log("clear clearUploadFileAdd file!")
            this.$refs.uploadFileAdd.clearFiles();
            this.dataForm.filePath=''
        },
        clearUploadImageAdd(){
            console.log("clear clearUploadImageAdd file!")
            this.$refs.uploadImageAdd.clearFiles();
            this.dataForm.imagePath=''
        },
        //显示新增界面
        addArticle: function () {
            this.addFormVisible = true;
            this.dataForm = {
                id: 0,
                title: '',
                author: '',
                categoryId: 1,
                publicDate: '',
                postType: 0,
                isPublish: 1
            };
        },
        saveOrUpdate: function (saveType) {
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
                            if(saveType === 'update') {
                                this.clearUploadFileEdit();
                                this.clearUploadImageEdit();
                            }
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
        cancelEdit : function () {
            this.editFormVisible = false;
            this.clearUploadFileEdit();
            this.clearUploadImageEdit();
        },
        cancelAdd : function () {
            this.addFormVisible = false;
        },
    },
    mounted() {
        this.getArticleInfos();
        this.getArticleCategoryInfo();
    }
}