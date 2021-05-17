import $ from '../static/jquery-1.10.2.min'

export default function ajaxFn(obj) {
	var newarrs = obj.arr
	var CasAuthBPM = obj.cookie
	var successCallback = obj.successCallback
	var failCallback = obj.failCallback
    $.ajax(config.url,{
        data:JSON.stringify(newarrs),     
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        dataType:'json',
        traditional:true,
        type:'POST',
        method:'POST',
        async:true,
        headers: {
            "CASTGC":CasAuthBPM //自定义请求头
        },
    })
    .done(function(data, textStatus, jqXHR) {
        successCallback(data)
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        failCallback(jqXHR)
    })
    .always(function(res){
        //console.log(res)
    });
}
