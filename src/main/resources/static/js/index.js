/**
 * 本页面代码为index.html页面中的不包括echarts的功能代码
 */

// 关闭告警模块
function closeDiv() {
    document.getElementById("cam-warn").style.display = 'none';
}

// 点击铃铛显示或关闭div
function openDiv() {
    let div = document.getElementById("cam-warn");
    if (div.style.display === 'block')
        document.getElementById("cam-warn").style.display = 'none';
    else
        document.getElementById("cam-warn").style.display = 'block';
}

let NUMBERS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

// 为 warn-div-future / warn-div-now 框内数据赋值
function setData(obj, str) {
    let i = obj.id.substring(obj.id.length-3, obj.id.length-2);
    let warn_div = 'warn-div-' + str + '-';
    let btn = 'btn-' + str + '-';

    let name = document.getElementById(btn + 'name-' + i).value;
    let data = document.getElementById(btn + 'data-' + i).value;
    let level = document.getElementById(btn + 'level-' + i).value;
    let advice = document.getElementById(btn + 'advice-' + i).value;

    document.getElementById(warn_div + 'name-1').innerHTML = name;
    document.getElementById(warn_div + 'name-2').innerHTML = name;
    document.getElementById(warn_div + 'data').innerHTML = data;
    document.getElementById(warn_div + 'level').innerHTML = level;
    document.getElementById(warn_div + 'plan').innerHTML = NUMBERS[advice];
}

// 点击按钮，显示或隐藏 warn-div-future / warn-div-now
function show(obj) {
    let str = obj.value;
    change(obj, str);
    setData(obj, str);
}

// 显示或隐藏警告，修改按钮文本
function change(obj, str) {
    let warn_div = document.getElementById('warn-div-' + str);
    // 获得预案列表
    let index = obj.id.substring(obj.id.length-3, obj.id.length-2);
    let div = document.getElementById('list-' + str + '-' + index);

    if (warn_div.style.display === 'none')
    {
        warn_div.style.display = 'block';
        div.style.display = 'block';
        obj.innerHTML = '隐藏列表';
    }
    else if (warn_div.style.display === 'block')
    {
        div.style.display = 'none';
        warn_div.style.display = 'none';
        obj.innerHTML = '显示列表';
    }
    else
        alert("Wrong Click!");
}

// 设置按钮忽略样式
function setIgnoreStyle(btnLeft, btnRight, span) {
    btnRight.disabled = 'disabled';
    btnRight.style.width = '60%';
    btnRight.style.marginLeft = '23%';
    btnRight.innerHTML = '已忽略';

    btnLeft.style.display = 'none';

    span.style.textDecoration = 'line-through';
    span.style.color = '#989898';
}

// 执行按钮样式
function setExecStyle(btnLeft, btnRight) {
    btnLeft.style.width = '60%';
    btnLeft.style.marginLeft = '21%';
    btnLeft.innerHTML = '显示列表';

    btnRight.style.display = 'none';
}

// 单个忽略按钮
function ignoreBtn(btn) {
    let btnLeft = document.getElementById(btn.id.substring(0, btn.id.length - 1) + '1');
    let btnRight = document.getElementById(btn.id);
    let span = document.getElementById(btn.id.substring(0, btn.id.length - 1) + 'span');

    setIgnoreStyle(btnLeft, btnRight, span);
}

// 全部忽略按钮
function ignoreAll(btn) {
    let str = '';
    if (btn.id === 'ignore-all-now')
    {
        str = 'btn-now-';
        btn.style.width = '15%';
    }
    else if (btn.id === 'ignore-all-future')
    {
        str = 'btn-future-';
        btn.style.width = '21%';
    }

    // 全部忽略按钮样式修改
    btn.disabled = 'disabled';
    btn.style.color = '#b3b3b3';
    btn.innerHTML = '已全部忽略';

    for (let i = 1; ; ++i)
    {
        let btnLeft = document.getElementById(str + i + '-1');
        if (btnLeft === null)
            break;
        else if (btnLeft.innerHTML !== '显示列表' && btnLeft.innerHTML !== '隐藏列表')
        {
            let btnRight = document.getElementById(str + i + '-2');
            let span = document.getElementById(str + i + '-span');

            setIgnoreStyle(btnLeft, btnRight, span);
        }
    }
}

// 执行按钮
function execBtn(btn) {
    let btnLeft = document.getElementById(btn.id);
    let btnRight = document.getElementById(btn.id.substring(0, btn.id.length - 1) + '2');

    setExecStyle(btnLeft, btnRight);
}

// 获取实时时间
function getDateTime(str) {
    let now = (new Date()).toLocaleString('zh-cn', {dateStyle: 'medium', timeStyle: 'medium'});
    $(str).text(now);
}

function now() {
    return (new Date()).toLocaleString('zh-cn', {dateStyle: 'medium', timeStyle: 'medium'});
}

// 点击按钮，暂停时间
function suspendTime(btn) {
    if (btn.id.substring(btn.id.length-1, btn.id.length) === '2'
        && document.getElementById(btn.id.substring(0, btn.id.length-1) + '1').disabled === false)
        alert("请先执行！")
    else
    {
        btn.disabled = 'disabled';
        btn.innerHTML = '已' + $('#' + btn.id).text();
        // 清除计时器，即可暂停时间
        clearInterval(parseInt(sessionStorage.getItem(btn.id + '-span')));
        document.getElementById(btn.id + '-span').style.color = 'black';
    }
}

// 设置计时器数字格式
function setNumberFormat(num) {
    if (num < 10)
        return '0' + num;
    return num;
}

// 计时器开始计时
function startClock(btn) {
    let str = btn.id.substring(0, btn.id.length-1) + 'clock';
    let count = 0;
    let num = setInterval(function () {
        count++;
        let hour = count / 3600;
        let min = count / 60 % 60;
        let sec = count % 60;
        let clock = setNumberFormat(parseInt(hour)) + ':'
            + setNumberFormat(parseInt(min)) + ':'
            + setNumberFormat(sec);
        $('#' + str).text(clock);
    }, 1000);
    sessionStorage.setItem(str, num.toString());
}

// 计时器停止计时
function stopClock(btn) {
    if (!(btn.id.substring(btn.id.length-1, btn.id.length) === '2'
        && document.getElementById(btn.id.substring(0, btn.id.length-1) + '1').disabled === false))
    {
        let str = btn.id.substring(0, btn.id.length-1) + 'clock';
        let title = btn.id.substring(0, btn.id.length-1) + 'title';
        clearInterval(parseInt(sessionStorage.getItem(str)));
        document.getElementById(str).style.color = 'black';
        document.getElementById(title).style.textDecoration = 'line-through';
    }
}

// 设置告警列表
let divFlag = 0;
let selectFlag = 0;
function setPlanList(btn) {
    // 得到从上到下第几个按钮被点击
    let index = btn.id.substring(btn.id.length-3, btn.id.length-2);
    let str = ''
    if (btn.id.substring(0, 7) === 'btn-now')
        str = 'now';
    else if (btn.id.substring(0, 7) === 'btn-fut')
        str = 'future';
    if (!selectFlag)
    {
        document.getElementById('warn-div-' + str + '-select-' + index).style.display = 'inline-block';
        selectFlag = 1;
    }
    // appendListDiv(str);
    let selected = $('#warn-div-' + str + '-select-' + index + ' option:selected').val();   // 获取到选中预案的value
    let planList = sessionStorage.getItem('planList' + selected).split(',');
    // 设置显示
    if (!divFlag)
    {
        document.getElementById('list-' + str + '-' + index).style.display = 'block';
        divFlag = 1;
    }
    document.getElementById('list-' + str + '-div-' + index + '-' + selected + '-title').style.display = 'block';
    sessionStorage.setItem('whichShow', 'list-' + str + '-div-' + index + '-' + selected);
    // 获得下拉列表
    // let whichShow = sessionStorage.getItem('whichShow').split('-');
    let select = document.getElementById('warn-div-' + str + '-select-' + index);
    if (btn.innerHTML === '显示列表')
        select.style.display = 'none';
    else
        select.style.display = 'inline-block';
    for (let i = 0; i < planList.length; ++i)
    {
        document.getElementById('list-' + str + '-div-' + index + '-' + selected + '-' + (i+1)).style.display = 'block';
    }
}

// 根据下拉框来修改预案列表
function modifyListBySelectOption(select) {
    let selected = $('#' + select.id + ' option:selected').val();
    // 获取当前显示对话框信息
    let whichShow = sessionStorage.getItem('whichShow').split('-');
    let str = whichShow[1];         // now / future
    let indexBtn = whichShow[3];    // 第几个按钮被按下
    let indexList = whichShow[4];   // 显示的是第几个预案

    let planLength = sessionStorage.getItem('planLength').split(',');

    // 隐藏已显示的预案列表
    document.getElementById('list-' + str + '-div-' + indexBtn + '-' + indexList + '-title').style.display = 'none';
    for (let i = 0; i < planLength[indexList-1]; ++i)
    {
        document.getElementById('list-' + str + '-div-' + indexBtn + '-' + indexList + '-' + (i+1)).style.display = 'none';
    }

    // 显示已选择的预案
    document.getElementById('list-' + str + '-div-' + indexBtn + '-' + selected + '-title').style.display = 'block';
    for (let i = 0; i < planLength[selected-1]; ++i)
    {
        document.getElementById('list-' + str + '-div-' + indexBtn + '-' + selected + '-' + (i+1)).style.display = 'block';
    }

    sessionStorage.setItem('whichShow', 'list-' + str + '-div-' + indexBtn + '-' + selected);
}

// 点击执行或完成，下拉框不可选
function disableSelect(btn) {
    if (!(btn.id.substring(btn.id.length-1, btn.id.length) === '2'
        && document.getElementById(btn.id.substring(0, btn.id.length-1) + '1').disabled === false))
    {
        let str = '';
        if (btn.id.substring(0, 8) === 'list-now')
            str = 'now';
        else
            str = 'future';
        let index = btn.id.substring(btn.id.length-7, btn.id.length-6);
        document.getElementById('warn-div-' + str + '-select-' + index).disabled = 'disabled';
    }
}

// 设置选定option
let optionFlag = 0;
function setSelectedOption() {
    if (!optionFlag)
    {
        for (let i = 0; i < parseInt(sessionStorage.getItem('tipsLength-now')); ++i)
        {
            let advice = document.getElementById('btn-now-advice-' + (i+1)).value;
            $('#warn-div-now-select-' + (i+1) + ' option[value=' + advice + ']').prop("selected", true);
        }

        for (let i = 0; i < parseInt(sessionStorage.getItem('tipsLength-future')); ++i)
        {
            let advice = document.getElementById('btn-future-advice-' + (i+1)).value;
            $('#warn-div-future-select-' + (i+1) + ' option[value=' + advice + ']').prop("selected", true);
        }

        optionFlag = 1;
    }
}