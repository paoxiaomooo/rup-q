import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MqttUserVO, MqttUserForm, MqttUserQuery } from '@/api/system/mqttUser/types';

/**
 * 查询mqtt客户的连接鉴权，密码为sha256加密列表
 * @param query
 * @returns {*}
 */

export const listMqttUser = (query?: MqttUserQuery): AxiosPromise<MqttUserVO[]> => {
  return request({
    url: '/system/mqttUser/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询mqtt客户的连接鉴权，密码为sha256加密详细
 * @param id
 */
export const getMqttUser = (id: string | number): AxiosPromise<MqttUserVO> => {
  return request({
    url: '/system/mqttUser/' + id,
    method: 'get'
  });
};

/**
 * 新增mqtt客户的连接鉴权，密码为sha256加密
 * @param data
 */
export const addMqttUser = (data: MqttUserForm) => {
  return request({
    url: '/system/mqttUser',
    method: 'post',
    data: data
  });
};

/**
 * 修改mqtt客户的连接鉴权，密码为sha256加密
 * @param data
 */
export const updateMqttUser = (data: MqttUserForm) => {
  return request({
    url: '/system/mqttUser',
    method: 'put',
    data: data
  });
};

/**
 * 删除mqtt客户的连接鉴权，密码为sha256加密
 * @param id
 */
export const delMqttUser = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/mqttUser/' + id,
    method: 'delete'
  });
};
