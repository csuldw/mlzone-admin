import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getCommentListPage, batchRemoveUser, editUser, addUser } from '../../api/api';
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
                pageSize: 0
            },
            comments: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.page = val;
            this.getComments();
        },
        //获取评论
        getComments() {
            let para = this.filters;
            this.listLoading = true;
            //NProgress.start();
            getCommentListPage(para).then((res) => {
                this.total = res.data.total;
                this.comments = res.data.list;
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
                removeComment(para).then((res) => {
                    this.listLoading = false;
                    //NProgress.done();
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getComments();
                });
            }).catch(() => {

            });
        },

        selsChange: function (sels) {
            this.sels = sels;
        },
    },
    mounted() {
        this.getComments();
    }
}
