<template>
  <div id="payment">
    <el-dialog width="40%" :visible.sync="dialogVisible">
      <div class="mypay-title">
        <h4 class="modal-title" id="myModalLabel">微信支付¥{{payinfo.price / 100}}</h4>
      </div>
      <div class="mypay-qrcode">
        <div id="query">
          <canvas id="canvas"></canvas>
        </div>
        <span>使用微信扫描二维码进行支付</span>
      </div>
    </el-dialog>
    <div
      class="payment-header"
      :style="{backgroundImage:'url('+$store.state.url+'payment/headerbg.jpg)'}"
    >
      <div class="payment-title">支付中心</div>
    </div>
    <div class="payment-card">
      <div class="card-title">
        <span>订单：{{this.orderId}}</span>
      </div>
      <div class="card-content">
        <img :src="payinfo.cover" class="card-img" />
        <div class="order-title">{{payinfo.name}}</div>
        <div class="order-price">
          实付金额:
          <span>¥{{payinfo.price / 100}}</span>
        </div>
      </div>
      <div class="pay-method">
        <span>支付方式</span>
        <div class="pay-img">
          <img :src="wechatImage" />
        </div>
      </div>
      <div class="summary">
        应付金额:
        <span>¥{{payinfo.price / 100}}</span>
        <button class="pay" @click="showModal">立即支付</button>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import { mapState } from "vuex";
import random from "string-random";
import instance from "../../../axios-auth.js";

export default {
  data() {
    return {
      id: "",
      orderId: "",
      dialogVisible: false,
      qrcodeImage: this.$store.state.url + "payment/qrcode.png",
      wechatImage: this.$store.state.url + "payment/WePayLogo.png"
    };
  },
  methods: {
    closeModal() {
      let payment = {
        orderId: this.orderId,
        productId: this.$route.query.id,
        productName: this.payinfo.name,
        userId: localStorage.getItem("userId"),
        fee: this.payinfo.price * 100
      };
    },
    showModal() {
      this.dialogVisible = true;
      let payment = {
        orderId: this.orderId,
        productId: this.$route.query.id,
        productName: this.payinfo.name,
        userId: localStorage.getItem("userId"),
        fee: this.payinfo.price * 100
      };
      let config = {
        headers: { Authorization: localStorage.getItem("idToken") }
      };
      console.log(payment);
      instance
        .post("/lambda", payment, config)
        .then(res => {
          console.log(res);
          this.qrCode(res.data.code_url, payment.orderId);
        })
        .catch(err => {
          console.error(err);
        });
    },
    qrCode(url, orderId) {
      let canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, url, err => {
        err ? console.error(err) : "";
        let timer = setInterval(() => {
          this.query(timer, orderId);
        }, 3000);
      });
    },
    query(timer, orderId) {
      console.log(orderId);
      let query = "/lambda/tenpay?orderId=" + orderId;
      instance
        .get(query, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.$store.state.idToken
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data == "SUCCESS") {
            // $('#myPay').modal('hide');
            let allid = {
              id: this.$route.query.id,
              orderId: orderId,
              cover: this.payinfo.cover
            };
            if (this.$route.query.type == 2) {
              //2为活动报名
              this.$store.dispatch("postCourseId", allid);
            } else {
              this.$store.dispatch("postUserInfo", allid);
            }
            clearInterval(timer);
            // this.$toast.success({ message: '报名成功 ~!' })
            this.$router.push({ path: "/payOK" });
          }
        })
        .catch(err => console.log(err));
    }
  },
  created: function() {
    this.orderId = random(6) + Date.now();
    // this.$store.commit("updateLoading", true);
    if (this.$route.query.type == 2) {
      this.$store.dispatch("payCourse", this.$route.query.id);
    } else if (this.$route.query.type == 0) {
      this.$store.dispatch("searchActivity", this.$route.query.id);
    } else {
      this.$store.dispatch("searchEduActivity", this.$route.query.id);
    }
  },
  computed: {
    ...mapState({
      payinfo: state => state.payInfo
    })
  }
};
</script>

<style scoped>
#payment {
  background-color: #f8fafc;
  min-width: 1200px;
}

#payment .payment-header {
  width: 100%;
  height: 160px;
  background-color: #e3e6e9;
  margin: 0 auto;
  position: relative;
}

#payment .payment-title {
  font-size: 32px;
  line-height: 115px;
  color: #07111b;
  font-weight: 200;
  position: relative;
  width: 65%;
  margin: 0 auto;
}

#payment .payment-card {
  height: 660px;
  width: 70%;
  margin: 0 auto;
  position: relative;
  top: -40px;
  box-shadow: 0 8px 16px 0 rgba(7, 17, 27, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

#payment .card-title {
  margin: 0 auto;
  width: 90%;
  padding: 40px 0;
  font-size: 16px;
  color: #07111b;
}

#payment .card-content {
  margin: 0 auto;
  width: 90%;
  background-color: #f3f5f7;
  padding: 24px;
  height: 120px;
  margin-bottom: 20px;
}

#payment .card-img {
  width: 160px;
  height: 90px;
  margin-right: 24px;
  float: left;
}

#payment .order-title {
  float: left;
  font-size: 16px;
  width: 400px;
}

#payment .order-price {
  display: inline-block;
  line-height: 95px;
  color: #93999f;
}

#payment .order-price span {
  color: #f01414;
}

#payment .pay-method {
  width: 90%;
  margin: 0 auto;
  padding: 30px 20px;
  border-top: 2px solid #d9dde1;
  border-bottom: 2px solid #d9dde1;
  height: 120px;
}

#payment .pay-method span {
  font-size: 16px;
  display: block;
  margin-bottom: 30px;
}

#payment .pay-img {
  width: 114px;
  height: 40px;
  background-color: #f3f5f7;
  padding: 20px 10px;
}

#payment .pay-img img {
  width: 100%;
  height: 100%;
}

#payment .summary {
  width: 206px;
  height: 176px;
  float: right;
  padding-top: 36px;
}

#payment .summary span {
  font-size: 18px;
  color: #f01414;
}

#payment .pay {
  width: 140px;
  height: 40px;
  background-color: #f01414;
  color: #fff;
  line-height: 38px;
  border: 1px solid #f01414;
  margin-top: 40px;
  font-size: 16px;
}

#payment .mypay {
  top: 100px;
  width: 25%;
  height: 364px;
}

#payment .mypay-height {
  height: 100%;
}

#payment .mypay-title {
  text-align: center;
  border-bottom: 1px solid #fff;
  margin-top: 30px;
}

#payment .mypay-qrcode {
  text-align: center;
}

#payment .mypay-qrcode img {
  display: block;
  margin: 10px auto;
}
</style>