var dappAddress = "n1xXDvcTt8RhCNrZPKKx4kkk47HWE4Ny7Jt";
var hash = "562249135f25c444f053aa8bf31c0f127bc601cc12f2b4104f71eab667d5270c";
var NebPay = require("nebpay");
var nebPay = new NebPay();


var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();

neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
//neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
var timer;




function toasts(msg){
    $.Toast(msg, "", "success", {
        stack: true,
        has_icon:true,
        has_close_btn:true,
        fullscreen:false,
        timeout:3000,
        sticky:false,
        has_progress:true,
        rtl:false,
    });
}





function init () {
    if (typeof nebPay.simulateCall == "undefined" || typeof nebPay.call == "undefined") {
        toasts('检测到你未开启星云钱包插件,请启动星云钱包插件并刷新.')
        return
    }
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");
    window.addEventListener('message', function (e) {
        if (e.data && e.data.data && e.data.data.account) {
            window.author = e.data.data.account;
            $("#xffrom").val(author);

        }

    });
    get();
}

$(function () {
    init();
})



// 切换查看项目还是添加项目
$('#release').on('click', function () {
    if($("#from").is(":hidden")){
        $('#information').hide();
        $('#from').show();
    }else{
        $('#information').show();
        $('#from').hide();
    }

})


$('#releases').on('click', function () {
    if($("#from").is(":hidden")){
        $('#information').hide();
        $('#from').show();
        $('#yifainfo').hide();
        $('#shoujianinfo').hide();
    }else{
        $('#information').show();
        $('#from').hide();
        $('#yifainfo').hide();
        $('#shoujianinfo').hide();
    }

})

$('#yifa').on('click', function () {
    if($("#reto").is(":hidden")){
        $('#information').show();
        $('#from').hide();
        $('#ww').show();
        $('#yifainfo').hide();
        $('#shoujianinfo').hide();

    }else{
        $('#information').hide();
        $('#from').hide();
        $('#ww').hide();
        $('#shoujianinfo').hide();
        getyifa();
        $('#yifainfo').show();
    }

})



$('#shoujian').on('click', function () {
    if($("#reget").is(":hidden")){
        $('#information').show();
        $('#from').hide();
        $('#yifainfo').hide();
        $('#shoujianinfo').hide();

    }else{
        $('#information').hide();
        $('#from').hide();
        $('#ww').hide();
        getshoujian();
        $('#yifainfo').hide();
        $('#shoujianinfo').show();
    }

})

// 打开评论
$('#information').on('click', '.see-comment', function () {
    if ($(this).data('num') == '0') {
        toasts('此条留言暂无评论...');
        return false
    }

    var comment = $(this).parent().parent().find('.comment-arr');
    var addComment = $(this).parent().parent().find('.add-comment');
    if (comment.css('display') === 'none') {
        comment.show();
        addComment.hide();
    }else{
        comment.hide();
        addComment.hide();
    }
})
// 打开添加评论
$('#information').on('click', '.add-comment-btn', function () {
    var comment = $(this).parent().parent().find('.comment-arr');
    var addComment = $(this).parent().parent().find('.add-comment');
    if (addComment.css('display') === 'none') {
        comment.hide();
        addComment.show();
    }
})

// 检测评论输入文字 来修改提交评论按钮
$('#information').on('input', '.comment-input', function () {
    var val = $(this).val();
    var submit = $(this).parent().parent().find('.submit-comment')
    if (val) {
        submit.removeClass('disabled')
    } else {
        submit.addClass('disabled')
    }
})



// 监控添加项目那一堆输入框
function verification () {
    var xfto = $('#xfto').val();

    var xffrom = $('#xffrom').val();

    var content = $('#content').val();
    if (xffrom && content) {
        $('#submit').removeClass('disabled')
    } else {
        $('#submit').addClass('disabled')
    }
}
$('#xffrom').on('input', function () {
    verification()
})

$('#content').on('input', function () {
    verification()
})





function get (name, value, time) {
    if (!name) {
        toasts('正在从星云链加载数据中请稍等...')
    }
    var from = Account.NewAccount().getAddressString();
    var values = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "get";
    var arg = '';
    var callArgs = JSON.stringify([arg]);
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, values, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;
        console.log("return of rpc call: " + JSON.stringify([result]))
        var res = JSON.stringify([result]);
        console.log(res.result);
        if (res.result == '' && res.execute_err == 'contract check failed') {
            toasts('合约检测失败，请检查浏览器钱包插件环境！');
            return;
        }
        //var data =JSON.parse(res);
        var data = JSON.parse(JSON.parse(JSON.parse(res)));
        console.log(data, 'data');
        if (name) {
            if (name === 'id') {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == value) {
                        renderHtml(data);
                        clearInterval(timer);
                        toasts('电报添加成功!');
                        $('#release').find('div').html('发布我的电报信息');
                        $('#release').data('type', 1);
                        $('#from').hide();
                        $('#information').show();
                    }
                }
            }


        } else {
            renderHtml(data);

        }

    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
        toasts('合约检测失败，请检查浏览器钱包插件环境！');
    })


}


function getshoujian (name, value) {
    if (!name) {
        toasts('正在从星云链加载数据中请稍等...')
    }
    var from = Account.NewAccount().getAddressString();
    var values = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getshoujian";
    var arg = author;
    var callArgs = JSON.stringify([arg]);
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, values, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;
        console.log("return of rpc call: " + JSON.stringify([result]))
        var res = JSON.stringify([result]);
        console.log(res.result);
        if (res.result == '' && res.execute_err == 'contract check failed') {
            toasts('电报检测失败，可能还没有小哥哥小姐姐给你发电报！');
            return;
        }
        //var data =JSON.parse(res);
        var data = JSON.parse(JSON.parse(JSON.parse(res)));
        console.log(data, 'data');
        if (name) {
            if (name === 'id') {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == value) {
                        renderHtml(data);
                        clearInterval(timer);
                        toasts('电报添加成功!');
                        $('#release').find('div').html('发布我的电报信息');
                        $('#release').data('type', 1);
                        $('#from').hide();
                        $('#information').show();
                    }
                }
            }


        } else {
            renderHtml(data,'shoujian');

        }

    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
        toasts('合约检测失败，请检查浏览器钱包插件环境！');
    })


}


function getyifa (name, value) {
    if (!name) {
        toasts('正在从星云链加载数据中请稍等...')
    }
    var from = Account.NewAccount().getAddressString();
    var values = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getyifa";
    var arg = author;
    var callArgs = JSON.stringify([arg]);
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, values, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;
        console.log("return of rpc call: " + JSON.stringify([result]))
        var res = JSON.stringify([result]);
        console.log(res.result);
        if (res.result == '' && res.execute_err == 'contract check failed') {
            toasts('合约检测失败，请检查浏览器钱包插件环境！');
            return;
        }
        //var data =JSON.parse(res);
        var data = JSON.parse(JSON.parse(JSON.parse(res)));
        console.log(data, 'data');
        if (name) {
            if (name === 'id') {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == value) {
                        renderHtml(data);
                        clearInterval(timer);
                        toasts('电报添加成功!');
                        $('#release').find('div').html('发布我的电报信息');
                        $('#release').data('type', 1);
                        $('#from').hide();
                        $('#information').hide();
                        $('#yifainfo').show();
                    }
                }
            }


        } else {
            renderHtml(data,'yifa');

        }

    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
        toasts('合约检测失败，请检查浏览器钱包插件环境！');
    })


}

// 提交新项目
$('#submit').on('click', function () {
    var xffrom = $('#xffrom').val();
    var content = $('#content').val();
    var to  = $('#xfto').val();
    var id = Date.now() +'_'+ ~~(Math.random() * 1e6);

    if (to ==='') {
        toasts('未选择电报收件人,此电报将发送至公共区域');
    }
    if (xffrom == '0') {
        toasts('未选择钱包登录');
        return;
    } else if (content == '') {
        toasts('未填写电报内容');
        return;
    }
    if(!author){
        author = '手机用户';
    }
    if (xffrom  && content) {
        toasts('正在提交中请稍等...');
        nebPay.call(dappAddress, "0", "set", JSON.stringify([{
            id: id,
            to: to,
            author:author,
            xffrom: xffrom,
            content: xmorse.encode(content),
            xmorse:content,
            time: Date.now()
        }]), {
            listener: function(res){
                if (res.txhash) {
                    toasts('系统正在尝试拉去信息中......请稍等 并不要操作页面');
                    if(to){
                        timer = setInterval(function () {
                            getyifa('id',id)
                        }, 6000)
                    }else{
                        timer = setInterval(function () {
                            get('id', id)
                        }, 6000)
                    }

                } else {
                    toasts('信息添加失败,请稍后再试');

                }
            }
        })
    } else {
        toasts('请填写完整信息');
    }
});
//捐赠
function makeNasDonation() {


    var donationHash = 'donate';

    var NebPay = require("nebpay");
    var nebPay = new NebPay();
    var txHash;

    var to = dappAddress;
    var value = "0.01";
    var callFunction = "donate";
    var callArgs = "[\"" + donationHash + "\"]";

    serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
        listener: function(res){
            if (res.txhash) {
                toasts('捐赠成功');
            }else{
                toasts('捐赠失败');
            }
        }

    });



}



// 格式化时间搓的
function getTime (data) {
    var myDate = new Date(+data);
    var year = myDate.getFullYear();
    var months = myDate.getMonth() + 1;
    var month = months.toString().length === 2 ? months : '0' + months;
    var date = myDate.getDate().toString().length === 2 ? myDate.getDate() : '0' + myDate.getDate();
    var hours = myDate.getHours().toString().length === 2 ? myDate.getHours() : '0' + myDate.getHours();
    var minutes = myDate.getMinutes().toString().length === 2 ? myDate.getMinutes() : '0' + myDate.getMinutes();
    var seconds = myDate.getSeconds().toString().length === 2 ? myDate.getSeconds() : '0' + myDate.getSeconds();
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
}

// 添加评论
$('body').on('click', '.submit-comments', function () {
    var id = $(this).data('id');
    var text = $(this).parent().find('.comment-input').val();
    console.log(text);
    var time = Date.now();
    if (text) {
        toasts('正在提交中请稍等...');
        nebPay.call(dappAddress, "0", "addComment", JSON.stringify([id, text, time]), {
            listener: function(res){
                if (res.txhash) {
                    toasts('系统正在尝试拉去信息中......请稍等 并不要操作页面');
                    timer = setInterval(function () {
                        get('time', id, time)
                    }, 5000)
                } else {
                    toasts('信息添加失败,请稍后再试');

                }
            }
        })
    } else {
        toasts('请填写评论内容...')
    }
})
function isEven(value) {
    if (value%2 == 0)
        return true;
    else
        return false;
}

function renderHtml (data,to) {
    var html = '';
    if(to == 'yifa'){
        html += '   <div id="white"><div class="container"><h3>已发电报箱</h3></div></div>'
    }else if(to == 'shoujian'){
        html += '   <div id="white"><div class="container"><h3>电报收件箱</h3></div></div>'
    }else{
        html += '   <div id="white"><div class="container"><h3>无人认领电报</h3></div></div>'
    }
    for (var i = 0; i < data.length; i++) {

        if(isEven(i)){
            html += '   <div id="white">\n' +
                '            <div class="container">\n' +
                '                <div class="col-lg-8 col-lg-offset-2">\n' +
                '                  <p><img src="assets/img/user.png" width="50px" height="50px"> <ba>发送自'+ data[i].author +'</ba></p>\n' +
                '<p>'+ data[i].content +'</p>\n' +
                '<p>'+ data[i].xmorse +'</p>\n' +
                '</div></div></div></div>'

        }else{
            html += '   <div id="grey">\n' +
                '            <div class="container">\n' +
                '                <div class="col-lg-8 col-lg-offset-2">\n' +
                '                  <p><img src="assets/img/user.png" width="50px" height="50px"> <ba>发送自'+ data[i].author +'</ba></p>\n' +
                '<p>'+ data[i].content +'</p>\n' +
                '<p>'+ data[i].xmorse +'</p>\n' +
                '</div></div></div></div>'

        }


    }
    if(to == 'yifa'){
        $('#yifainfo').html(html);
    }else if(to == 'shoujian'){
        $('#shoujianinfo').html(html);
    }else{
        $('#information').html(html);
    }

}