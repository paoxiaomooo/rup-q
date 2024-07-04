export interface DeviceTypeVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 设备类型名
   */
  name: string;

  /**
   * 型号
   */
  deviceModel: string;

  /**
   * 设备码
   */
  code: string;

  /**
   * 设备图片
   */
  pic: string;

  /**
   * json自定义属性
   */
  attributes: string;

  /**
   * 1:已删除，0:正常
   */
  deleted: number;

}

export interface DeviceTypeForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 设备类型名
   */
  name?: string;

  /**
   * 型号
   */
  deviceModel?: string;

  /**
   * 设备码
   */
  code?: string;

  /**
   * 设备图片
   */
  pic?: string;

  /**
   * json自定义属性
   */
  attributes?: string;

  /**
   * 1:已删除，0:正常
   */
  deleted?: number;

}

export interface DeviceTypeQuery extends PageQuery {

  /**
   * 设备类型名
   */
  name?: string;

  /**
   * 型号
   */
  deviceModel?: string;

  /**
   * 设备码
   */
  code?: string;

  /**
   * 设备图片
   */
  pic?: string;

  /**
   * json自定义属性
   */
  attributes?: string;

  /**
   * 1:已删除，0:正常
   */
  deleted?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



