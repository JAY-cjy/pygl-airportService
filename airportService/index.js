var vm = new Vue({
    el: "#airportService",
    data: {
        // 服务类型
        type: 'join',
        // 航班详情
        showDate: 'false',
        flightDetails: '',
        // 多个航班选择后
        // newDetails: '',
        // 城市
        showCity: 'false',
        city: '',
        showCity2: 'false',
        city2: '',
        // 起飞日期
        takeOffTime: '',
        // 送达机场
        showPlane: 'false',
        plane: '',
        // 区别接送机服务
        carType: '',
        // 显示包车
        showCar: false,
        // 是否存在包车
        noCar: false,
        car: '',
        // 选中car的下标
        carIndex: '',
        // 显示多于三个car
        showCArType: true,
        carMore: true,
        // 包车司机的单类型
        orderMode: '',
        // 名字
        name: '',
        // 电话
        phone: '',
        // 区号
        areaCode: '86',
        // 接机牌
        board: '',
        // 备注
        remark: '',
        // 价格
        price: '',
        // 车辆价格id
        id: '',
        // 当前日期
        nowDate: '',
        // layui
        layui: true,
        // 送机时间
        sendTime: '',
        // 证件类型
        idType: '身份证',
        idCard: '',
        // 航班号
        flightNumber: '',
        // 去支付接口用的参数
        sellprice: '',
        supplier: '',
    },

    mounted() {
        var that = this;

        // 判断url存在的type
        var type = this.getvl('type');
        console.log(type)
        if (type) {
            // 获取送达机场
            var plane = localStorage.getItem("plane");
            console.log(plane)
            this.plane = plane;
            this.showPlane = 'true';
            this.type = type;
            this.carType = type;
        }

        // 获取起飞时间
        if (localStorage.getItem("takeOffTime")) {
            var takeOffTime = JSON.parse(localStorage.getItem("takeOffTime"));
            console.log(takeOffTime)
            this.takeOffTime = takeOffTime;
        }

        // 先判断是否存在多个航班且已选择
        if (localStorage.getItem("newDetails")) {
            var flightDetails = JSON.parse(localStorage.getItem("newDetails"));
            console.log(flightDetails)
            this.flightDetails = flightDetails;
            this.showDate = 'true';
            this.flightNumber = flightDetails[0].flightNumber;
        } else {
            // 判断是否存在航班数据
            if (localStorage.getItem("flightDetails")) {
                var flightDetails = JSON.parse(localStorage.getItem("flightDetails"));
                console.log(flightDetails)
                this.flightDetails = flightDetails;
                this.showDate = 'true';
                this.flightNumber = flightDetails[0].flightNumber;
            }
        }

        // 判断是join/send 获取city数据
        if (this.type == 'join') {
            var city = JSON.parse(localStorage.getItem("city"));
            console.log(city)
            this.city = city;
            this.showCity = 'true';
            this.showCar = true;

            // 发送请求获取包车数据
            this.getCar();
        } else {
            var city2 = JSON.parse(localStorage.getItem("city2"));
            console.log(city)
            this.city2 = city2;
            this.showCar = false;
            this.showCity2 = 'true';
        }

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
        this.nowDate = nowDate;

        // 挂载layui
        laydate.render({
            elem: '.date', //指定元素
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            done: function (value, date, endDate) {
                console.log(value); //得到日期生成的值，如：2017-08-18
                // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                that.sendTime = value;

                if (that.plane == '') {
                    alert("请选择送达机场");
                    return;
                }

                if (that.city2 == '') {
                    alert("请选择上车地点");
                    return;
                }

                // 调用送机car
                that.getSendCara();
            }
        });

    },

    methods: {
        // 改变服务类型
        changeService: function (e) {
            var type = e.target.dataset.type;
            // console.log(type);
            // if(that.type != that.carType){

            // }

            this.type = type;
        },

        // 去航班页
        goToPlane() {
            // console.log(1)
            window.location.href = "../selectFlight/index.html"
        },

        // 去选择机场
        goToPlane2() {
            // console.log(1)
            window.location.href = "../plane/index.html"
        },

        // 去城市页
        goToCity(e) {
            if (this.flightDetails == "") {
                alert("请先选择航班");
                return;
            }

            if (e.target.dataset.citytype == 'send') {
                window.location.href = "../city/index.html?type=send"
                return;
            }

            window.location.href = "../city/index.html"
        },

        // 获取url传参
        getvl(name) {
            var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
            if (reg.test(location.href))
                return unescape(RegExp.$2.replace(/\+/g, " "));
            return "";
        },
        // getvl(name) { 
        //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        //     var r = window.location.search.substr(1).match(reg); 
        //     if (r != null) return unescape(r[2]); 
        //     return null; 
        // },

        // 获取包车数据 join
        getCar() {
            var that = this;

            $.ajax({
                type: 'POST',
                url: "http://192.168.0.152:8080/pyerp/busprice/H5searchOffer.action",
                data: {
                    qifeitime: that.takeOffTime,
                    arrtime: that.flightDetails[0].arrtime + '降落' + that.flightDetails[0].arrName,
                    songdadd: that.city,
                    baotype: 2,
                },
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log(res)

                    if (res.length == 0) {
                        that.noCar = true;
                        that.showCar = false;
                    } else {
                        that.car = res;
                        that.price = res[0].modee;
                        that.carIndex = 0;
                        that.orderMode = res[0].orderMode;
                        that.id = res[0].id;
                        that.supplier = res[0].supplier;
                    }
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },

        // 选择具体包车
        selectCar(e) {
            this.carIndex = e;
            this.price = this.car[e].modee;
            this.orderMode = this.car[e].orderMode;
            this.id = this.car[e].id;
            this.supplier = this.car[e].supplier;
        },

        // 显示更多车型
        showCAr() {
            this.showCArType = !this.showCArType
            this.carMore = !this.carMore
        },

        // 显示layui的时间
        showLayui() {
            console.log(11)
            this.layui = false;
        },

        // 获取送机car
        getSendCara() {
            var that = this;

            $.ajax({
                type: 'POST',
                url: "http://192.168.0.152:8080/pyerp/busprice/H5searchOffer.action",
                data: {
                    chufatime: that.sendTime,
                    cityname: that.city2,
                    airportname: that.plane,
                    baotype: 1,
                },
                dataType: 'json',
                success: function (res) {
                    //请求成功函数内容
                    console.log(res)

                    if (res.length == 0) {
                        that.noCar = true;
                        that.showCar = false;
                    } else {
                        that.showCar = true;
                        that.car = res;
                        that.price = res[0].modee;
                        that.carIndex = 0;
                        that.orderMode = res[0].orderMode;
                        that.id = res[0].id;
                        that.supplier = res[0].supplier;
                    }
                },
                error: function (res) {
                    //请求失败函数内容
                }
            })
        },

        // 去支付
        goToPay() {
            // 正则判断
            if (this.name == '') {
                alert("请输入姓名");
                return;
            }
            if (this.phone == '') {
                alert("请输入联系人电话");
                return;
            }
            if (!(/^1[34578]\d{9}$/.test(this.phone))) {
                alert("请输入合法联系人电话");
                return;
            }
            if (this.idType == '身份证') {
                if (this.idCard == '') {
                    alert("请输入身份证");
                    return;
                } else if (!/^\d{17}(\d|x)$/i.test(this.idCard)) {
                    alert("请输入合法身份证");
                    return;
                }
            } else if (this.idCard == '') {
                alert("请输入护照");
                return;
            }

            // 判断接送类型，赋值
            var bTime
            var eTime
            var bhours
            var ehours
            // var id
            var baotype
            if (this.type == 'join') {
                bTime = this.takeOffTime;
                eTime = this.takeOffTime;
                bhours = this.flightDetails[0].arrtime;
                ehours = this.flightDetails[0].arrtime;
                baotype = 2;
            } else {
                bTime = this.sendTime.split(" ")[0];
                eTime = this.sendTime.split(" ")[0];
                bhours = this.sendTime.split(" ")[1];
                ehours = this.sendTime.split(" ")[1];
                baotype = 1;
            }

            // 配合原来支付环境写的form表单事件
            $("[name='kname']").val(this.name);
            $("[name='type']").val(this.idType);
            $("[name='IDcard']").val(this.idCard);
            $("[name='phoneNumber']").val(this.phone);
            $("[name='pickUp']").val(this.board);
            $("[name='note']").val(this.remark);

            $("[name='busXqId']").val(this.id);
            $("[name='supplierId']").val(this.supplier);
            //接机
            $("[name='chufatime']").val(this.sendTime);
            $("[name='cityname']").val(this.city2);
            $("[name='airportname']").val(this.plane);
            //送机
            $("[name='qifeitime']").val(this.takeOffTime);
            $("[name='arrtime']").val(this.flightDetails[0].arrtime + '降落' + this.flightDetails[0].arrName);
            $("[name='songdadd']").val(this.city);
            $("[name='hangban']").val(this.flightNumber);

            $("[name='mobile']").val(1);

            // 判断单是否为抢单
            if (this.orderMode == '0') {
                var that = this;
                // console.log(that.price)
                $.ajax({
                    type: 'POST',
                    url: "http://192.168.0.152:8080/pyerp/busprice/modelValidation.action",
                    data: {
                        btime: bTime,
                        etime: eTime,
                        bhours: bhours,
                        ehours: ehours,
                        id: that.id,
                        baotype: baotype,
                    },
                    dataType: 'json',
                    success: function (res) {
                        //请求成功函数内容
                        console.log(res)

                        // 判断有没有空余司机
                        if (res.state == 0) {
                            alert(res.msg)
                        } else {
                            var type;
                            if (that.type == 'join') {
                                type = 2;
                            } else {
                                type = 1;
                            }

                            $("[name='driverMatchingid']").val(res.msg);
                            $("[name='baocheType']").val(type);
                            $("[name='orderMode']").val(0);

                            $("#informationform").attr("action", "http://192.168.0.152:8080/pyerp/busOrder/wechatPay.action").submit();


                            // $.ajax({
                            //     type: 'POST',
                            //     url: "http://192.168.0.152:8080/pyerp/busOrder/wechatPay.action",
                            //     data: {
                            //         driverMatchingid: res.msg,
                            //         kname: that.name,
                            //         type: that.idType,
                            //         IDcard: that.idCard,
                            //         phoneNumber: that.phone,
                            //         pickUp: that.board,
                            //         note: that.remark,
                            //         busXqId: that.id,
                            //         supplierId: that.supplier,
                            //         chufatime: that.sendTime,
                            //         cityname: that.city2,
                            //         airportname: that.plane,
                            //         qifeitime: that.takeOffTime,
                            //         arrtime: that.flightDetails[0].arrtime + '降落' + that.flightDetails[0].arrName,
                            //         songdadd: that.city,
                            //         baocheType: type,
                            //         hangban: that.flightNumber,
                            //         orderMode: 0,
                            //         mobile: 1,
                            //     },
                            //     dataType: 'json',
                            //     success: function (res) {
                            //         //请求成功函数内容
                            //         console.log(res)
                            //     },
                            //     error: function (res) {
                            //         //请求失败函数内容
                            //     }
                            // })
                        }
                    },
                    error: function (res) {
                        //请求失败函数内容
                    }
                })
            } else if (this.orderMode == '1') {
                var type;
                if (that.type == 'join') {
                    type = 2;
                } else {
                    type = 1;
                }

                $("[name='driverMatchingid']").val(res.msg);
                $("[name='baocheType']").val(type);
                $("[name='orderMode']").val(1);

                $("#informationform").attr("action", "http://192.168.0.152:8080/pyerp/busOrder/wechatPay.action").submit();
            }
        },

    },
})