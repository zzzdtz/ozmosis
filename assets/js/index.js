var dappAddress = "n1qjtZ1pDet41Q7bHq5DcgzttYxhTfBryJs";
var hash = "527da76f47e542900438830f3924bee471a677f29c456ccb81993e325280c613";
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
    }else{
        $('#information').show();
        $('#from').hide();
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
    var name = $('#xfType').val();

    var content = $('#content').val();
    if (name && content) {
        $('#submit').removeClass('disabled')
    } else {
        $('#submit').addClass('disabled')
    }
}
$('#name').on('input', function () {
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
    var arg = $("#search_value").val();
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
                        toasts('信息添加成功!');
                        $('#release').find('div').html('发布我的留言本信息');
                        $('#release').data('type', 1);
                        $('#from').hide();
                        $('#information').show();
                    }
                }
            }

            if (name === 'time') {
                console.log('time')
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i].id, value, '11111')
                    if (data[i].id == value) {
                        for (var y = 0; y < data[i].comment.length; y++) {
                            console.log(data[i].comment[y].time, time, '222222')
                            if (data[i].comment[y].time == time) {
                                renderHtml(data);
                                clearInterval(timer);
                                toasts('信息添加成功!');

                            }
                        }
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


// 提交新项目
$('#submit').on('click', function () {
    var name = $('#xfType').val();
    var content = $('#content').val();
    var id = Date.now() +'_'+ ~~(Math.random() * 1e6);
    if (name == '0') {
        toasts('未选择是否在留言本显示原文');
        return;
    } else if (content == '') {
        toasts('未填写留言本内容');
        return;
    }
    if(!author){
        author = '手机用户';
    }
    if (name  && content) {
        toasts('正在提交中请稍等...');
        nebPay.call(dappAddress, "0", "set", JSON.stringify([{
            id: id,
            author:author,
            name: name,
            content: xmorse.encode(content),
            xmorse:content,
            time: Date.now()
        }]), {
            listener: function(res){
                if (res.txhash) {
                    toasts('系统正在尝试拉去信息中......请稍等 并不要操作页面');
                    timer = setInterval(function () {
                        get('id', id)
                    }, 5000)
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

function renderHtml (data) {
    var html = '';
    console.log(data)
    for (var i = 0; i < data.length; i++) {

        if(isEven(i)){
            html += '   <div id="white">\n' +
                '            <div class="container">\n' +
                '                <div class="col-lg-8 col-lg-offset-2">\n' +
                '                  <p><img src="assets/img/user.png" width="50px" height="50px"> <ba>'+ data[i].author +'</ba></p>\n' +
                '<p>'+ data[i].content +'</p>\n' +
                '<p>'+ data[i].xmorse +'</p>\n' +
                '<div class="comment"><div class="see-comment" data-num="'+data[i].comment.length+'"><img src="assets/img/comment.png" alt=""><span>'+data[i].comment.length+'条评论</span></div>\n' +
                '<div class="add-comment-btn">添加评论</div></div><div class="comment-arr">';

        }else{
            html += '   <div id="grey">\n' +
                '            <div class="container">\n' +
                '                <div class="col-lg-8 col-lg-offset-2">\n' +
                '                  <p><img src="assets/img/user.png" width="50px" height="50px"> <ba>'+ data[i].author +'</ba></p>\n' +
                '<p>'+ data[i].content +'</p>\n' +
                '<p>'+ data[i].xmorse +'</p>\n' +
                '<div class="comment"><div class="see-comment" data-num="'+data[i].comment.length+'"><img src="assets/img/comment.png" alt=""><span>'+data[i].comment.length+'条评论</span></div>\n' +
                '<div class="add-comment-btn">添加评论</div></div><div class="comment-arr">\n';
        }


        for (var y = 0; y < data[i].comment.length; y++) {
            html += '<div class="comment-item">'
                + '<p>'+ data[i].comment[y].body+ '</p>'
                + '<p>'+ getTime(data[i].comment[y].time) +'</p></div>'
        }

        html += '</div><div class="add-comment"><div class="inputs"><input type="text" class="comment-input" placeholder="请输入评论...">'
            + '</div><div data-id="'+ data[i].id +'" class="submit-comments disabled">评论</div></div></div></div></div>';
    }

    $('#information').html(html);
}