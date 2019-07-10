var vm = new Vue({
    el: "#airportService",
    data: {
        type: 'join',
        date: '',
        selectDate: '',
        showDate: 'false',
        flightNumber: '',
        searchResult: '',
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
                    that.selectDate = value;
                    that.showDate = true;
                }
            });

        },

        // 向后台查询数据
        search() {
            var that = this;
            // 判断是否输入航班号和时间
            // console.log(that.flightNumber,that.date)

            if (that.flightNumber == '') {
                alert("请输入航班号")
                return;
            }
            if (that.selectDate == '') {
                alert("请选择时间")
                return;
            }

            $.ajax({
                type: 'POST',
                url: "/pyerp/busprice/airportTransportationPrice.action",
                data: {
                    qifeitime: that.date,
                    hangban: that.flightNumber,
                    baotype: 2,
                },
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log(res)
                    if (res == null) {
                        that.searchResult = 'true'
                        return;
                    }

                    // 保存航班数据
                    localStorage.setItem("flightDetails", JSON.stringify(res));
                    localStorage.setItem("takeOffTime", JSON.stringify(that.date));

                    // 判断是否有多个航班
                    // console.log(res.length)
                    if (res.length > 2) {
                        window.location.href = "../flightList/index.html"
                        return;
                    }

                    window.location.replace("../airportService/index.html?type=join")
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },

    },
})