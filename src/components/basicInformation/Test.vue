<template>
  <div>
    <el-card>
      <!-- 生成秘钥 -->
      <el-row :gutter="20">
        <el-col :span="1.5" style="padding-top:10px;">
          <span>随机AESKEY ：</span>
        </el-col>
        <el-col :span="12">
          <el-input v-model="AESKEYValue"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="secretKey">生成秘钥</el-button>
        </el-col>
      </el-row>
      <!-- 加密秘钥生成rsa -->
      <el-row :gutter="20">
        <el-col :span="1.5" style="padding-top:10px;margin-left:41px;">
          <span>加密rsa ：</span>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" rows="5" v-model="RsaValue"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="rsaKey">生成rsa</el-button>
        </el-col>
      </el-row>
      <!-- 内容区域 -->
      <el-row :gutter="20">
        <el-col :span="1.5" style="padding-top:50px;margin-left:62px;">
          <span>内容 ：</span>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" rows="10" v-model="content"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button
            type="primary"
            style="margin-top:100px;margin-left:10px"
            @click="encryptionBtn"
          >加密</el-button>
        </el-col>
      </el-row>
      <!-- 加密内容区域 -->
      <el-row :gutter="20">
        <el-col :span="1.5" style="padding-top:50px;margin-left:62px;">
          <span>加密 ：</span>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" rows="10" v-model="encryption"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" style="margin-top:100px;margin-left:10px" @click="decodeBtn">解密</el-button>
        </el-col>
      </el-row>
      <!-- 解密内容区域 -->
      <el-row :gutter="20">
        <el-col :span="1.5" style="padding-top:50px;margin-left:62px;">
          <span>解密 ：</span>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" rows="10" v-model="decode"></el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
export default {
  data() {
    return {
      AESKEYValue: "",
      content: "",
      encryption: "",
      decode: "",
      RsaValue: ""
    };
  },
  methods: {
    // 生成秘钥
    secretKey() {
      this.getRandomCode();
    },
    // 加密按鈕
    encryptionBtn() {
      this.encrypt();
    },
    // 解密按鈕
    decodeBtn() {
      this.decrypt();
    },
    // 加密方法
    encrypt() {
      var plaintText = this.content;
      var options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      };
      var key = CryptoJS.enc.Utf8.parse(this.AESKEYValue);
      var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
      var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
      this.encryption = encryptedBase64Str.replace(/\+/g, "-");
      return encryptedBase64Str;
    },
    // 解密方法
    decrypt() {
      var vals = this.encryption.replace(/\-/g, "+").replace(/_/g, "/");
      var options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      };
      var key = CryptoJS.enc.Utf8.parse(this.AESKEYValue);
      var decryptedData = CryptoJS.AES.decrypt(vals, key, options);
      var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
      this.decode = decryptedStr;
      return decryptedStr;
    },
    // 生成rsa
    rsaKey() {
      this.rsaDecode();
    },
    // 随机码生成
    getRandomCode() {
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var str = "";
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      str += code[parseInt(Math.floor(Math.random() * 36))];
      this.AESKEYValue = str;
      return str;
    },
    rsaDecode() {
      var encrypt = new JSEncrypt();
      var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKjl56ysmgXEbrsuIfYRqEpw8WPw/kmD0nhXBfAkLn9qvVkBBM0rze3b44jbRmXBJv2sYShLFEWeDUARgw4/JKyLKHu5IC8gXuKWSLjNsVwzpp36I7pvC9NFj3KXDSV9wrPabnpvGJxMF5jnXBs1YJGuKCtsixbop5RVqB/3ckawIDAQAB'
      encrypt.setPublicKey(
        `
  -----BEGIN PUBLIC KEY----- ${publicKey} -----END PUBLIC KEY-----
        `
      );
      var data = encrypt.encrypt(this.AESKEYValue);
      this.RsaValue = data
    }
  }
};
</script>
<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
}
</style>