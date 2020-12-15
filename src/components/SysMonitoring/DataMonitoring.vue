<template>
  <div>
    <h1>数据监控</h1>
    <baidu-map
      :center="center"
      :zoom="zoom"
      @ready="handler"
      class="bm-view"
      id="allmap"
      ak="vVpuugeZVwK7ORmKrG7TXameXn6qDNmh"
    >
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
export default {
  components: {
    BaiduMap
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3
    };
  },
  methods: {
    handler({ BMap, map }) {
      var map = new BMap.Map("allmap");
      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);
      map.enableScrollWheelZoom(true);
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          console.log(r.point);
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            //   alert("您的位置：" + r.point.lng + "," + r.point.lat);
            // } else {
            //   alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.bm-view {
  margin-top: 30px;
  border: 1px solid #ccc;
  width: 100%;
  height: 600px;
}
</style>
