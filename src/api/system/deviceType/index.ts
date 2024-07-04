import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceTypeVO, DeviceTypeForm, DeviceTypeQuery } from '@/api/system/deviceType/types';

/**
 * 查询设备类型管理列表
 * @param query
 * @returns {*}
 */

export const listDeviceType = (query?: DeviceTypeQuery): AxiosPromise<DeviceTypeVO[]> => {
  return request({
    url: '/system/deviceType/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备类型管理详细
 * @param id
 */
export const getDeviceType = (id: string | number): AxiosPromise<DeviceTypeVO> => {
  return request({
    url: '/system/deviceType/' + id,
    method: 'get'
  });
};

/**
 * 新增设备类型管理
 * @param data
 */
export const addDeviceType = (data: DeviceTypeForm) => {
  return request({
    url: '/system/deviceType',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备类型管理
 * @param data
 */
export const updateDeviceType = (data: DeviceTypeForm) => {
  return request({
    url: '/system/deviceType',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备类型管理
 * @param id
 */
export const delDeviceType = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/deviceType/' + id,
    method: 'delete'
  });
};
