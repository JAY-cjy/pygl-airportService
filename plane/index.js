$(document).ready(function () {
    $(".plane").click(function (e) {
        // console.log(e.currentTarget.innerHTML)
        // 保存选中的机场
        localStorage.setItem("plane", e.currentTarget.innerHTML);
        window.location.replace("../airportService/index.html?type=send")
    });
});