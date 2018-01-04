import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getWebSourceListByParam,deleteWebSourceById,saveOrUpdateWebSource } from '../../api/api';
import ElCol from "element-ui/packages/col/src/col";
import ElRow from "element-ui/packages/row/src/row";

export default {
    components: {
        ElRow,
        ElCol},
    data() {
        return {
            filters: {
                keywords: '',
                pageNum: 1,
                pageSize: 10
            },
            editFormVisible: false,
            resourceList: [],
            total: 0,
            listLoading: false,
            sels: [],//列表选中列
            dataForm: {
                name: '',
                url: '',
                avator: '',
                author: '',
                sourceType: 'openSource',
                desc: ''
            },
            dataFormRules: {
                name: [
                    {required: true, message: '请输入资源名称', trigger: 'blur'}
                ],
                url: [
                    {required: true, message: '请输入资源URL', trigger: 'blur'}
                ],
                author: [
                    {required: true, message: '请输入资源作者', trigger: 'blur'}
                ],
                desc: [
                    {required: true, message: '请输入资源描述', trigger: 'blur'}
                ]
            },
            uploadImageParams: {
                uploadType: "avator"
            },
        }
    },
    methods: {
        handleSizeChange(val) {
            this.filters.pageSize = val;
            this.handleCurrentChange(1);
            this.getWebResourceList();
        },
        handleCurrentChange(val) {
            this.filters.pageNum = val;
            this.getWebResourceList();
        },
        //获取评论
        getWebResourceList() {
            let para = this.filters;
            this.listLoading = true;
            //NProgress.start();
            getWebSourceListByParam(para).then((res) => {
                this.total = res.data.total;
                this.resourceList = res.data.list;
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
                let para = { id: row.id };
                deleteWebSourceById(para).then((res) => {
                    this.listLoading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getWebResourceList();
                });
            }).catch(() => {

            });
        },
        selsChange: function (sels) {
            this.sels = sels;
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.dataForm = Object.assign({}, row);
        },
        cancelEdit : function () {
            this.editFormVisible = false;
            this.clearUploadImageEdit();
        },
        saveOrUpdate: function () {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.dataForm = Object.assign({}, this.dataForm);

                        let para = this.dataForm;
                        saveOrUpdateWebSource(para).then((res) => {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['dataForm'].resetFields();
                            this.editFormVisible = false;
                            this.clearUploadImageEdit();
                        }).catch(function (error) {
                            console.log(error);
                        });
                    });
                }
            });
        },
        handleImgSendBefore(file){
            if(this.dataForm.avator !== '' && this.dataForm.avator !== null ) {
                let para = { filePath: this.dataForm.avator };
                deleteFile(para).then((res) => {
                    if(res.result === "success") {
                        this.dataForm.avator='';
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
            if(this.dataForm.avator !== '' && this.dataForm.avator !== null ) {
                let para = { filePath: this.dataForm.avator };
                deleteFile(para).then((res) => {
                    if(res.result === "success") {
                        this.dataForm.avator = '';
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
        uploadAvatorSuccess (response, file, fileList) {
            this.dataForm.avator = response.filePath;
            console.log('上传文件', response.filePath)
        },
        clearUploadImageEdit(){
            console.log("clear clearUploadImageEdit file!")
            this.$refs.uploadImageEdit.clearFiles();
            this.dataForm.avator=''
        },
        // 上传错误
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！', file.name)
        },
    },
    mounted() {
        this.getWebResourceList();
    }
}
