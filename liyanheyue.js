"use strict";
var XmorsesContract = function() {};

XmorsesContract.prototype = {
    init: function() {},

    set: function(obj) {
        var froms = Blockchain.transaction.from;
        var defaultData = JSON.parse(LocalContractStorage.get(froms));
        var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
            data.push({
                author: Blockchain.transaction.from,
                id: obj.id,
                name: obj.name,
                xmorse:obj.content,
                content: obj.content,
                time: obj.time,
                to: obj.to,
            });
        if (data.length > 1) {
            LocalContractStorage.del(froms);
        };
        LocalContractStorage.set(froms, JSON.stringify(data));
        if(obj.to){

            var to = obj.to + 'to';
            var defaultData = JSON.parse(LocalContractStorage.get(to));
            var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
            data.push({
                author: Blockchain.transaction.from,
                id: obj.id,
                name: obj.name,
                xmorse:obj.xmorse,
                content: obj.content,
                time: obj.time,
                to: obj.to,
            });
            if (data.length > 1) {
                LocalContractStorage.del(to);
            };
            LocalContractStorage.set(to, JSON.stringify(data));
            console.log('tos',to);


        }else {

            console.log('all',obj.to);
            var defaultData = JSON.parse(LocalContractStorage.get('all'));
            var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
            data.push({
                author: Blockchain.transaction.from,
                id: obj.id,
                name: obj.name,
                xmorse:obj.xmorse,
                content: obj.content,
                time: obj.time,
                to: obj.to,
            });

            if (data.length > 1) {
                LocalContractStorage.del('all');
            };
            LocalContractStorage.set('all', JSON.stringify(data));


        }

    },
    getshoujian: function(to) {
        console.log('nimei',to);
        var tore = to + 'to';
        return LocalContractStorage.get(tore);
    },
    getyifa: function(from) {
        if(from == ''){
            var from = Blockchain.transaction.from;
        }
        return LocalContractStorage.get(from);

    },

    get: function() {
        return LocalContractStorage.get('all');

    },

    donate: function() {
        var wallet = 'n1c3CDvB57VS7hBkKcbNfPVrPgvR4Bhuhi5';
        var value = Blockchain.transaction.value;
        var result = Blockchain.transfer(wallet, value)
        return result;
    },

};
module.exports = XmorsesContract;