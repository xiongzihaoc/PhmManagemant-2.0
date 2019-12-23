<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="box-card cardOne">
          <div slot="header" class="clearfix">
            <span>CPU</span>
          </div>
          <div class="titleCon">
            <div class="attribute" style="font-weight:700">属性</div>
            <div class="value" style="font-weight:700">值</div>
          </div>
          <div class="titleCon">
            <div class="attribute">核心数</div>
            <div class="value">{{cpu.cpuNum}}</div>
          </div>
          <div class="titleCon">
            <div class="attribute">用户使用率</div>
            <div class="value">{{cpu.used + "%"}}</div>
          </div>
          <div class="titleCon">
            <div class="attribute">系统使用率</div>
            <div class="value">{{cpu.sys + "%"}}</div>
          </div>
          <div class="titleCon">
            <div class="attribute">当前空闲率</div>
            <div class="value">{{cpu.free + "%"}}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card cardTwo">
          <div slot="header" class="clearfix">
            <span>内存</span>
          </div>
          <div class="RAMtitleCon">
            <div class="RAMattribute" style="font-weight:700">属性</div>
            <div class="RAMvalue" style="font-weight:700">内存</div>
            <div class="RAMvalue" style="font-weight:700">jvm</div>
          </div>
          <div class="RAMtitleCon">
            <div class="RAMattribute">总内存</div>
            <div class="RAMvalue">{{mem.total + 'G'}}</div>
            <div class="RAMvalue">{{jvm.total + 'M'}}</div>
          </div>
          <div class="RAMtitleCon">
            <div class="RAMattribute">已用内存</div>
            <div class="RAMvalue">{{mem.used + 'G'}}</div>
            <div class="RAMvalue">{{jvm.used + 'M'}}</div>
          </div>
          <div class="RAMtitleCon">
            <div class="RAMattribute">剩余内存</div>
            <div class="RAMvalue">{{mem.free + 'G'}}</div>
            <div class="RAMvalue">{{jvm.free + 'M'}}</div>
          </div>
          <div class="RAMtitleCon">
            <div class="RAMattribute">使用率</div>
            <div class="RAMvalue">{{mem.usage + '%'}}</div>
            <div class="RAMvalue">{{jvm.usage + '%'}}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="box-card cardThree">
      <div slot="header" class="clearfix">
        <span>服务器信息</span>
      </div>
      <div class="WebtitleCon">
        <div class="WebName" style="font-weight:700">服务器名称</div>
        <div class="WebIP" style="font-weight:700">服务器IP</div>
        <div class="WebSys" style="font-weight:700">操作系统</div>
        <div class="WebFramework" style="font-weight:700">系统架构</div>
      </div>
      <div class="WebtitleCon">
        <div class="WebName">{{sys.computerName}}</div>
        <div class="WebIP">{{sys.computerIp}}</div>
        <div class="WebSys">{{sys.osName}}</div>
        <div class="WebFramework">{{sys.osArch}}</div>
      </div>
    </el-card>
    <el-card class="box-card cardFour">
      <div slot="header" class="clearfix">
        <span>Java虚拟机信息</span>
      </div>
      <div class="JavatitleCon">
        <div class="JavaName">
          <span style="float:left">Java名称</span>
          <span style="float:left;margin-left:120px;">{{jvm.name}}</span>
        </div>
        <div class="JavaIP" style="font-weight:700">
          <span style="float:left">Java版本</span>
          <span style="float:left;margin-left:120px;">{{jvm.version}}</span>
        </div>
        <div class="JavaSys" style="font-weight:700">
          <span style="float:left">启动时间</span>
          <span style="float:left;margin-left:120px;">{{jvm.startTime}}</span>
        </div>
        <div class="JavaFramework" style="font-weight:700">
          <span style="float:left">运行时长</span>
          <span style="float:left;margin-left:120px;">{{jvm.runTime}}</span>
        </div>
        <div class="JavaFramework" style="font-weight:700">
          <span style="float:left">安装路径</span>
          <span style="float:left;margin-left:120px;">{{jvm.home}}</span>
        </div>
        <div class="JavaFramework" style="font-weight:700">
          <span style="float:left">项目路径</span>
          <span style="float:left;margin-left:120px;">{{sys.userDir}}</span>
        </div>
      </div>
    </el-card>
    <el-card class="box-card cardFive">
      <div slot="header" class="clearfix">
        <span>磁盘状态</span>
      </div>
      <div class="DiskTitleCon">
        <div class="DiskName" style="font-weight:700">盘符路径</div>
        <div class="DiskIP" style="font-weight:700">文件系统</div>
        <div class="DiskSys" style="font-weight:700">盘符类型</div>
        <div class="DiskFramework" style="font-weight:700">总大小</div>
        <div class="DiskIP" style="font-weight:700">可用大小</div>
        <div class="DiskSys" style="font-weight:700">已用大小</div>
        <div class="DiskFramework" style="font-weight:700">已用百分比</div>
      </div>
      <div class="DiskTitleCon" v-for="item in sysFiles" :key="item.dirName">
        <div class="DiskName">{{item.dirName}}</div>
        <div class="DiskIP">{{item.sysTypeName}}</div>
        <div class="DiskSys">{{item.typeName}}</div>
        <div class="DiskFramework">{{item.total}}</div>
        <div class="DiskIP">{{item.free}}</div>
        <div class="DiskSys">{{item.used}}</div>
        <div class="DiskFramework">{{item.usage + '%'}}</div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cpu: {},
      jvm: {},
      mem: {},
      sys: {},
      sysFiles: {},
      loading: true
    };
  },
  created() {
    this.getServerInfoList();
  },
  methods: {
    async getServerInfoList() {
      const { data: res } = await this.$http.post(
        "server/getServerInfo.do",
        {}
      );
      this.cpu = res.data.cpu;
      this.jvm = res.data.jvm;
      this.mem = res.data.mem;
      this.sys = res.data.sys;
      this.sysFiles = res.data.sysFiles;
      this.loading = false
    }
  }
};
</script>
<style lang='less' scoped>
.titleCon {
  overflow: hidden;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #e7eaec;
}
.attribute {
  float: left;
  width: 50%;
}
.value {
  float: left;
  width: 50%;
}
.RAMtitleCon {
  overflow: hidden;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #e7eaec;
}
.RAMattribute {
  float: left;
  width: 33%;
}
.RAMvalue {
  float: left;
  width: 33%;
}
.WebtitleCon {
  overflow: hidden;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #e7eaec;
}
.WebtitleCon div {
  float: left;
  width: 25%;
}
.JavatitleCon div {
  float: left;
  width: 50%;
  overflow: hidden;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #e7eaec;
}
.el-card span {
  font-weight: 700;
}
.cardFour .JavatitleCon span:nth-child(2) {
  font-weight: 400;
}
.DiskTitleCon {
  overflow: hidden;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #e7eaec;
}
.DiskTitleCon div {
  float: left;
  width: 14%;
}
.clearfix span {
  font-size: 20px;
}
</style>