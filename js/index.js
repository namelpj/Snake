/**
 * Created by haoxinglai on 2016/11/24.
 */

function GreedySnake() {
    this.init();
}
GreedySnake.prototype = {
    constructor: GreedySnake,
    init: function () {
        this.renderDom();
        this.bindevents();//绑定事件
    },
    //渲染
    renderDom: function () {
        var canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");
        this.snakelen = 4;//蛇身长度
        this.eatings=0//觅食数量
        this.speed = 300;//速度
        this.stride = 21;//单位宽高
        this.direct = 39;//方向
        this.path = [];//记录轨道
        this.isPause=false;//是否暂停
        this.recordNum();
        this.createfood();
        this.x=0;
        this.y=0;
        this.update();
    },
    bindevents: function () {
        //绑定事件
        var self = this;
        $(window).keydown(function (event) {
            //绑定键盘事件
            self.direct = event.keyCode;
            if(event.keyCode<37||event.keyCode>40)
                self.direct=39;
        })
        $(".nav").on("click","#start", function () {
            //点击重新开始
            self.ctx.clearRect(0,0, 524, 524);
            clearInterval(self.timer);
            self.init();
        }).on("click","#pause",function () {
            //点击暂停和恢复
            var $pause=$("#pause");
            if(self.isPause===false){
                $pause.text("游戏恢复");
                self.isPause=true;
            }
            else{
                self.isPause=false;
                $pause.text("暂停游戏");
                self.update();
            }
        })
    },
    createfood: function () {
        //随机产生食物
        this.foodx = Math.floor(Math.random() * 25) * 21;
        this.foody = Math.floor(Math.random() * 25) * 21;
        for (var i = 0; i < this.path.length; i++) {
            //检测食物是否在蛇身
            if (this.path[i]["x"] == this.foodx && this.path[i]["y"] == this.foody){
                return this.createfood();
            }
        }
        this.ctx.fillStyle = "#ff7f27";
        this.ctx.fillRect(this.foodx,this.foody, 20, 20);
    },
    drawSnake: function (x, y) {
        //画蛇
        this.ctx.fillStyle = "#0ca83a";
        this.ctx.fillRect(x, y, 20, 20);
    },
    update: function () {
        //运动
        var self = this;
            this.timer = setInterval(function () {
                if(self.isPause===true){
                    return clearInterval(self.timer);
                }
                switch (self.direct) {
                    case 37:
                        self.x = self.x - self.stride;
                        break;//左
                    case 38:
                        self.y = self.y - self.stride;
                        break;//上
                    case 39:
                        self.x = self.x + self.stride;
                        break;//右
                    case 40:
                        self.y = self.y + self.stride;
                        break;//下
                }
                if (self.x < 0 || self.x > 504 || self.y < 0 || self.y > 504) {
                    //撞墙检测
                    alert("两眼懵逼，一头撞墙");
                    return clearInterval(self.timer);
                }
                for (var i = 0; i < self.path.length; i++) {
                    //撞自身检测
                    if (self.path[i]["x"] == self.x && self.path[i]["y"] == self.y){
                        alert("淘气，你咬死自己了");
                        return clearInterval(self.timer);
                    }
                }
                if (self.path.length > self.snakelen) {
                    //清除尾巴
                    var del = self.path.shift();
                    self.ctx.clearRect(del["x"], del["y"], 20, 20);
                }
                self.path.push({"x": self.x, "y": self.y})
                self.drawSnake(self.x, self.y);
                self.recordNum();
                self.step++;
                if(self.x==self.foodx && self.y==self.foody){
                    //判断吃食物
                    self.eatings++;
                    self.snakelen++;
                    self.speed=self.speed-10;
                    if(self.speed<100) self.speed=100;
                    clearInterval(self.timer);
                    self.createfood();
                    self.update();
                }
            },self.speed);
        },
    recordNum: function () {
        //记录信息
        var $sankeLength=$("#sankeLength");
        var $foodNum=$("#foodNum");
        var $speed=$("#speed");
        $sankeLength.html(this.snakelen);
        $foodNum.html(this.eatings);
        $speed.html(this.speed/1000);
    },
    }




