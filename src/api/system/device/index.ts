import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceVO, DeviceForm, DeviceQuery } from '@/api/system/device/types';

/**
 * 查询设备信息管理列表
 * @param query
 * @returns {*}
 */

export const listDevice = (query?: DeviceQuery): AxiosPromise<DeviceVO[]> => {
  return request({
    url: '/system/device/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备信息管理详细
 * @param id
 */
export const getDevice = (id: string | number): AxiosPromise<DeviceVO> => {
  return request({
    url: '/system/device/' + id,
    method: 'get'
  });
};

/**
 * 新增设备信息管理
 * @param data
 */
export const addDevice = (data: DeviceForm) => {
  return request({
    url: '/system/device',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备信息管理
 * @param data
 */
export const updateDevice = (data: DeviceForm) => {
  return request({
    url: '/system/device',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备信息管理
 * @param id
 */
export const delDevice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/device/' + id,
    method: 'delete'
  });
};
