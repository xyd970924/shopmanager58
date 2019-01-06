<template>
  <el-card class="card">
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="row">
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%" height="500px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(v) in scope.row.children" :key="v.id">
            <el-col :span="4">
              <el-tag
                @close="delTag(scope.row,v)"
                closable
                type="success"
                class="tag"
              >{{v.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(v1) in v.children" :key="v1.id">
                <el-col :span="4">
                  <el-tag
                    @close="delTag(scope.row,v1)"
                    closable
                    type="info"
                    class="tag"
                  >{{v1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delTag(scope.row,v2)"
                    closable
                    type="error"
                    v-for="(v2) in v1.children"
                    :key="v2.id"
                  >{{v2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="160"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="160"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
            <el-button
              @click="showDia(scope.row)"
              type="success"
              size="mini"
              plain
              icon="el-icon-check"
              circle
            ></el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <el-row>
        <el-col>
          <el-tree
            ref="tree"
            :default-checked-keys="chenkedArr"
            default-expand-all
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
          ></el-tree>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogVisible: false,
      treeData: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      expandedArr: [],
      chenkedArr: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 更改权限
    async EditRights() {
      // 全选 getCheckedKeys
      const arr1 = this.$refs.tree.getCheckedKeys();

      // 半选 getHalfCheckedKeys
      const arr2 = this.$refs.tree.getHalfCheckedKeys();

      const arr3 = [...arr1, ...arr2];
      // console.log(arr3);

      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr3.join(",")
      });
      this.dialogVisible = false;
      this.getRoles();
      console.log(res);
    },
    // 显示对话框
    async showDia(role) {
      // console.log(role);
      this.currRoleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      this.treeData = res.data.data;

      const temArr = [];
      role.children.forEach(v => {
        // temArr.push(v.id);
        v.children.forEach(v1 => {
          // temArr.push(v1.id);
          v1.children.forEach(v2 => {
            temArr.push(v2.id);
          });
        });
      });
      // console.log(temArr);
      this.chenkedArr = temArr;

      this.dialogVisible = true;
    },

    // 删除权限标签
    async delTag(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      role.children = res.data.data;
    },
    // console.log(res);

    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.row {
  margin-top: 20px;
}
.tag {
  margin-top: 10px;
}
</style>
