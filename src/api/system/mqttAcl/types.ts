export interface MqttAclVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 用户名
   */
  username: string;

  /**
   * 主题
   */
  topic: string;

  /**
   * 访问类型： 1->订阅；2->发布；3->订阅与发布
   */
  access: number;

  /**
   * 是否允许访问：0-deny，1-allow
   */
  allow: number;

  /**
   * 备注
   */
  remark: string;

}

export interface MqttAclForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 主题
   */
  topic?: string;

  /**
   * 访问类型： 1->订阅；2->发布；3->订阅与发布
   */
  access?: number;

  /**
   * 是否允许访问：0-deny，1-allow
   */
  allow?: number;

  /**
   * 备注
   */
  remark?: string;

}

export interface MqttAclQuery extends PageQuery {

  /**
   * 用户名
   */
  username?: string;

  /**
   * 主题
   */
  topic?: string;

  /**
   * 访问类型： 1->订阅；2->发布；3->订阅与发布
   */
  access?: number;

  /**
   * 是否允许访问：0-deny，1-allow
   */
  allow?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



