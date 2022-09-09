var keyNum = 110;
var scoreCount = 0;
var boxCount = 0;
var tempStore = new Map;
var index = 0;

$(function (){
    alert("声明：\n " +
        "本页面仅做为模拟概率使用，无任何盈利和消费，抽中的道具也不会发往仓库。如有侵权联系即删～\n" +
        "联系邮箱：cferxbs@qq.com\n" +
        "更新：\n" +
        "周末更新其它活动模拟抽奖 例如：竞技荣光、王者夺宝、王者轮回等");
    $(".key-num").text(keyNum);
    $(".score-count").text(scoreCount);
})
const probability = [
    [1,10,'传说暗裔 无序列号版'],
    [11,30, '鹰'],
    [31,60, '王者星神'],
    [61,95, '觉醒版超新星-悦享'],
    [96,130, 'Scar Light-白虎'],
    [131,190, '炫金火麒麟'],
    [191,270, 'M4A1-黑骑士'],
    [271,370, 'A背包套装-手雷包'],
    [371,470, '超能力少女兑换券'],
    [471,600, '王者星神原始光效'],
    [601,1820, '暗裔宝箱'],
    [1821,5820, '暗裔币X5'],
    [5821,8820, '暗裔币X10'],
    [8821,9820, '暗裔币X20'],
    [9821,9980, '暗裔币X50'],
    [9981,10000, '暗裔币X100'],
];
var destroyMap = new Map();
destroyMap.set('传说暗裔 无序列号版',48);
destroyMap.set('鹰',24);
destroyMap.set('王者星神',14);
destroyMap.set('觉醒版超新星-悦享',12);
destroyMap.set('Scar Light-白虎',12);
destroyMap.set('炫金火麒麟',7);
destroyMap.set('M4A1-黑骑士',5);
destroyMap.set('A背包套装-手雷包',4);
destroyMap.set('超能力少女兑换券',4);
destroyMap.set('王者星神原始光效',1);

var scoreMap = new Map();
scoreMap.set('暗裔币X5',5);
scoreMap.set('暗裔币X10',10);
scoreMap.set('暗裔币X20',20);
scoreMap.set('暗裔币X50',50);
scoreMap.set('暗裔币X100',100);

function addKey(num) {
    openLoad();
    setTimeout(function (){
        keyNum = $(".key-num").text();
        keyNum = Number(keyNum) + Number(num);
        $(".key-num").text(keyNum);
        let content = "<p style='text-align: center;margin-top: 20px'>恭喜你获得 "+num+" 把钥匙</p>";
        closeLoad();
        openDialog("系统消息",content);
    },200);
}

function draw(num) {
    if(keyNum < num) return alert("钥匙不足");
    openLoad();
    let delayTime = 100;
    if(keyNum > 1) delayTime = 300
    setTimeout(function (){
        let prizeList = '';
        for(i=0;i<num;i++){
            var prod = Math.ceil(Math.random()*10000);

            var prize = '';
            for (j = 0; j < probability.length; j++) {
                var a = probability[j][0];
                var b = probability[j][1];
                if (prod >= a && prod <= b) {
                    prize = probability[j][2];
                    if(destroyMap.has(prize)){
                        var tempProp = {
                            name: prize,
                            status: 0,
                            keyNum: destroyMap.get(prize)
                        };
                        tempStore.set(index++,tempProp);
                    }else if(scoreMap.has(prize)){
                        scoreCount += scoreMap.get(prize);
                    }else{
                        boxCount++;
                    }
                }
            }
            prizeList += "<li class='prize-item'>"+prize+"</li>";
        }
        keyNum = Number(keyNum) - Number(num);
        $(".key-num").text(keyNum);
        $(".score-count").text(scoreCount);
        closeLoad();
        if(num === 1){
            openPrize1Dialog(prizeList)
        }else{
            openPrize10Dialog(prizeList)
        }
    }, delayTime);
}

function viewTempStore() {
    setTimeout(function (){
        var content = getTempStoreHtml();
        openTempSave('暂存箱',content);
    },500);
}

function getTempStoreHtml() {
    var content = "<ul class='temp-prop-list'>";
    for(let key of tempStore.keys()){
        let tempProp = tempStore.get(key);
        var itemProp = '';
        if(tempProp.status === 0){
            itemProp = '<li><span class="temp-prop-name">'+tempProp.name+'</span><a href="javascript:void (0);" class="resolve"  onclick="decompose('+key+')">分解</a><span class="resolve-key-num">'+tempProp.keyNum+'</span></li>';
        }else{
            itemProp = '<li><span class="temp-prop-name">'+tempProp.name+'</span><span class="resolve">已分解</span><span class="resolve-key-num">'+tempProp.keyNum+'</span></li>';
        }
        content += itemProp;
    }
    content += "</ul>";
    return content;
}



function openShade(){
    $("#shade").show();
    $("body").css("overflow","hidden");
}
function closeShade(){
    $("#shade").hide();
    $("body").css("overflow","auto");
}

function openTempSave(title,content) {
    if(title) $("#temp-save-hint").text(title);
    $("#temp-save-content").html(content);
    $("#temp-save-dialog").show();
    openShade()
}

function closeTempSave() {
    $("#temp-save-dialog").hide();
    closeShade()
}

function decompose(index) {
    let tempProp = tempStore.get(index);
    if(tempProp.status === 1) return alert("不能重复分解");
    let num = destroyMap.get(tempProp.name);
    keyNum += num;
    $(".key-num").text(keyNum);
    tempProp.status = 1;
    var content = getTempStoreHtml();
    $("#temp-save-content").html(content);
}

function openPrize10Dialog(prize10List) {
    $("#prize10-list").html(prize10List);
    $("#prize10-dialog").show();
    openShade();
}

function closePrize10Dialog() {
    $("#prize10-dialog").hide();
    closeShade();
}

function openPrize1Dialog(prize) {
    $("#prize1-list").html(prize);
    $("#prize1-dialog").show();
    openShade()
}

function closePrize1Dialog() {
    $("#prize1-dialog").hide();
    closeShade()
}

function closeDialog() {
    $("#dialog").hide();
    closeShade()
}

function openDialog(title,content) {
    if(title) $("#dialog-title").text(title);
    $("#dialog-content").html(content);
    $("#dialog").show();
    openShade()
}

function openLoad(){
    openShade();
    $("#loading").show();
}
function closeLoad() {
    $("#loading").hide();
    closeShade();
}

