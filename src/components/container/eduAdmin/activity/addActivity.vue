<template>
  <div id="add-activity">
    <el-form ref="form" :model="form" label-width="105px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="活动名称">
            <el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动地点">
            <el-input v-model="form.activityAddress" placeholder="请输入活动地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动时间">
            <el-date-picker style="width: 250.45px;" v-model="form.startDate" type="datetime" placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上传活动封面">
        <div class="upload-cover-btn">
          上传封面
          <input type="file" @change="getCoverFile($event)" style="opacity: 0" />
        </div>
      </el-form-item>
      <el-form-item label="预览" class="preview-height">
        <div class="upload-cover-img">
          <img class="cover-image" :src="form.coverImageDisplay" alt />
        </div>
      </el-form-item>
      <el-form-item label="上传内容图片">
        <div class="upload-cover-btn">
          上传图片
          <input type="file" @change="getActivityImg($event)" style="opacity: 0" />
        </div>
      </el-form-item>
      <el-form-item label="预览" class="preview-height">
        <div class="upload-cover-img">
          <img class="cover-image" :src="form.activityContentImageDisplay" alt />
        </div>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button class="upload-btn" type="primary" @click="cancle">取消</el-button>
      <el-button class="upload-btn" type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
  import AWS from "aws-sdk";
  import mime from "mime";
  import globalAxios from "axios";
  import instance from "../../../../axios-auth.js";

  export default {
    name: "addactivity",
    data() {
      return {
        form: {
          activityName: "",
          activityAddress: "",
          startDate: "",
          coverImage: "",
          coverImageDisplay: "",
          coverType: "",
          activityContentImage: "",
          activityContentImageDisplay: "",
          activityContentImageType: ""
        }
      };
    },
    methods: {
      repairZero(num) {
        if (num < 10) {
          num = "0" + num;
        }
        return num;
      },
      getCoverFile(event) {
        console.log(event);
        this.form.coverImage = event.target.files[0];
        console.log(this.form.coverImage);
        this.form.coverType = "." + this.form.coverImage.type.split("/")[1];
        let reader = new FileReader();
        let that = this;
        reader.readAsDataURL(this.form.coverImage);
        reader.onload = function (e) {
          that.form.coverImageDisplay = this.result;
        };
      },
      getActivityImg(event) {
        this.form.activityContentImage = event.target.files[0];
        console.log(this.form.activityContentImage);
        this.form.activityContentImageType =
          "." + this.form.activityContentImage.type.split("/")[1];
        let reader = new FileReader();
        let that = this;
        reader.readAsDataURL(this.form.activityContentImage);
        reader.onload = function (e) {
          that.form.activityContentImageDisplay = this.result;
        };
      },
      uploadTwoImages(config) {
        console.log("uploadTwoImages");
        let missions = [];
        config.id = `${config.coverId}`;
        missions.push(this.uploadFileToBucket(config, this.form.coverImage));
        config.id = `${config.contentId}`;
        missions.push(
          this.uploadFileToBucket(config, this.form.activityContentImage)
        );
        return Promise.all(missions);
      },
      submit() {
        let types = [this.form.coverType, this.form.activityContentImageType];
        let config = {};
        this.insertActivity(types)
          .then(({ data }) => {
            console.log(data);
            let { config, status } = data;
            if (status !== "ok") {
              throw new Error("upload without credential");
            }
            return this.uploadTwoImages(config);
          })
          .then(res => {
            console.log(res);
            this.$message.success("添加成功");
            this.$router.replace({
              path: "/eduAdmin/activity",
              query: { alert: "1" }
            });
          })
          .catch(err => {
            console.log(err);
            this.$message.error("添加失败");
          });
      },
      uploadFileToBucket(config, file) {

        console.log("uploadFileToBucket");
        console.log(config);

        AWS.config = new AWS.Config({
          accessKeyId: config.AccessKeyId,
          secretAccessKey: config.SecretAccessKey,
          sessionToken: config.SessionToken,
          region: "cn-northwest-1"
        });
        let s3 = new AWS.S3();

        let mimeType = "";
        const fileType = file.name.split(".").pop();
        if (fileType == "jpg") {
          mimeType = "image/" + fileType
        } else {
          mimeType = mime.getType(fileType)
        }

        let params = {
          ACL: "public-read",
          Bucket: "cedsi",
          Body: file,
          Key: "eduActivity/" + config.id + "." + file.type.split("/")[1],
          ContentType: mimeType,
          Metadata: { uploader: window.localStorage.getItem("userId") }
        };
        console.log(params);
        return new Promise((resolve, reject) => {
          s3.putObject(params, (err, data) => {
            err ? reject(err) : resolve(data);
          });
        });
      },
      insertActivity(types) {
        let config = {
          headers: { Authorization: localStorage.getItem("idToken") }
        };
        let date =
          this.form.startDate.getFullYear() +
          "-" +
          this.repairZero(this.form.startDate.getMonth() + 1) +
          "-" +
          this.repairZero(this.form.startDate.getDate()) +
          " " +
          this.repairZero(this.form.startDate.getHours()) +
          ":" +
          this.repairZero(this.form.startDate.getMinutes()) +
          ":" +
          this.repairZero(this.form.startDate.getSeconds());
        let data = {
          activityTime: date,
          activityPlace: this.form.activityAddress,
          activityTitle: this.form.activityName,
          coverType: types[0],
          imgType: types[1]
        };
        console.log(data);
        return instance.post("/eduadmin/activity", data, config);
      },
      cancle() {
        this.$router.replace({
          path: "/eduAdmin/activity"
        });
      }
    },
    computed: {},
    mounted() { }
  };
</script>

<style>
  #add-activity {
    width: 98%;
    margin: 0 auto;
  }

  #add-activity .upload-cover-btn {
    width: 80px;
    height: 35px;
    display: inline-block;
    background-color: #409eff;
    color: #fff;
    border-radius: 5px;
    line-height: 35px;
    text-align: center;
  }

  #add-activity input[type="file"] {
    width: 80px;
    height: 35px;
    position: relative;
    top: -35px;
  }

  #add-activity .preview-height {
    margin-top: -35px;
  }

  #add-activity .upload-cover-img {
    display: inline-block;
    border: 1px dashed #dcdfe6;
    width: 290px;
    height: 150px;
    border-radius: 5px;
    background-color: #f5f7fa;
  }

  #add-activity .cover-image {
    width: 100%;
    height: 100%;
  }

  #add-activity .btn-box {
    margin-top: 25px;
    width: 100%;
    text-align: center;
  }

  #add-activity .upload-btn:focus {
    outline: none;
    color: #fff;
  }
</style>