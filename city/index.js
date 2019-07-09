var vm = new Vue({
    el: '.city',
    data: {
        showCityList: '',
    },

    mounted() {

    },

    methods: {
        showCity(e) {
            // console.log(e)
            if (this.showCityList == e.target.dataset.city) {
                this.showCityList = '';
                return;
            }
            this.showCityList = e.target.dataset.city
        },
    },
})

$(document).ready(function () {
    $(".li div").click(function () {
        // 处理字符串
        var temp = this.outerHTML.toString();
        var temp1 = temp.substring(5);
        var temp2 = temp1.split('').reverse().join('');
        var temp3 = temp2.substring(6);
        var temp4 = temp3.split('').reverse().join('');
        console.log(temp4)

        // 判断类型，保存城市
        if (window.location.search.split("=")[1]== 'send') {
            localStorage.setItem("city2", JSON.stringify(temp4));
            window.location.replace("../airportService/index.html?type=" + 'send')

        } else {
            localStorage.setItem("city", JSON.stringify(temp4));
            window.location.replace("../airportService/index.html?type=" + 'join')
        }
    });
});