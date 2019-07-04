var vm = new Vue({
    el: '.city',
    data: {
        showCityList: '',
    },

    mounted() {
        
    },

    methods: {
        showCity(e){
            // console.log(e)
            if(this.showCityList == e.target.dataset.city){
                this.showCityList = '';
                return;
            }
            this.showCityList = e.target.dataset.city
        },
    },
})