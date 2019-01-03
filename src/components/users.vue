<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索加添加按钮 -->
    <el-row>
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{scope.row.create_time | fmDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button
              type="primary"
              size="mini"
              plain
              icon="el-icon-edit"
              circle
              @click="showDiaEdit(scope.row)"
            ></el-button>
            <el-button
              @click="showRoldDia(scope.row)"
              type="success"
              size="mini"
              plain
              icon="el-icon-check"
              circle
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              icon="el-icon-delete"
              circle
              @click="showDeleConfig(scope.row)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配用户对话框 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisibleDia">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUserName}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          {{currRoleId}}
          <el-select v-model="currRoleId">
            <el-option disabled label="请选择 " :value="-1"></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleDia = false">取 消</el-button>
        <el-button type="primary" @click="setDia()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 控制对话框的显示或者隐藏
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleDia: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // select所绑定的数据
      currRoleId: -1,
      roles: [],
      currUserName: "",
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色-发送请求
    async setDia() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      this.dialogFormVisibleDia = false;
      console.log(res);
    },
    // 显示对话框
    async showRoldDia(user) {
      this.currUserName = user.username;
      this.currUserId = user.id;
      this.dialogFormVisibleDia = true;
      const res = await this.$http.get(`roles`);

      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }

      const res1 = await this.$http.get(`users/${user.id}`);
      // console.log(res1);
      this.currRoleId = res1.data.data.rid;
    },
    // 改变用户状态
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    // 编辑发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 编辑打开对话框
    async showDiaEdit(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res);

      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    // 删除用户
    showDeleConfig(user) {
      this.$confirm("你呀删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.pagenum = 1;
            this.getTableData();
            this.$message.success("删除成功");
          } else {
            this.$message.info("删除失败");
          }
          // console.log(res);
        })
        .catch(() => {
          this.$message.info("删除取消");
        });
    },
    // 添加用户发送请求
    async addUser() {
      // 发送请求
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.post(`users`, this.form);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 关闭对话框
        this.dialogFormVisibleAdd = false;
        // 刷新表格
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 显示添加用户对话框
    showDiaAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 点击x获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    // 搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      // val是当前页码
      this.pagenum = val;
      this.getTableData();
    },

    //  获取列表数据
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { status, msg },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        // 获取成功
        this.tableData = users;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 400px;
}
</style>
