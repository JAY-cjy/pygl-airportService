var vm = new Vue({
    el: "#airportService",
    data: {
        type: 'join',
        date: '',
        showDate: 'false',
    },

    mounted() {
        //获取当前时间
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;
        this.date = nowDate;

        // 挂载layuidate
        this.initDeta();

    },

    methods: {
        // 改变服务类型
        changeService: function (e) {
            var type = e.target.dataset.type;
            // console.log(type);

            this.type = type;
        },

        // 挂载layuidate
        initDeta: function () {
            var that = this;
            var date = laydate.render({
                elem: '.date',
                calendar: false, // 农历
                showBottom: false, // 底部控件
                done: function (value, date, endDate) {
                    console.log(value); //得到日期生成的值，如：2017-08-18
                    console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                    // console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    that.date = value;
                    that.showDate = true;
                }
            });

        },
    },
})