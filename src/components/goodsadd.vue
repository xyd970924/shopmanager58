<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提醒 -->
    <el-row class="alert">
      <el-col>
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      </el-col>
    </el-row>
    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center class="steps">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs切换 -->
    <el-form :model="form" class="form" label-position="top">
      <el-tabs @tab-click="changeTab()" tab-position="left" v-model="active" class="tabs">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="defaultProp"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 上传图片 -->
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>


<script>
// goods_name	       商品名称	不能为空
// goods_cat	       以为','分割的分类列表	不能为空
// goods_price	     价格	不能为空
// goods_number	     数量	不能为空
// goods_weight	     重量	不能为空
// goods_introduce   介绍	可以为空
// pics	             上传的图片临时路径（对象）	可以为空
// attrs
// 局部引入富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce: "",
        goods_cat: "",
        pics: [],
        attrs: []
      },

      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数数组
      arrDy: [],
      // 静态参数数组
      arrStatic: [],
      headers: { Authorization: localStorage.getItem("token") }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 添加商品
    async addGoods() {
      // goods_cat
      this.form.goods_cat = this.selectedOptions.join(",");

      // 动态参数数组
      const arr1 = this.arrDy;
      const arr1New = arr1.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // 静态参数数组
      const arr2 = this.arrStatic;
      const arr2New = arr2.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      const arr = [...arr1New, ...arr2New];

      // attrs
      this.form.attrs = arr;
      // console.log(this.form.attrs);

      console.log(this.form);
      const res = await this.$http.post(`goods`, this.form);
      // console.log(res);
      // this.$router.push({
      //   name: "goods"
      // });
    },
    // 图片上传
    handleRemove(file) {
      // console.log(file);
      const index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });

      this.form.pics.splice(index, 1);
      // console.log(this.form.pics);

      // file.response.data.tmp_path;
    },
    // 上传成功
    handleSuccess(response) {
      // console.log(response);
      this.form.pics.push({
        pic: response.data.tmp_path
      });
      // console.log(this.form.pics);

      // response.data.tmp_path;
    },
    async changeTab() {
      // 判断选中的tab是不是第二个
      if (this.active === "2") {
        if (this.selectedOptions.length === 3) {
          // 发送请求
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          this.arrDy = res.data.data;
          // console.log(this.arrDy);
          this.arrDy.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.split(",");
          });
        } else {
          this.$message.warning("请选择商品的三级分类");
        }
      }
      // 判断选中的tab是不是第三个
      if (this.active === "3") {
        if (this.selectedOptions.length === 3) {
          // const res = await this.$http.
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStatic = res.data.data;
          // console.log(this.arrStatic);
        } else {
          this.$message.warning("请选择商品的三级分类");
        }
      }
    },

    handleChange() {},

    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.tabs {
  margin-top: 20px;
}
.steps {
  margin-top: 20px;
}
.form {
  height: 400px;
  overflow: auto;
}
</style>
