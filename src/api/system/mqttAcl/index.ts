import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MqttAclVO, MqttAclForm, MqttAclQuery } from '@/api/system/mqttAcl/types';

/**
 * 查询mqtt客户的acl规则，符合该规则的发布/订阅才可行列表
 * @param query
 * @returns {*}
 */

export const listMqttAcl = (query?: MqttAclQuery): AxiosPromise<MqttAclVO[]> => {
  return request({
    url: '/system/mqttAcl/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询mqtt客户的acl规则，符合该规则的发布/订阅才可行详细
 * @param id
 */
export const getMqttAcl = (id: string | number): AxiosPromise<MqttAclVO> => {
  return request({
    url: '/system/mqttAcl/' + id,
    method: 'get'
  });
};

/**
 * 新增mqtt客户的acl规则，符合该规则的发布/订阅才可行
 * @param data
 */
export const addMqttAcl = (data: MqttAclForm) => {
  return request({
    url: '/system/mqttAcl',
    method: 'post',
    data: data
  });
};

/**
 * 修改mqtt客户的acl规则，符合该规则的发布/订阅才可行
 * @param data
 */
export const updateMqttAcl = (data: MqttAclForm) => {
  return request({
    url: '/system/mqttAcl',
    method: 'put',
    data: data
  });
};

/**
 * 删除mqtt客户的acl规则，符合该规则的发布/订阅才可行
 * @param id
 */
export const delMqttAcl = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/mqttAcl/' + id,
    method: 'delete'
  });
};
