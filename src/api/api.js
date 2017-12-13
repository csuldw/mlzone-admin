import axios from 'axios';
import qs from 'qs';

let base = '';
let headers = {
//     "Content-Type":"multipart/form-data"
    'content-type': 'application/x-www-form-urlencoded'
};

let headers2 = {
//     "Content-Type":"multipart/form-data"
    'content-type': 'application/json'
};

var instance = axios.create({
    headers: headers
});

var instance2 = axios.create({
    headers: headers2
});

// article-ref

export const getArticleListByPage = params => { return instance.post(`/api/MLZone/articleInfo/getArticelInfoList.do`, qs.stringify(params)).then(res => res.data); };
export const deleteArticleInfoById = params => { return instance.post(`/api/MLZone/articleInfo/deleteArticleInfoById.do`, qs.stringify(params)).then(res => res.data); };
export const saveOrUpdateArticleInfo = params => { return instance2.post(`/api/MLZone/articleInfo/saveOrUpdateArticleInfo.do`, JSON.stringify(params)).then(res => res.data); };
// export const saveOrUpdateArticleInfo = params => { return instance.post(`/api/MLZone/articleInfo/saveOrUpdateArticleInfo.do`, qs.stringify(params)).then(res => res.data); };

// article-category-ref
export const getArticleCategoryListByParam = params => { return instance.post(`/api/MLZone/articleCategory/getArticleCategoryListByParam.do`, qs.stringify(params)).then(res => res.data); };


// export const saveOrUpdateBugInfo = params => { return axios.post(`/api/ProjectPlugin/bug/saveOrUpdateBugInfo.do`, qs.stringify(params)).then(res => res.data); };

// export const deleteBugInfoById = params => { return axios.post(`/api/ProjectPlugin/bug/deleteBugInfo.do`, qs.stringify(params)).then(res => res.data); };

// export const exportBugInfoToExcel = params => { return axios.post(`/api/ProjectPlugin/bug/exportBugInfoToExcel.do`, qs.stringify(params)).then(res => res.data); };

// export const downloadBugInfoFile = params => { return instance.get(`/api/ProjectPlugin/file/bug/downloadFile.do`, { params: params }); };

//user-ref

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
export const getUserListPage = params => { return instance.post(`/api/MLZone/user/getUserListByParam.do`, qs.stringify(params)).then(res => res.data); };
// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
export const saveOrUpdateUser = params => { return instance2.post(`/api/MLZone/user/saveOrUpdateUser.do`, JSON.stringify(params)).then(res => res.data); };
export const checkUserExistByUsername = params => { return instance.post(`/api/MLZone/user/checkUserExistByUsername.do`, qs.stringify(params)).then(res => res.data); };

//export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
//export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
//export const removeUser = params => { return instance.post(`/api/MLZone/articleInfo/deleteArticleInfoById.do`, qs.stringify(params)).then(res => res.data); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };


export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


