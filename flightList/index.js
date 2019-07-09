var vm = new Vue({
    el: '.scroller',
    data: {
        // 航班数据
        flightDetails: '',
        // 起飞时间
        takeOffTime: '',
    },

    mounted() {
        // 获取航班数据
        var flightDetails = JSON.parse(localStorage.getItem("flightDetails"));
        console.log(flightDetails)
        this.flightDetails = flightDetails;

        // 获取起飞时间
        var takeOffTime = JSON.parse(localStorage.getItem("takeOffTime"));
        console.log(takeOffTime)
        this.takeOffTime = takeOffTime;
    },

    methods: {
        // 选择机场
        goTobus(e) {
            var details = [this.flightDetails[e]];
            console.log(details);
            // 保存
            localStorage.setItem("newDetails", JSON.stringify(details));
            window.location.href = "../airportService/index.html";
        },
    },
})
$(document).ready(function () {
    var takeOffTime = JSON.parse(localStorage.getItem("takeOffTime"));
    $(".takeOffTime").html(takeOffTime)
});