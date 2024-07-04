<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备编号" prop="serialNum">
              <el-input v-model="queryParams.serialNum" placeholder="请输入设备编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="外键, 设备类型id" prop="deviceTypeId">
              <el-input v-model="queryParams.deviceTypeId" placeholder="请输入外键, 设备类型id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="1:已删除，0:正常" prop="deleted">
              <el-input v-model="queryParams.deleted" placeholder="请输入1:已删除，0:正常" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:device:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:device:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:device:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:device:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="设备编号" align="center" prop="serialNum" />
        <el-table-column label="外键, 设备类型id" align="center" prop="deviceTypeId" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="1:已删除，0:正常" align="center" prop="deleted" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:device:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:device:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备信息管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备编号" prop="serialNum">
          <el-input v-model="form.serialNum" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="外键, 设备类型id" prop="deviceTypeId">
          <el-input v-model="form.deviceTypeId" placeholder="请输入外键, 设备类型id" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="1:已删除，0:正常" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入1:已删除，0:正常" />
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

<script setup name="Device" lang="ts">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from '@/api/system/device';
import { DeviceVO, DeviceQuery, DeviceForm } from '@/api/system/device/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const deviceList = ref<DeviceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deviceFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceForm = {
  id: undefined,
  serialNum: undefined,
  deviceTypeId: undefined,
  remark: undefined,
  deleted: undefined
}
const data = reactive<PageData<DeviceForm, DeviceQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    serialNum: undefined,
    deviceTypeId: undefined,
    deleted: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    serialNum: [
      { required: true, message: "设备编号不能为空", trigger: "blur" }
    ],
    deviceTypeId: [
      { required: true, message: "外键, 设备类型id不能为空", trigger: "blur" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
    deleted: [
      { required: true, message: "1:已删除，0:正常不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备信息管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDevice(queryParams.value);
  deviceList.value = res.rows;
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
  deviceFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DeviceVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备信息管理";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DeviceVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDevice(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备信息管理";
}

/** 提交按钮 */
const submitForm = () => {
  deviceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDevice(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDevice(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备信息管理编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDevice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
