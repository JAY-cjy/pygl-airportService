var vm = new Vue({
    el: "#airportService",
    data: {
        type: 'join',
    },

    mounted() {

    },

    methods: {
        // 改变服务类型
        changeService: function (e) {
            var type = e.target.dataset.type;
            // console.log(type);

            this.type = type;
        },
    },
})