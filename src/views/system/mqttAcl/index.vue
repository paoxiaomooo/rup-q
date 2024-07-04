<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="主题" prop="topic">
              <el-input v-model="queryParams.topic" placeholder="请输入主题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="访问类型： 1->订阅；2->发布；3->订阅与发布" prop="access">
              <el-input v-model="queryParams.access" placeholder="请输入访问类型： 1->订阅；2->发布；3->订阅与发布" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否允许访问：0-deny，1-allow" prop="allow">
              <el-input v-model="queryParams.allow" placeholder="请输入是否允许访问：0-deny，1-allow" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:mqttAcl:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:mqttAcl:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:mqttAcl:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:mqttAcl:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="mqttAclList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="用户名" align="center" prop="username" />
        <el-table-column label="主题" align="center" prop="topic" />
        <el-table-column label="访问类型： 1->订阅；2->发布；3->订阅与发布" align="center" prop="access" />
        <el-table-column label="是否允许访问：0-deny，1-allow" align="center" prop="allow" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:mqttAcl:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:mqttAcl:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改mqtt客户的acl规则，符合该规则的发布/订阅才可行对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="mqttAclFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="主题" prop="topic">
          <el-input v-model="form.topic" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="访问类型： 1->订阅；2->发布；3->订阅与发布" prop="access">
          <el-input v-model="form.access" placeholder="请输入访问类型： 1->订阅；2->发布；3->订阅与发布" />
        </el-form-item>
        <el-form-item label="是否允许访问：0-deny，1-allow" prop="allow">
          <el-input v-model="form.allow" placeholder="请输入是否允许访问：0-deny，1-allow" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MqttAcl" lang="ts">
import { listMqttAcl, getMqttAcl, delMqttAcl, addMqttAcl, updateMqttAcl } from '@/api/system/mqttAcl';
import { MqttAclVO, MqttAclQuery, MqttAclForm } from '@/api/system/mqttAcl/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const mqttAclList = ref<MqttAclVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const mqttAclFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MqttAclForm = {
  id: undefined,
  username: undefined,
  topic: undefined,
  access: undefined,
  allow: undefined,
  remark: undefined,
}
const data = reactive<PageData<MqttAclForm, MqttAclQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    username: undefined,
    topic: undefined,
    access: undefined,
    allow: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    username: [
      { required: true, message: "用户名不能为空", trigger: "blur" }
    ],
    topic: [
      { required: true, message: "主题不能为空", trigger: "blur" }
    ],
    access: [
      { required: true, message: "访问类型： 1->订阅；2->发布；3->订阅与发布不能为空", trigger: "blur" }
    ],
    allow: [
      { required: true, message: "是否允许访问：0-deny，1-allow不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询mqtt客户的acl规则，符合该规则的发布/订阅才可行列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMqttAcl(queryParams.value);
  mqttAclList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  mqttAclFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: MqttAclVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加mqtt客户的acl规则，符合该规则的发布/订阅才可行";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MqttAclVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMqttAcl(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改mqtt客户的acl规则，符合该规则的发布/订阅才可行";
}

/** 提交按钮 */
const submitForm = () => {
  mqttAclFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMqttAcl(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMqttAcl(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MqttAclVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除mqtt客户的acl规则，符合该规则的发布/订阅才可行编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMqttAcl(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/mqttAcl/export', {
    ...queryParams.value
  }, `mqttAcl_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
