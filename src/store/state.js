const state = {
    url: '../../../../static/images/',
    url2:'../../../static/images',
    idToken: null,
    expirationDate: null,
    userId: null,
    user: null,
    vueElementLoading: false,//loading组件是否打开

    //学生
    userInfo: [],
    content: [],
    myClass: [],
    status: null,
    pointList: [
        {
            width: "8%",
            height: "15%",
            bottom: "15%",
            right: "9%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "22%",
            right: "20%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "18%",
            right: "35%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "15%",
            right: "50%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "15%",
            right: "60%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "15%",
            right: "70%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "20%",
            right: "80%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "45%",
            right: "88%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "60%",
            right: "80%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "50%",
            right: "67%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "35%",
            right: "50%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "40%",
            right: "20%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "60%",
            right: "21%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "60%",
            right: "35%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "60%",
            right: "50%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "7%",
            height: "12%",
            bottom: "72%",
            right: "57%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "80%",
            right: "40%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        },
        {
            width: "8%",
            height: "15%",
            bottom: "80%",
            right: "20%",
            bgImg: "",
            status: "",
            description: "",
            number: "",
            name: "",
            flag: false
        }
    ],
    courseName: "",
    roles: ['/dashboard/class', '/console', '/EduAdmin', '/Admin', '/superAdmin'],
    roleId: 0,
    courseList: [],
    courseCurrentList: [],
    workList: [],
    workCurrentList: [],
    msgList: [],
    msgCurrentList: [],

    //管理员
    adminCourseList: [],
    videoCurrentList: [],
    videoData: [],
    inputData: {
        chapter: {
            option: "",
            list: []
        }
    },

    //超级管理员
    adminList: [],
    adminCurrentList: [],

    //公用
    limit: 12
}
export default state