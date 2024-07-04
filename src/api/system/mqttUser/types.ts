export interface MqttUserVO {
  /**
   * 编号
   */
  id: string | number;

  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 备注
   */
  remark: string;

}

export interface MqttUserForm extends BaseEntity {
  /**
   * 编号
   */
  id?: string | number;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 密码
   */
  password?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface MqttUserQuery extends PageQuery {

  /**
   * 用户名
   */
  username?: string;

  /**
   * 密码
   */
  password?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



