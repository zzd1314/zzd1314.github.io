function getData(data) {
    var arr = [];
    data.forEach(function(value, key) {
        arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    })
    return arr.join("&");
}
var elements = document.getElementsByClassName('van-message')
for (var i = 0; i < elements.length; i++) {
    elements[i].time = 0
    elements[i].hidden = true
}
delete elements
function onUpdate() {
    var elements = document.getElementsByClassName('van-message')
    for (var j = 0; j < elements.length; j++) {
        var i = elements[j]
        if (!i.hidden) {
            if (i.time < 50) {
                i.style.top = (i.offsetTop - 1) + "px"
            }
            if (i.time > 500) {
                i.value = ""
                i.hidden = true
            }
            i.time = i.time + 1;
        }
    }
}
setInterval(onUpdate, 1)
document.getElementById('submit').onclick = function() {
    var form = new FormData();
    form.append("username", document.getElementById('username').value)
    form.append("data", emjio.parse(document.getElementById('data').value))
    if (document.getElementById('capcha').value=="") {
            var messagebox = document.getElementsByClassName('van-message')[0]
            messagebox.innerText = "需要验证码"
            messagebox.style.left = document.getElementById('submit').offsetWidth + "px"
            messagebox.style.top = document.getElementById('submit').offsetTop + "px"
            messagebox.time = 0
            messagebox.hidden = false
            return
    }
    form.append("capcha",document.getElementById('capcha').value)
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', '../api/sendComments.jsp', true);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    httpRequest.send(getData(form));
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var text = httpRequest.responseText;
            var messagebox = document.getElementsByClassName('van-message')[0]
            messagebox.innerText = text
            messagebox.style.left = document.getElementById('submit').offsetWidth + "px"
            messagebox.style.top = document.getElementById('submit').offsetTop + "px"
            messagebox.time = 0
            messagebox.hidden = false
            if(!text.match("验证码")) {
                document.getElementById('data').value = ""
            }
            document.getElementById("capchaImg").click()
            document.getElementById('capcha').value=""
            document.getElementById("username").disabled=true
        }
    };
}
document.getElementById('img').onclick = function() {
    var file = document.createElement("input")
    file.type = "file"
    //file.accept="image/*"
    file.accept = ".png,.jpg,.gif,.tiff,.jpeg"
    file.multiple = true
    file.onchange = function() {
        for (var i = 0; i < file.files.length; i++) {
            var form = new FormData()
            form.append("category", "daily")
            form.append("file_up", file.files[i])
            var xhr = new XMLHttpRequest()
            xhr.open("POST", "/api/upload.jsp", false)
            xhr.send(form)
            var json = JSON.parse(xhr.response)
            var messagebox = document.getElementsByClassName('van-message')[0]
            if (json.code == 0) {
                messagebox.innerText = "上传成功"
                document.getElementById('data').value += "<img src=\"" + json.data.image_url.replace("http://", "https://") + "\">"
            } else {
                messagebox.innerText = json.message
            }
            messagebox.style.left = document.getElementById('img').offsetWidth + "px"
            messagebox.style.top = document.getElementById('img').offsetTop + "px"
            messagebox.time = 0
            messagebox.hidden = false
        }
    }
    file.click()
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
document.getElementById("username").value = Base64.decode(getCookie("username"))
if (document.getElementById("username").value.length>0) {
  document.getElementById("username").disabled=true
}
