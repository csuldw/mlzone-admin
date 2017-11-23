import axios from 'axios';
import qs from 'qs';

let base = '';

let headers = {
//     "Content-Type":"multipart/form-data"
'content-type': 'application/x-www-form-urlencoded'
};
//
var instance = axios.create({
    headers: headers
});

// article-ref

export const getArticleListByPage = params => { return instance.post(`/api/MLZone/articleInfo/getArticelInfoList.do`, qs.stringify(params)).then(res => res.data); };

export const saveOrUpdateArticleInfo = params => { return instance.post(`/api/MLZone/articleInfo/saveOrUpdateArticleInfo.do`, qs.stringify(params)).then(res => res.data); };

// export const saveOrUpdateBugInfo = params => { return axios.post(`/api/ProjectPlugin/bug/saveOrUpdateBugInfo.do`, qs.stringify(params)).then(res => res.data); };

// export const deleteBugInfoById = params => { return axios.post(`/api/ProjectPlugin/bug/deleteBugInfo.do`, qs.stringify(params)).then(res => res.data); };

// export const exportBugInfoToExcel = params => { return axios.post(`/api/ProjectPlugin/bug/exportBugInfoToExcel.do`, qs.stringify(params)).then(res => res.data); };

// export const downloadBugInfoFile = params => { return instance.get(`/api/ProjectPlugin/file/bug/downloadFile.do`, { params: params }); };





//user-ref

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


