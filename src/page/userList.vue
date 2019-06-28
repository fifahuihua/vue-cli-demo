<template>
  <div>
    <div class="table_container" v-loading="loading">
      <div style="margin-bottom: 15px;">
        <div style="display:inline-block; width: 400px;">
          <el-input placeholder="请输入账号ID来过滤用户列表" v-model="searchText" @keyup.enter.native="initData">
            <el-button slot="append" icon="el-icon-search" @click="initData">查询</el-button>
          </el-input>
        </div>
        <div style="display:inline-block; margin-left: 15px;">
          <el-button type="primary" icon="el-icon-plus" @click="openCreateDialog">新增用户</el-button>
        </div>
      </div>
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="created" label="注册日期" width="150"></el-table-column>
        <el-table-column property="username" label="账号ID" width="120"></el-table-column>
        <el-table-column property="displayName" label="姓名" width="150"></el-table-column>
        <el-table-column property="departName" label="部门" width="150"></el-table-column>
        <el-table-column property="email" label="邮箱地址" width="200"></el-table-column>
        <el-table-column property="phoneNumber" label="联系电话"></el-table-column>
        <el-table-column property="address" label="联系地址"></el-table-column>
        <el-table-column property="desc" label="备注"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="editUser(scope.$index, scope.row)" title="编辑"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.$index, scope.row)" title="删除"></el-button>
            <el-button type="warning" icon="el-icon-setting" circle @click="resetPassword(scope.row)" title="重置密码"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination background layout="prev, pager, next" :total="count" :page-size="limit" :current-page.sync="currentPage" @current-change="handleCurrentChange"> </el-pagination>
      </div>
    </div>
    <el-dialog title="重置密码" :visible.sync="resetPassDialogVisible" width="30%" :before-close="handleCloseResetPassDlg" :close-on-click-modal="false">
      <el-form ref="resetPassFormData" :model="resetPassFormData" :rules="resetPassRules" label-width="120px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="resetPassFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="resetPassFormData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPass">
          <el-input v-model="resetPassFormData.confirmPass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseResetPassDlg">取消</el-button>
        <el-button type="primary" @click="submitResetPassForm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.displayName"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="formData.depart" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="item in departments" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPass">
          <el-input v-model="formData.confirmPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="formData.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="30%" :before-close="handleCloseEdit" :close-on-click-modal="false">
      <el-form ref="editFormData" :model="editFormData" :rules="editRules" label-width="120px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="editFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editFormData.displayName"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="editFormData.depart" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="item in departments" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editFormData.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="editFormData.address"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editFormData.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseEdit">取消</el-button>
        <el-button type="primary" @click="submitEditForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserGw from '@/api/user.client.gw';
import moment from 'moment';
export default {
  data() {
    const userIdValidator = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户账号'));
      }

      if (value.length > 15 || value.length < 4) {
        return callback(new Error('用户账号长度应该在4～15之间'));
      }

      try {
        const userExistedRes = await UserGw.isExistedUser(value);
        if (userExistedRes && userExistedRes.data.existed) {
          return callback(new Error('用户账号已经存在'));
        }

        return callback();
      } catch (error) {
        return callback(new Error('查询用户是否存在时出错'));
      }
    };
    const confirmPassValidtor = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'));
      }

      if (value !== this.formData.password) {
        return callback(new Error('两次输入的密码不同'));
      }

      callback();
    };
    const confirmPassValidtor2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'));
      }

      if (value !== this.resetPassFormData.password) {
        return callback(new Error('两次输入的密码不同'));
      }

      callback();
    };
    return {
      formData: {},
      editFormData: {},
      resetPassFormData: {},
      dialogVisible: false,
      editDialogVisible: false,
      resetPassDialogVisible: false,
      loading: false,
      searchText: '',
      tableData: [],
      currentRow: null,
      departments: [
        { label: '财务行政部', value: 'CWXZ' },
        { label: '一部', value: 'DEP1' },
        { label: '二部', value: 'DEP2' },
        { label: '三部', value: 'DEP3' },
        { label: '电销部', value: 'DIANXIAO' },
        { label: '申报部', value: 'SHENBAO' },
        { label: '江苏公司', value: 'JIANGSU' },
        { label: '广东公司', value: 'GUANGDONG' }
      ],
      offset: 0,
      limit: 10,
      count: 0,
      currentPage: 1,
      rules: {
        username: [{ required: true, validator: userIdValidator, trigger: 'blur' }],
        email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' }],
        confirmPass: [{ required: true, validator: confirmPassValidtor, trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码最小长度为6', trigger: 'blur' }
        ]
      },
      editRules: {
        email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' }]
      },
      resetPassRules: {
        confirmPass: [{ required: true, validator: confirmPassValidtor2, trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码最小长度为6', trigger: 'blur' }
        ]
      }
    };
  },
  components: {},
  created() {
    this.initData();
  },
  methods: {
    resetPassword(user) {
      this.resetPassFormData = {
        id: user.id,
        username: user.username,
        password: '',
        confirmPass: ''
      };
      this.resetPassDialogVisible = true;
    },
    async submitResetPassForm() {
      const valid = await this.$refs['resetPassFormData'].validate();
      if (valid) {
        await UserGw.resetPassword(this.resetPassFormData.id, this.resetPassFormData.password);
        this.handleCloseResetPassDlg();
        this.$message.success('更新密码成功！');
      } else {
        // console.log('error submit!!');
        return false;
      }
    },
    getDepartName(departCode) {
      for (let depart of this.departments) {
        if (depart.value === departCode) {
          return depart.label;
        }
      }

      return '';
    },
    async editUser(index, user) {
      this.editDialogVisible = true;
      this.editFormData = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        address: user.address,
        depart: user.depart,
        phoneNumber: user.phoneNumber,
        desc: user.desc
      };
    },
    async deleteUser(index, user) {
      try {
        await this.$confirm(`你确定要删除当前用户${user.username}？`, '请确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      } catch (error) {
        return;
      }
      this.loading = true;
      const res = await UserGw.deleteUser(user.id);
      if (res.data.result === 'success') {
        await this.initData();
      } else {
        this.$message.error(res.message || '删除用户失败');
      }
      this.loading = false;
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
    handleCloseEdit(done) {
      this.editDialogVisible = false;
    },
    handleCloseResetPassDlg(done) {
      this.resetPassDialogVisible = false;
      this.$refs['resetPassFormData'].clearValidate();
    },
    resetForm() {
      this.formData = {};
    },
    async submitEditForm() {
      const valid = await this.$refs['editFormData'].validate();
      if (valid) {
        await UserGw.editUser(this.editFormData);
        this.editDialogVisible = false;
        await this.initData();
      } else {
        // console.log('error submit!!');
        return false;
      }
    },
    async submitForm() {
      const valid = await this.$refs['formData'].validate();
      if (valid) {
        await UserGw.createUser(this.formData);
        this.dialogVisible = false;
        await this.initData();
      } else {
        // console.log('error submit!!');
        return false;
      }
    },
    openCreateDialog() {
      this.dialogVisible = true;
    },
    async initData() {
      this.currentPage = 1;
      this.offset = 0;
      this.loading = true;
      try {
        let countData = await UserGw.getUserCount(this.searchText);
        countData = countData.data;
        if (countData.status === 'success') {
          this.count = countData.count;
        } else {
          throw new Error('获取数据失败');
        }
        await this.getUsers(this.searchText);
      } catch (err) {
        // console.log('获取数据失败', err);
        this.$message.error('获取数据失败');
      }
      this.loading = false;
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      await this.getUsers();
    },
    async getUsers() {
      const res = await UserGw.getUserList(this.searchText, this.offset, this.limit);
      const Users = res.data;
      this.tableData = [];
      Users.forEach((item) => {
        const tableData = {};
        tableData.id = item._id;
        tableData.username = item.username;
        tableData.displayName = item.displayName;
        tableData.created = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
        tableData.address = item.address;
        tableData.email = item.email;
        tableData.depart = item.depart;
        tableData.departName = this.getDepartName(item.depart);
        tableData.phoneNumber = item.phoneNumber;
        tableData.desc = item.desc;
        this.tableData.push(tableData);
      });
    }
  }
};
</script>

<style scoped>
.table_container {
  padding: 20px;
}
</style>
