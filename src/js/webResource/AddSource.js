import ElCol from "element-ui/packages/col/src/col";

var mavonEditor = require('mavon-editor')
import 'mavon-editor/dist/css/index.css'
import ElRow from "element-ui/packages/row/src/row";
import {saveOrUpdateWebSource,deleteFile } from '../../api/api';


export default {
	name: 'editor',
	components: {
		ElRow,
		ElCol,
		'mavon-editor': mavonEditor.mavonEditor
	},
	data() {
		return {
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
        cancelSave() {
            if(this.dataForm.avator !== '' && this.dataForm.avator !== null ) {
                let para = { filePath: this.dataForm.avator };
                deleteFile(para).then((res) => {
                    if(res.result === "success") {
                        this.dataForm.avator='';
                        console.log("删除成功");
                    }
                });
                this.clearUploadImageEdit();
            }
            this.$refs['dataForm'].resetFields();
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
                            this.$router.replace({ path: '/resourceManagement'})
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
	}
}
