
$("#nv").append("<button class='long_button_u_down' type='button' id='btnAutoSubmit'>自动提交</button> <button class='long_button_u_down' type='button' id='btnCancelAuto'>取消自动</button>");

var utility = {
    post: function (url, data, dataType, succCallback, errorCallback) {
        $.ajax({
            url: url,
            data: data,
            timeout: 30000,
            type: "POST",
            success: succCallback,
            error: errorCallback,
            dataType: dataType
        });
    },
    get: function (url) {
        $.ajax({
            url: url,
            async: false,
            timeout: 30000,
            type: "GET",
            success: function(json){
                alert(json.test);
            },
            error: function(data){
                console.log(data);
            },
            dataType: "jsonp"
        });
    }
}

$("#btnAutoSubmit").click(function(){
    //utility.get("http://localhost:8080/ot125?cookie1=ttttt");

    $.getJSON('http://localhost:8080/ot125?cookie1=ttttt&callback=test', function(data){
        //处理data数据
        console.log(data);
    });
});

function test(data){
    console.log(data);
}