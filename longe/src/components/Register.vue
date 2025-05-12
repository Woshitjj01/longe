<template>
  <div class="register-container">
    <h2>注册</h2>
    <form @submit.prevent="submitForm" class="register-form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="username"
          :class="{ 'is-invalid': $v.username.$invalid && $v.username.$dirty }"
        />
        <div v-if="$v.username.$dirty" class="invalid-feedback">
          <span v-if="!$v.username.required">用户名不能为空</span>
          <span v-if="!$v.username.minLength">用户名至少需要 6 个字符</span>
        </div>
      </div>

      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          type="email"
          id="email"
          v-model="email"
          :class="{ 'is-invalid': $v.email.$invalid && $v.email.$dirty }"
        />
        <div v-if="$v.email.$dirty" class="invalid-feedback">
          <span v-if="!$v.email.required">邮箱不能为空</span>
          <span v-if="!$v.email.email">请输入有效的邮箱地址</span>
        </div>
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <input
          type="password"
          id="password"
          v-model="password"
          :class="{ 'is-invalid': $v.password.$invalid && $v.password.$dirty }"
        />
        <div v-if="$v.password.$dirty" class="invalid-feedback">
          <span v-if="!$v.password.required">密码不能为空</span>
          <span v-if="!$v.password.minLength">密码至少需要 8 个字符</span>
        </div>
      </div>

      <div class="form-group">
        <label for="confirm-password">确认密码</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          :class="{ 'is-invalid': $v.confirmPassword.$invalid && $v.confirmPassword.$dirty }"
        />
        <div v-if="$v.confirmPassword.$dirty" class="invalid-feedback">
          <span v-if="!$v.confirmPassword.required">确认密码不能为空</span>
          <span v-if="!$v.confirmPassword.sameAsPassword">两次密码不一致</span>
        </div>
      </div>

      <button type="submit" class="submit-btn">注册</button>
    </form>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  validations: {
    username: { required, minLength: minLength(6) },
    email: { required, email },
    password: { required, minLength: minLength(8) },
    confirmPassword: { required, sameAsPassword: sameAs("password") },
  },
  methods: {
    submitForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // 表单验证通过，提交注册逻辑
        console.log("注册成功！", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        // 这里可以添加将数据发送到后端的逻辑
      } else {
        console.log("表单验证失败");
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  color: red;
  font-size: 0.875em;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background: #0086f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #0077d9;
}
</style>