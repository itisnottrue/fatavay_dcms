;console.log("enter index_yl.js")
let flage=false
let timer1
let num=0
document.getElementById("btn_yl").onclick=function(){
	flage=!flage
	clearInterval(timer1)
	if(flage){
		console.log("定时器开始")
		timer1=setInterval(function(){
			console.log(num)
			num++
			if(num==5){
				clearInterval(timer1)
				flage=false
				num=0
				console.log("定时器结束")
			}
		},1000)
	}
	else{
		clearInterval(timer1)
		num=0
		console.log("定时器结束")
	}
}