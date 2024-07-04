export interface DeviceVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 设备编号
   */
  serialNum: string;

  /**
   * 外键, 设备类型id
   */
  deviceTypeId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 1:已删除，0:正常
   */
  deleted: number;

}

export interface DeviceForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 设备编号
   */
  serialNum?: string;

  /**
   * 外键, 设备类型id
   */
  deviceTypeId?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 1:已删除，0:正常
   */
  deleted?: number;

}

export interface DeviceQuery extends PageQuery {

  /**
   * 设备编号
   */
  serialNum?: string;

  /**
   * 外键, 设备类型id
   */
  deviceTypeId?: string | number;

  /**
   * 1:已删除，0:正常
   */
  deleted?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



