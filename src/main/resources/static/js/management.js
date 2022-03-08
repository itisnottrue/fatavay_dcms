// 打开添加摄像头模块
function addCam(){
    document.getElementById("addCam").style.display = 'block';
}

// 关闭添加摄像头模块
function closeAddCam() {
    document.getElementById("addCam").style.display = 'none';
}

// 打开添加服务器模块
function addSer(){
    document.getElementById("addSer").style.display = 'block';
}

// 关闭添加服务器模块
function closeAddSer() {
    document.getElementById("addSer").style.display = 'none';
}

// 打开更新摄像头模块
function updateCam() {
    document.getElementById("updateCam").style.display = 'block';
}

// 关闭更新摄像头模块
function closeUpdateCam() {
    document.getElementById("updateCam").style.display = 'none';
}

// 打开更新服务器模块
function updateSer() {
    document.getElementById("updateSer").style.display = 'block';
}

// 关闭更新服务器模块
function closeUpdateSer() {
    document.getElementById("updateSer").style.display = 'none';
}

// 关闭告警模块
function closeDiv() {
    document.getElementById("cam-warn").style.display = 'none';
}

// 点击铃铛显示div
function openDiv() {
    document.getElementById("cam-warn").style.display = 'block';
}

function openAndClose_cam() {
    let div = document.getElementById('deleteCam')

    if (div.style.display === 'block')
        div.style.display = 'none';
    else
        div.style.display = 'block';
}

function openAndClose_ser() {
    let div = document.getElementById('deleteSer')

    if (div.style.display === 'block')
        div.style.display = 'none';
    else
        div.style.display = 'block';
}

function setId(id) {
    document.getElementById("deleteConfirmSpan").innerHTML = id;
    document.getElementById("deleteConfirmInput").value = id;
}

function serverDelete (id){
    setId(id);
    openAndClose_ser();
}

function cameraDelete (id){
    setId(id);
    openAndClose_cam();
}
function cameraDetail (id){
    $.ajax({
        type: "get",
        url: "cameraDetail?id=" + id,
        data: "json",
        success: function (res){
            if (res.code === 1){    // 成功获取到摄像头数据
                updateCam();
                document.getElementById("idUpdate").value = res.camera.id;
                document.getElementById("typeUpdate").value = res.camera.type;
                document.getElementById("brandIdUpdate").value = res.camera.brandId;
                document.getElementById("usernameUpdate").value = res.camera.username;
                document.getElementById("passwordUpdate").value = res.camera.password;
                document.getElementById("ipUpdate").value = res.camera.ip;
                document.getElementById("portUpdate").value = res.camera.port;
                document.getElementById("transportUpdate").value = res.camera.transport;
                document.getElementById("cameraStatusUpdate").value = res.camera.cameraStatus;
                document.getElementById("videoStatusUpdate").value = res.camera.videoStatus;
                document.getElementById("xAxisUpdate").value = res.camera.xaxis;
                document.getElementById("yAxisUpdate").value = res.camera.yaxis;
                document.getElementById("zPositionUpdate").value = res.camera.floorId;
                document.getElementById("remarksUpdate").value = res.camera.remarks;
            }
            else{
            	alert(res.msg);
            }
        }
    });
}

function serverDetail (id){
//      alert("res.msg");
    $.ajax({
        type: "get",
        url: "serverDetail?id=" + id,
        data: "json",
        success: function (res){
            if (res.code === 1){    // 成功获取到摄像头数据
                updateSer();
                document.getElementById("idUpdate").value = res.server.id;
                document.getElementById("typeUpdate").value = res.server.type;
                document.getElementById("portUpdate").value = res.server.port;
                document.getElementById("ipUpdate").value = res.server.ip;
                document.getElementById("usernameUpdate").value = res.server.username;
                document.getElementById("passwordUpdate").value = res.server.password;
            }
            else{
            	alert(res.msg);
            }
        }
    });
}