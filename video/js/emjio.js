emjio = {}
var xhr=new XMLHttpRequest()
xhr.open("GET","/api/emjio.json")
xhr.onreadystatechange = () => {
	if (xhr.readyState==4) {
		emjio.cache=JSON.parse(xhr.response).data.packages
		emjio.cache.forEach(em => {
			var div=document.createElement("div")
			div.innerText=em.text
			div.appendChild(document.createElement("br"))
			document.getElementById('emjio').appendChild(div)
			em.emote.forEach(emote => {
				var url=emote.url.replace("http","https")
				if (url.startsWith("http")) {
					var img=document.createElement("img")
					img.src=url+"@32w_32h.png"
				} else {
					var img=document.createElement("span")
					img.innerText=url+" "
				}
				img.addEventListener("click",() => {
					document.getElementById("data").value+=emote.text
				})
				div.appendChild(img)
			})
		})
	}
}
xhr.send()
emjio.parse = arg => {
	emjio.cache.forEach(em => {
		em.emote.forEach(emote => {
			var url=emote.url
			if (url.startsWith("http")) {
				if (em.text.startsWith("热词系列")) {
					arg=arg.split(emote.text).join('<img src="'+url.replace("http","https")+'@64w_64h.png">')
				}else{
					arg=arg.split(emote.text).join('<img src="'+url.replace("http","https")+'@32w_32h.png">')
				}
			}
		})
	})
	return arg
}