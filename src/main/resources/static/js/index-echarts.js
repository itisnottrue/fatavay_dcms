/**
 * 本页面代码为index.html页面中关于echarts部分的代码
 *
 * 注意：1. 不要引入echarts.js，会报错
 *      2. 新写入的方法需要在最后的afterLoad()方法中调用
 *
 */

/** 人员密度横向对比直方图 BEGIN */
let myChart = echarts.init(document.getElementById("num_dif"), 'dark');
let option;
function setHistogram() {
	// 指定图表的配置项和数据
	option = {
		title: {
			text: '人员密度横向对比直方图',
			textStyle: {
				// color: 'white'   // 标题颜色
			}
		},
		backgroundColor: '#242424',
		tooltip: {
			show: true,
			// 自定义提示框文本内容
			formatter: function (params) {
				let inHtml = '';
				if (params.seriesName === '现在')
					inHtml = params.name + ' (现在)'  + '<br><br>';
				else
					inHtml = params.name + ' (5分钟后)' + '<br><br>';
				inHtml +=
					'<span style="display: inline-block; margin-right: 5px; '
					+ 'border-radius: 50%; width: 10px; height: 10px; left: 5px; '
					+ 'background-color: ' + params.color + '"></span>'
					+ '人群密度' + "：" + params.value + ' 人/m<sup>2</sup><br>';
				return inHtml;
			}
		},
		animation: true,   // 动画
		legend: {
			data: ['现在', '5分钟后'],
			x: 220,
			y: 30
		},
		xAxis: {
			data: ['区域1', '区域2', '区域3', '区域4', '区域5', '区域6'],
			axisLabel: {
				color: 'white'
			}
		},
		yAxis: {
			axisLabel: {
				color: 'white'
			}
		},
		series: [
			{
				name: '现在',
				type: 'bar',
				data: [],   //[2.6, 3.1, 3.6, 1.8, 4.3, 2.5],
				barWidth: 20,
				barGap: 0
				// barCategoryGap: 0
			},
			{
				name: '5分钟后',
				type: 'bar',
				data: [],   //[3.6, 1.1, 4.6, 2.8, 2.3, 3.5],
				barWidth: 20,
				barGap: 0
				// barCategoryGap: 0
			}
		]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}

// ajax获取直方图数据
function getHistogramData() {
	$.ajax({
		type: "post",
		url: "histogram",
		data: "json",
		success: function (res) {
			if (res.code === 1) {   // 成功获取到直方图数据
				let hisData= [];
				let hisDataFu = [];
				for (let i = 0; i < res.length; ++i)
				{
					hisData[i] = parseFloat(res.histogramData[i]).toFixed(2);
					hisDataFu[i] = parseFloat(res.histogramDataFu[i]).toFixed(2);
				}
				myChart.setOption({
					title: {   // 渲染标题时间
						text: '人员密度横向对比直方图(' + res.histogramTime + ')'
					},
					xAxis: {   // 渲染区域名称
						data: res.histogramName
					},
					series: [   // 渲染数据
						{
							data: hisData
						},
						{
							data: hisDataFu
						}
					]
				});
			}
			else   // 未获取到直方图数据
				alert(res.message);
		}
	});
}
/** 人员密度横向对比直方图 END */

/** 人员密度折线图 BEGIN */
let num_history = echarts.init(document.getElementById('num_history'), 'dark');
let option_his;
function setLineChart() {
	option_his = {
		title: {
			text: '人员密度折线图',
			textStyle: {
				// color: 'white'
			}
		},
		backgroundColor: '#242424',
		tooltip: {
			trigger: 'axis',
			// 自定义提示框文本内容
			formatter: function (params) {
				let inHtml = '';
				let len;   // 获取inHtml长度，用于判断是否是现在
				// console.log(params);
				inHtml = params[0].name + '<br><br>';
				if (inHtml.substring(0, 1) === '前')
					inHtml = inHtml.substring(0, 3) + '分钟<br><br>';
				else if (inHtml.substring(0, 1) === '后')
					inHtml = '未来' + inHtml.substring(1, 3) + '分钟<br><br>';
				len = inHtml.length;    // 获取此刻inHtml长度
				for (let i = 0; i < params.length; ++i)
					// 如果是现在，并且不是预测；不是现在，并且有值。满足其一，加入提示框
					if ((len === 10 && params[i].seriesName.substring(0, 2) !== '预测')
						|| (len !== 10 && params[i].value !== '-'))
						inHtml +=
							'<span style="display: inline-block; margin-right: 5px; '
							+ 'border-radius: 50%; width: 10px; height: 10px; left: 5px; '
							+ 'background-color: ' + params[i].color + '"></span>'
							+ params[i].seriesName + "：" + params[i].value + ' 人/m<sup>2</sup><br>';
				return inHtml;
			}
		},
		legend: {
			data: ['区域1', '区域2', '区域3', '区域4'],
			x: 200
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {},
		xAxis: {
			type: 'category',
			// data: ['前60分钟', '前50分钟', '前40分钟', '前30分钟', '前20分钟', '前10分钟', '现在'],
			data: ['前30\'', '前20\'', '前10\'', '现在', '后10\'', '后20\'', '后30\''],
			axisLabel: {
				color: 'white'
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: 'white'
			}
		},
		animation: true,   // 动画
		series: [
			{
				name: '区域1',
				// stack: 'total',
				type: 'line',
				connectNulls: true,
				data: [0, 0, 0, 0, '-', '-', '-']
				// data: [1.2, 2.3, 2.2, 2.18, 1.35, 1.47, 2.6]
			},
			{
				name: '预测区域1',
				// stack: 'total',
				type: 'line',
				lineStyle: {
					type: 'dashed',
					color: '#4993ff'
				},
				itemStyle: {
					color: '#4993ff'
				},
				connectNulls: true,
				data: ['-', '-', '-', 0, 0, 0, 0]
			},
			{
				name: '区域2',
				// stack: 'total',
				type: 'line',
				connectNulls: true,
				data: [0, 0, 0, 0, '-', '-', '-']
				// data: [2.2, 1.82, 1.91, 2.34, 2.90, 3.30, 3.10]
			},
			{
				name: '预测区域2',
				// stack: 'total',
				type: 'line',
				lineStyle: {
					type: 'dashed',
					color: '#7effb3'
				},
				itemStyle: {
					color: '#7effb3'
				},
				connectNulls: true,
				data: ['-', '-', '-', 0, 0, 0, 0]
			},
			{
				name: '区域3',
				// stack: 'total',
				type: 'line',
				data: [0, 0, 0, 0, '-', '-', '-']
				// data: [1.50, 2.32, 2.01, 1.54, 1.90, 3.30, 4.10]
			},
			{
				name: '预测区域3',
				// stack: 'total',
				type: 'line',
				lineStyle: {
					type: 'dashed',
					color: '#fedd61'
				},
				itemStyle: {
					color: '#fedd61'
				},
				data: ['-', '-', '-', 0, 0, 0, 0]
			},
			{
				name: '区域4',
				// stack: 'total',
				type: 'line',
				data: [0, 0, 0, 0, '-', '-', '-']
				// data: [3.20, 3.32, 3.01, 3.34, 3.90, 3.30, 3.20]
			},
			{
				name: '预测区域4',
				// stack: 'total',
				type: 'line',
				lineStyle: {
					type: 'dashed',
					color: '#ff6e75'
				},
				itemStyle: {
					color: '#ff6e75'
				},
				data: ['-', '-', '-', 0, 0, 0, 0]
			}
		]
	};

	option_his && num_history.setOption(option_his);
}

// ajax获取折线图数据
function getLineData() {
	$.ajax({
		type: "post",
		url: "line",
		data: "json",
		success: function (res) {
			if (res.code === 1) {   // 成功获取到折线图数据
				let lineChartData = [];
				let xData = [];
				let count = 0;
				for (let i = 0; i < res.length*2; ++i)
				{
					lineChartData[i] = [];
					for (let j = 0; j < 7; ++j)
						lineChartData[i][j] = parseFloat(res.lineData[count][j]).toFixed(2);
					if (i % 2 === 0)   // 偶数，之前
					{
						for (let k = 4; k < 7; ++k)
							lineChartData[i][k] = '-';
					}
					else   // 奇数，之后
					{
						for (let k = 0; k < 3; ++k)
							lineChartData[i][k] = '-';
						++count;
					}
					if (i < 4)   // 横轴坐标data
					{
						if (i !== 3)
						{
							xData[i] = '前' + res.lineInterval * (3 - i) + '\'';
							xData[7 - i - 1] = '后' + res.lineInterval * (3 - i) + '\'';
						}
						else
							xData[i] = '现在';
					}
				}
				num_history.setOption({
					title: {   // 渲染标题：间隔
						text: '人员密度折线图(' + res.lineInterval + 'min)'
					},
					xAxis: {   // 渲染横轴名称
						data: xData,
					},
					legend: {   // 渲染区域名称
						data: res.lineName
					},
					series: [   // 渲染name及数据
						{
							name: res.lineName[0],
							data: lineChartData[0]
						},
						{
							name: '预测' + res.lineName[0],
							data: lineChartData[1]
						},
						{
							name: res.lineName[1],
							data: lineChartData[2]
						},
						{
							name: '预测' + res.lineName[1],
							data: lineChartData[3]
						},
						{
							name: res.lineName[2],
							data: lineChartData[4]
						},
						{
							name: '预测' + res.lineName[2],
							data: lineChartData[5]
						},
						{
							name: res.lineName[3],
							data: lineChartData[6]
						},
						{
							name: '预测' + res.lineName[3],
							data: lineChartData[7]
						}
					]
				});
			}
			else   // 未获取到折线图数据
				alert(res.message);
		}
	});
}
/** 人员密度折线图 END */

/** 当前、未来探测区域人员密度热力图 BEGIN */
let myTh_now = echarts.init(document.getElementById('th_chart_now'));
let option_th_now;
let myTh_future = echarts.init(document.getElementById('th_chart_future'));
let option_th_future;
let data_now = null;
let data_future = null;
let data_now1 = [];
let data_now2 = [];
let data_future1 = [];
let data_future2 = [];
let level_3 = { borderColor: '#949494', borderWidth: 3 };
let level_4 = { borderColor: '#cbcbcb', borderWidth: 4 };
let level_5 = { borderColor: '#fff', borderWidth: 5 };
let testData=[
	{name:"区域1",value:2},
	{name:"区域2",value:15.2},
	{name:"区域3",value:11.68},
	{name:"区域4",value:0},
	{name:"区域5",value:3.5},
	{name:"区域6",value:4.6},
	{name:"区域7",value:6.6},
	{name:"区域8",value:7.12},
	{name:"区域9",value:5.9},
	{name:"区域10",value:0},
	{name:"区域11",value:15.4},
	{name:"区域12",value:2},
	{name:"区域13",value:10},
	{name:"区域14",value:11.9},
	{name:"区域15",value:7.23},
	{name:"区域16",value:4.56},
	{name:"区域17",value:10.32},
	{name:"区域18",value:11.3},
]
function setHeatmap() {
	option_th_now = {
		title: {
			text: '实时人员密度热力图',
			textStyle: {
				color: 'red'
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: function (params) {
				let inHtml = params.name + '<br><br>';
				inHtml +=
					'<span style="display: inline-block; margin-right: 5px; '
					+ 'border-radius: 50%; width: 10px; height: 10px; left: 5px; '
					+ 'background-color: ' + params.color + '"></span>'
					+ '人员密度' + "：" + params.value + ' 人/m<sup>2</sup><br>';
				return inHtml;
			},
		  backgroundColor: "#fff",//提示标签背景颜色
		  textStyle: { color: "#000",fontSize:20 } ,//提示标签字体颜色
		},
		visualMap: {
			show: true,   // 是否显示小组件
			min: 0,
			max: 2,
			left: 'left',
			bottom: 0,
			text: ['危险', '安全'],
			realtime: true,
			calculable: true,
			orient: 'horizontal',//水平还是竖直SS
			right: 0,   // 小组件摆放位置
			inRange: {
				color: [
					'#ffffff',
					'#e0f3f8',
					'#ffffbf',
					'#fee090',
					'#fdae61',
					'#f46d43',
					'#d73027',
					'#a50026'
				]
			}
		},
		//animation: false,   // 关闭动画
		series: [
			{
				name: '实时人员密度热力图',
				type: 'map',
				map: 'DemoMap',
				//zoom: 1.15,
				label: {
          normal: {//正常显示
						show: false,//显示省份标签
						textStyle: {
							fontSize: 20,
							color: '#6c6a6a'
						}
					},
					emphasis: {//悬浮时显示
              show: true,//对应的鼠标悬浮效果
          }
					
				},
				// data: data_now,
				// 测试数据
				data:testData,
				// nameMap: {   // 自定义名称映射
				// 	'成都市': '区域1',
				
				// }
			}
		]

	};

	option_th_future = {
		title: {
			text: '5分钟后预测人员密度热力图',
			textStyle: {
				color: 'red'
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: function (params) {
				// console.log(params);
				let inHtml = params.name + ' (5分钟后预计人员密度)<br><br>';
				inHtml +=
					'<span style="display: inline-block; margin-right: 5px; '
					+ 'border-radius: 50%; width: 10px; height: 10px; left: 5px; '
					+ 'background-color: ' + params.color + '"></span>'
					+ '人员密度' + "：" + params.value + ' 人/m<sup>2</sup><br>';
				return inHtml;
			},
	  backgroundColor: "#fff",//提示标签背景颜色
		  textStyle: { color: "#000",fontSize:20 } ,//提示标签字体颜色
		},
		visualMap: {
			show: true,   // 是否显示小组件
			min: 0,
			max: 2,
			left: 'left',
			bottom: '0px',
			text: ['危险', '安全'],
			realtime: true,
			calculable: true,
			orient: 'horizontal',//水平还是竖直SS
			inRange: {
				color: [
					'#ffffff',
					'#e0f3f8',
					'#ffffbf',
					'#fee090',
					'#fdae61',
					'#f46d43',
					'#d73027',
					'#a50026'
				]
			}
		},
		// animation: false,   // 关闭动画
		series: [
			{
				name: '5分钟后预测人员密度热力图',
				type: 'map',
				map: 'DemoMap',
				label: {
         normal: {//正常显示
						show: false,//显示省份标签
						textStyle: {
							fontSize: 20,
						}
					},
				},
				data: data_future,
			}
		]
	};

	$.get('/fatavay/map/hcz.json', function(geoJson) {   // 项目启动使用地址，前端调试时请注释
		// $.get('../static/map/SC.json', function(geoJson) {   // 方便前端调试地址，项目启动时请注释
		echarts.registerMap('DemoMap', geoJson);
		myTh_now.setOption(option_th_now);
		myTh_future.setOption(option_th_future);
	});


	// 闪烁
	setInterval(function() {
		data_now = data_now === data_now1 ? data_now2 : data_now1;
		data_future = data_future === data_future1 ? data_future2 : data_future1;
		myTh_now.setOption({
			series: {
				data: data_now
				//data:testData
			}
		});
		myTh_future.setOption({
			series: {
				data: data_future
				//data:testData
			}
		});
	}, 300);
}

// ajax获取热力图数据
function getHeatmapData() {
	$.ajax({
		type: "post",
		url: "heatmapData",
		data: "json",
		success: function (res) {
			if (res.code === 1) {   // 成功获取到热力图数据
				for (let i = 0; i < res.length; ++i) {
					data_now1.push({name: res.heatmapName[i], value: res.heatmapData[i].toFixed(2)});
					data_future1.push({name: res.heatmapName[i], value: res.heatmapDataFu[i].toFixed(2)});

					if (res.heatmapData[i] >= 1.5 && res.heatmapData[i] < 2)
						data_now2.push({name: res.heatmapName[i],
							value: res.heatmapData[i].toFixed(2), itemStyle: level_3});
					else if (res.heatmapData[i] >= 2 && res.heatmapData[i] < 2.5)
						data_now2.push({name: res.heatmapName[i],
							value: res.heatmapData[i].toFixed(2), itemStyle: level_4});
					else if (res.heatmapData[i] >= 2.5)
						data_now2.push({name: res.heatmapName[i],
							value: res.heatmapData[i].toFixed(2), itemStyle: level_5});
					else
						data_now2.push({name: res.heatmapName[i],
							value: res.heatmapData[i].toFixed(2)});

					if (res.heatmapDataFu[i] >= 1.5 && res.heatmapDataFu[i] < 2)
						data_future2.push({name: res.heatmapName[i],
							value: res.heatmapDataFu[i].toFixed(2), itemStyle: level_3});
					else if (res.heatmapDataFu[i] >= 2 && res.heatmapDataFu[i] < 2.5)
						data_future2.push({name: res.heatmapName[i],
							value: res.heatmapDataFu[i].toFixed(2), itemStyle: level_4});
					else if (res.heatmapDataFu[i] >= 2.5)
						data_future2.push({name: res.heatmapName[i],
							value: res.heatmapDataFu[i].toFixed(2), itemStyle: level_5});
					else
						data_future2.push({name: res.heatmapName[i],
							value: res.heatmapDataFu[i].toFixed(2)});
				}
				data_now = data_now1;
				data_future = data_future1;
				//console.log(testData)
				myTh_now.setOption({
					series: [
						{
							data: data_now
							//data:testData
						}
					]
				});
				myTh_future.setOption({
					series: [
						{
							data: data_future
							//data:testData
						}
					]
				});
			}
			else   // 获取热力图数据失败
				alert(res.message);
		}
	});
}
/** 当前、未来探测区域人员密度热力图 END */

// 告警模块
let tipsNowLength = 0;      // 用于当前告警tips全部忽略按钮
let tipsFutureLength = 0;   // 用于预测告警tips全部忽略按钮
function warnTips() {
	$.ajax({
		type: "post",
		url: "tips",
		data: "json",
		success: function(res) {
			if (res.code === 1) {
				tipsNowLength = res.length[0];
				tipsFutureLength = res.length[1];
				// 将告警条数存储到session
				sessionStorage.setItem('tipsLength-now', tipsNowLength);
				sessionStorage.setItem('tipsLength-future', tipsFutureLength);
				for (let i = 1; i <= res.length[0]; ++i)
				{
					$("#tips-now").append("<div class=\"tips-div\">\n" +
						"            <input id='btn-now-data-" + i + "' style='display: none' value='" + res.tipsDataNow[i-1] + "'>" +
						"            <input id='btn-now-name-" + i + "' style='display: none' value='" + res.tipsNameNow[i-1] + "'>" +
						"            <input id='btn-now-level-" + i + "' style='display: none' value='" + res.tipsLevelNow[i-1] + "'>" +
						"            <input id='btn-now-advice-" + i + "' style='display: none' value='" + res.tipsAdviceNow[i-1] + "'>" +
						"            <div style=\"display: inline-block; width: 60%\">\n" +
						"                <span id='btn-now-" + i + "-span' class=\"tips-span\">" + res.tipsNameNow[i-1] + "已达到" + res.tipsLevelNow[i-1] + "级预警</span>\n" +
						"            </div>\n" +
						"            <div class=\"tips-btn\">\n" +
						"                <button id='btn-now-" + i + "-1' type=\"button\" class=\"execute_btn\" style=\"width: 40%\" onclick='execBtn(this); show(this); setPlanList(this); setSelectedOption();' value='now'>执行</button>\n" +
						"                <button id='btn-now-" + i + "-2' type=\"button\" class=\"execute_btn\" style=\"width: 40%\" onclick='ignoreBtn(this);'>忽略</button>\n" +
						"            </div>\n" +
						"        </div>");
				}
				for (let i = 1; i <= res.length[1]; ++i)
				{
					$("#tips-future").append("<div class=\"tips-div\">\n" +
						"            <input id='btn-future-data-" + i + "' style='display: none' value='" + res.tipsDataFu[i-1] + "'>" +
						"            <input id='btn-future-name-" + i + "' style='display: none' value='" + res.tipsNameFu[i-1] + "'>" +
						"            <input id='btn-future-level-" + i + "' style='display: none' value='" + res.tipsLevelFu[i-1] + "'>" +
						"            <input id='btn-future-advice-" + i + "' style='display: none' value='" + res.tipsAdviceFu[i-1] + "'>" +
						"            <div style=\"display: inline-block; width: 60%\">\n" +
						"                <span id='btn-future-" + i + "-span' class=\"tips-span\">" + res.tipsInterval + "分钟后，" + res.tipsNameFu[i-1] + "将达到" + res.tipsLevelFu[i-1] + "级预警</span>\n" +
						"            </div>\n" +
						"            <div class=\"tips-btn\">\n" +
						"                <button id='btn-future-" + i + "-1' type=\"button\" class=\"execute_btn\" style=\"width: 40%\" onclick='execBtn(this); show(this); setPlanList(this); setSelectedOption();' value='future'>执行</button>\n" +
						"                <button id='btn-future-" + i + "-2' type=\"button\" class=\"execute_btn\" style=\"width: 40%\" onclick='ignoreBtn(this);'>忽略</button>\n" +
						"            </div>\n" +
						"        </div>");
				}
			}
			else
			{
				$("#tips-now").append("<div style='text-align: center; margin-top: 10%;'><span>当前无告警区域</span></div>");
				$("#tips-future").append("<div style='text-align: center; margin-top: 10%;'><span>当前无告警区域</span></div>")
			}
		}
	});
}

// 预案列表
function getPlanList() {
	$.ajax({
		type: "post",
		url: 'plan',
		data: 'json',
		success: function(res) {
			if (res.code === 1) {
				// 存储到本地
				sessionStorage.setItem("planName", res.planName);
				sessionStorage.setItem("planList", res.planList);
				let str = '';
				let planLength = [];
				for (let i = 0; i < res.length; ++i)
				{
					str = "planList" + (i+1);
					sessionStorage.setItem(str, res.planList[i]);
					planLength[i] = res.planList[i].length;
				}
				sessionStorage.setItem('planLength', planLength.toString());
			}
			else
				alert(res.message);
		}
	});
}

// 添加空白对话框，默认不显示
let ListDivFlag = 0;   // 只append一次，0表示没有append空白对话框，1表示append了空白对话框，2表示append了所有列表
function appendListDiv() {
	if (!ListDivFlag)
	{
		for (let i = 0; i < parseInt(sessionStorage.getItem('tipsLength-now')); ++i)
			$('#warn-div-now').append("<div id='list-now-" + (i+1) + "' class='list' style='display: none;'></div>")

		for (let i = 0; i < parseInt(sessionStorage.getItem('tipsLength-future')); ++i)
			$('#warn-div-future').append("<div id='list-future-" + (i+1) + "' class='list' style='display: none;'></div>")

		ListDivFlag = 1;
		appendAllLists('now');
		appendAllLists('future');
	}
}

// 获取实时时间
function getDateTime(str) {
	let now = (new Date()).toLocaleString('zh-cn', {dateStyle: 'medium', timeStyle: 'medium'});
	$(str).text(now);
}

// 添加所有执行列表，默认显示建议预案列表
function appendAllLists(str) {
	if (ListDivFlag !== 2 && ListDivFlag === 1)
	{
		// 告警条数
		let tipsLength = parseInt(sessionStorage.getItem('tipsLength-' + str));
		// 预案名称
		let planName = sessionStorage.getItem('planName').split(',');
		// 所有预案列表
		let planList = sessionStorage.getItem('planList').split(',');
		// 每个预案的列表个数
		let planLength = sessionStorage.getItem('planLength').split(',');
		for (let i = 0; i < tipsLength; ++i)   // 几条告警
		{
			for (let j = 0; j < planLength.length; ++j)   // 几个预案
			{
				let plan = sessionStorage.getItem('planList' + (j+1)).split(',');
				$('#list-' + str + '-' + (i+1)).append("<h3 id='list-" + str + "-div-" + (i+1) + '-' + (j+1) + "-title' style=\"color: #737373; text-align: center; margin-top: 6%; display: none;\">" + planName[j] + "执行列表" + "</h3>");
				for (let k = 0; k < parseInt(planLength[i]); ++k)   // 每个预案有几条
				{
					// id : list-now/future-第几个对话框-第几个预案-第几条预案列表
					$('#list-' + str + '-' + (i+1)).append("<div id=\"list-" + str + "-div-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "\" style='display: none'>\n" +
						"            <div style=\"margin-top: 6%\">\n" +
						"                <h4 id='list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-title' style=\"color: #737373; margin-left: 6%; display: inline-block\">" + plan[k] + "</h4>\n" +
						"                <span id='list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-clock' style=\"display: inline-block; margin-left: 5%\">00:00:00</span>\n" +
						"            </div>\n" +
						"            <div>\n" +
						"                <button id='list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-1' onclick='suspendTime(this); startClock(this); disableSelect(this);' value='" + str + "' type=\"button\" class=\"execute_btn\" style=\"margin-left: 5%; margin-top: 3%\">执行</button>\n" +
						"                <span id='list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-1-span' class=\"time\">" + now() + "</span>\n" +
						"                <button id='list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-2' onclick='suspendTime(this); stopClock(this); disableSelect(this);' value='" + str + "' type=\"button\" class=\"execute_btn\">完成</button>\n" +
						"                <span id='list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-2-span' class=\"time\">" + now() + "</span>\n" +
						"            </div>\n" +
						"        </div>");
				}

				for (let k = 0; k < parseInt(planLength[i]); ++k)
				{
					let num1 = setInterval("getDateTime('#list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-1-span')", 1000);
					let num2 = setInterval("getDateTime('#list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-2-span')", 1000);
					sessionStorage.setItem("list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-1-span", num1.toString());
					sessionStorage.setItem("list-" + str + "-" + (i+1) + '-' + (j+1) + '-' + (k+1) + "-2-span", num2.toString());
				}
			}
		}
	}
}

// 添加下拉框，默认不显示
let selectFlag = 0;
function appendSelect() {
	if (!selectFlag)
	{
		let planName = sessionStorage.getItem('planName').split(',');
		for (let i = 0; i < parseInt(sessionStorage.getItem('tipsLength-now')); ++i)
		{
			$('#warning-now').append("<select id='warn-div-now-select-" + (i+1) + "' onchange=\"modifyListBySelectOption(this);\" style=\"width: 14%; height: 5%; border: none; border-radius: 5px; display: none;\">\n" +
				"        </select>")
			for (let j = 0; j < planName.length; ++j)
				$('#warn-div-now-select-' + (i+1)).append("<option value='" + (j+1) + "'>" + planName[j] + "</option>");
		}

		for (let i = 0; i < parseInt(sessionStorage.getItem('tipsLength-future')); ++i)
		{
			$('#warning-future').append("<select id='warn-div-future-select-" + (i+1) + "' onchange=\"modifyListBySelectOption(this);\" style=\"width: 14%; height: 5%; border: none; border-radius: 5px; display: none;\">\n" +
				"        </select>")
			for (let j = 0; j < planName.length; ++j)
				$('#warn-div-future-select-' + (i+1)).append("<option value='" + (j+1) + "'>" + planName[j] + "</option>");
		}

		selectFlag = 1;
	}
}

// 设置在页面加载好后执行的方法
window.onload = function afterLoad() {
	// 只请求一次预案列表，后存储在cookie中
	if (localStorage.getItem('planName') === null)
		getPlanList();
		appendListDiv();
		appendSelect();

		setHistogram();
		setLineChart();
		setHeatmap();

		getHistogramData();
		getLineData();
		getHeatmapData();

		warnTips();
}