    import ajaxFn from './ajax.js'
    import $ from '../static/jquery-1.10.2.min'
    // document.getElementById("iframe").contentWindow.document.designMode = "on";
    // document.getElementById("iframe").contentWindow.document.contentEditable = true;
    var content = document.querySelector('.content')
	var load = document.querySelector('.loading')
	var sealBox = document.querySelector('.sealBox')
    var wrap = document.querySelector('.wrap')
    // var iframe = document.querySelector('#iframe')
    var iframeBox = document.querySelector('.iframeBox')
    var businessParamSigns = []
    var num = 0
    var img = []
    var btn = []
	var newIframBox = ''
	var childLength = 0
	var canMOve = false
	var CasAuthBPM = ''
	var fileId = ''
    init()
	setTimeout(function(){ 
		newIframBox = document.getElementById("iframe").contentWindow.document.body
		var pdfViewer = newIframBox.querySelector('.pdfViewer')
		childLength = pdfViewer.childNodes.length
		
		pdfViewer.style.cssText = "user-select: none;-ms-user-select: none;-moz-user-select: none;-webkit-user-select: none;"
		if(btn.length!=0){
			sealBox.style.cssText = 'visibility:visible'
		}
	}, 2000);
		
	function reg(srt){ 
		var reg = /[\（]/g,reg2 = /[\）]/g; 
		return srt.replace(reg,"(").replace(reg2,")");
	} 

	$("#complete").unbind("click").click(function () {
		complete()
		
	});


		
    function init() {
		var queryStr = '';
		var arr1;
		var arr2;
		var url = decodeURI(window.location.href);
		var i = url.indexOf('?');
		load.style.display = 'none'
		if (i !== -1) {
			queryStr = url.substr(i + 1);
			arr1 = queryStr.split('&');
			arr2 = new Object();
			document.getElementById("iframe").src = queryStr.split('PreviewUrl=')[1].split('&fileId=')[0]
			CasAuthBPM = queryStr.split('CASTGC=')[1]
			fileId = queryStr.split('&fileId=')[1].split('&CASTGC=')[0]
			arr1.forEach(item =>{
				var newarr1  = []
				var newarr2  = []
				newarr1 = item.split('=')
				var mesArr = newarr1[1].split(',')
				mesArr.forEach((items,i) =>{
					if(items != ''){
						var obj = {
							sealKey:'',
							sealId:'',
							sealType:'',
							posX:0,
							posY:0,
							pageNum:0,
						}
						if(newarr1[0] == 'sealKey'){
							obj.sealKey = items
							btn.push(obj)
						}
						if(newarr1[0] == 'sealId'){
							btn[i].sealId = items
						}
						if(newarr1[0] == 'pageNum'){
							btn[i].pageNum = items
						}
						if(newarr1[0] == 'sealType'){
							btn[i].sealType = items
						}
					} else {
						alert('请选择印章主体后再行盖章，谢谢')
						sealBox.style.cssText = 'visibility:hidden'
						window.close()
					}
				})
			})
			
			btn.forEach((item,i) =>{
				var generateBtn = document.createElement('div')
				generateBtn.classList.add('sealBtn')//添加类名
				generateBtn.classList.add(`Btn${i}`)
				generateBtn.innerHTML = item.sealKey
				sealBox.appendChild(generateBtn)
				sealBox.style.cssText = 'visibility:hidden'
			})

			var classNameArr = []
			for (var is =0; is<sealBox.childNodes.length; is++){
				if(sealBox.childNodes[is].className){
					if(classNameArr.length>0){
						classNameArr.forEach(item =>{
							if(item == sealBox.childNodes[is].className.substring(8,13)){
								sealBox.removeChild(sealBox.childNodes[is])
							} else {
								classNameArr.push(sealBox.childNodes[is].className.substring(8,13))
							}
						})
					} else {
						classNameArr.push(sealBox.childNodes[is].className.substring(8,13))
					}
				}
				
			}

			sealBox.addEventListener('click', function(e) {
				var textNode = e.target.innerHTML
				if(e.target.id !== 'complete'){
					show(textNode,e.target.className.substring(8,13))
				}
			})
			
			
		} 
    }
  
    function show(textNode,classNames) {
		num = num+1
		newIframBox = document.getElementById("iframe").contentWindow.document.body
		var pdfViewer = newIframBox.querySelector('.pdfViewer')
		var div = document.createElement("div");
		div.id = `active${num}`;
		div.className = 'drag';
		div.innerHTML = textNode
		div.style.cssText = "width: 130px;height: 130px;line-height:130px;font-size:12px;cursor: pointer;position: absolute;top: 0;border-radius: 50%;border-style: solid;border-color: red;text-align: center;";
		pdfViewer.style.position = 'relative'
		pdfViewer.appendChild(div)
		if(pdfViewer.childNodes[pdfViewer.childNodes.length-2].id == `active${num}`){
			pdfViewer.removeChild(pdfViewer.childNodes[pdfViewer.childNodes.length-2])
		}
		pdfViewer.addEventListener('contextmenu',function(e){
			e.preventDefault()
		},false)

		// 插入数组
		var btnMes = {}
		btn.forEach((item,i) =>{
			if(item.sealKey == reg(textNode) && i==classNames.substring(3,4)){
			var signObj = {
				sealId: item.sealId,
				sealKey: item.sealKey,
				posX: 0,
				posY: 0,
				pageNum: item.pageNum,
				sealType: item.sealType,
				className:`active${num}`,
			}
			businessParamSigns.push(signObj)
		 }
		})
		
		drag(div,btnMes,`active${num}`,pdfViewer)
		div.style.top = newIframBox.querySelector("#viewerContainer").scrollTop +'px'
    }

    function drag(ele,btnMes,className,ments){
        var oldX, oldY, newX, newY, boxX, boxY;
		var scrollMove = 0
		var del =''
        // 增加删除按钮
        var dragBtn = document.createElement("div")
        var dragDel = document.createTextNode("删除")
		dragBtn.style.cssText = "position: absolute;height: 30px;width: 40px;top: -30px;left: 90px;border: 1px solid #000;text-align: center;line-height: 30px;background: #fff;";
        dragBtn.appendChild(dragDel)
        ele.onmousedown = function(e){
			if(e.button == 0){
				canMOve = true
				this.style.position = 'absolute'//元素绝对定位
				if(!this.style.left && !this.style.top){//第一次设置left、top为0
					this.style.left = 0
					this.style.top = 0
				}
				oldX = e.pageX //记录初始光标相对于父元素坐标
				oldY = e.pageY
				ments.onmousemove = function(es){
					if(canMOve == true){
						newX = es.pageX //获取当前新光标相对于父元素坐标
						newY = es.pageY
						ele.style.left = parseInt(ele.style.left ||0) + newX - oldX + 'px';//更新
						ele.style.top = parseInt(ele.style.top) + newY - oldY + 'px';
						ele.style.width = "130px"
						ele.style.height = "130px"
						ele.style.borderRadius= "50%"
						ele.style.border = '3px solid red'
						ele.style.fontSize = '12px'
						ele.style.lineHeight= "130px"
						ele.style.textAlign= "center"
						ele.style.userSelect='none'
						oldX = newX//新坐标变为老坐标
						oldY = newY
						// 鼠标右击事件
						ele.addEventListener('contextmenu',function(esl){
							esl.preventDefault()
							esl.stopPropagation()
							// 添加删除按钮
							esl.target.appendChild(dragBtn)
							del = esl.target.getElementsByTagName("div")
							del[0].classList.add('delBtn')
							// 删除按钮点击事件
							del[0].addEventListener('click',function(el){
								el.stopPropagation()
							},false)
							
						},false)
					}	
				}	
			}
		}
		
		ments.onmouseup = function(eve){
			//删除按钮
			if(newIframBox.querySelector('.delBtn')){
				if(eve.target.className == 'delBtn'){
					var sureId = eve.target.parentNode.id
					// 删除已生成的节点坐标数据
					businessParamSigns.forEach((item,i) =>{
						if(item.className == sureId){
						   businessParamSigns.splice(i,1)
						}
					})
					ments.removeChild(eve.target.parentNode)
				} else {
					newIframBox.querySelector('.delBtn').parentNode.removeChild(newIframBox.querySelector('.delBtn'))
				}
			}

			canMOve = false
			// 鼠标松开事件获取节点坐标
			// businessParamSigns.forEach((item,i) =>{
			// 	if(item.className == eve.target.id){
			// 		var newTop = Number(newIframBox.querySelector('.page').style.height.split('px')[0])
			// 		var newLeft = Number(newIframBox.querySelector('.page').style.width.split('px')[0])
			// 		var pageNum = Math.ceil((newIframBox.querySelector("#viewerContainer").scrollTop+newY)/newTop)
			// 		if(parseInt(ele.style.top)-(newTop*(pageNum-1)) -(pageNum*10) >0){
			// 			pageNum =  Math.ceil((newIframBox.querySelector("#viewerContainer").scrollTop+newY)/newTop)
			// 		} else {
			// 			pageNum = Math.floor((newIframBox.querySelector("#viewerContainer").scrollTop+newY)/newTop)
			// 		}
			// 		var oenX = parseInt(eve.target.style.left) - parseInt((document.documentElement.clientWidth-newLeft-33)/2)
			// 		//item.posX = parseInt(ele.style.left) - parseInt((document.documentElement.clientWidth-newLeft-33)/2)
			// 		var oenY = (newTop*pageNum)-parseInt(eve.target.style.top)-140+((pageNum-1)*11)
			// 		//item.posY = (newTop*pageNum)-parseInt(ele.style.top)-140+((pageNum-1)*11)
			// 		item.posX = parseInt(595.3/(newLeft/oenX))-5
			// 		item.posY = parseInt(841.9/(newTop/oenY))+63
			// 		item.pageNum = item.pageNum == 0 ? 0 : pageNum
			// 	}
			// })
			businessParamSigns.forEach((item,i) =>{
				if(item.className == eve.target.id){
					var Viewer = newIframBox.querySelector('.pdfViewer')
					var pnum = 0
					var pageNum = 0
					var Viewerheight = 0
					var offtop1 = 0
					var newTop = 0
					var newLeft = 0
					for(var i=0;i<Viewer.childNodes.length;i++){
						pnum = i
						offtop1 = eve.target.style.top.split('px')[0]*1+140-12-pnum*11
						if(offtop1>Viewerheight){
							Viewerheight += Number(Viewer.childNodes[i].style.height.split('px')[0])
							newTop = Number(Viewer.childNodes[i].style.height.split('px')[0])
							newLeft = Number(Viewer.childNodes[i].style.width.split('px')[0])
							pageNum = pnum
						}
					}
					
					pageNum = pageNum+1
					var oenX = parseInt(eve.target.style.left) - parseInt((document.documentElement.clientWidth-newLeft-33)/2)
					
					var oenY = Viewerheight-parseInt(eve.target.style.top)-140+((pageNum)*11)
					//item.posX = parseInt(595.3/(newLeft/oenX))-5
					//item.posY = parseInt(841.9/(newTop/oenY))+63
					if(Viewer.childNodes[pageNum-1].style.height.split("px")[0] >1000){
						item.posX = parseInt(595.3*(oenX/newLeft))-5
						item.posY = parseInt(841.9*(oenY/newTop))+55
					} else {
						item.posX = parseInt(841.9*(oenX/newLeft))-5
						item.posY = parseInt(595.3*(oenY/newTop))+55
					}
					
					item.pageNum = item.pageNum == 0 ? 0 : pageNum
				}
			})
		}
		
    }
	
    function complete(){
        var newarr = []
		var sealLength = 0
        businessParamSigns.forEach(item =>{
			if(item.pageNum == 0){
				sealLength = sealLength+childLength
				var obj = {
					sealKey:item.sealKey,
					sealId: item.sealId,
					posX: item.posX,
					posY: item.posY,
					pageNum: item.pageNum,
					sealType: item.sealType,
				}
				newarr.push(obj)
			} else if(item.pageNum == 1){
				sealLength = sealLength+1
				var obj = {
					sealKey:item.sealKey,
					sealId: item.sealId,
					posX: item.posX,
					posY: item.posY,
					pageNum: 2,
					sealType: item.sealType,
				}
				newarr.push(obj)
			} else if(item.pageNum == childLength){
				sealLength = sealLength+1
				var obj = {
					sealKey:item.sealKey,
					sealId: item.sealId,
					posX: item.posX,
					posY: item.posY,
					pageNum: 1,
					sealType: item.sealType,
				}
				newarr.push(obj)
			} else {
				sealLength = sealLength+1
				var obj = {
					sealKey:item.sealKey,
					sealId: item.sealId,
					posX: item.posX,
					posY: item.posY,
					pageNum: 0,
					pageNumber : item.pageNum,
					sealType: item.sealType,
				}
				newarr.push(obj)
			}
        })
		var newarrs ={
			req:{
				apiId: "76988DBB-0B6B-4993-A58D-60C3C3EA998C",
				authType:"1",
				paramter: JSON.stringify({
					attachmentInfoId: fileId,
					businessParamSigns: newarr,
				})
			}
		}
		// console.log(newarrs,newarr,'ddd')
		// return
		if(sealLength >100){
			alert('单个PDF的印章总数不得超过100个，请重新调整，谢谢！')
		} else if(sealLength == 0){
			alert('请先进行盖章操作，再点击“盖章并退出”。')
		} else {
			load.style.display = 'block'
			loading(content)
			ajaxFn({
				arr:newarrs,
				cookie:CasAuthBPM,
				successCallback: function(res) {
					if(res.Status == 1){
						load.style.display = 'none'
						alert(res.Message)
						window.close()
					} else if(res.Status == 2){
						load.style.display = 'none'
						alert('盖章超时，请联系helpdesk报障，谢谢！')
					} else {
						load.style.display = 'none'
						alert(res.Message)
					}
				},
				failCallback: function(res) {
					load.style.display = 'none'
					alert(res.Message)
				},
			})
			
		}
    }
	function loading(element,lightColor,darkColor,speed,callback){
		if(!element&&(!element.innerText||!element.textContent))return
		element = typeof element==="string"?document.getElementById(element):element
		lightColor = lightColor||"#fff",darkColor = darkColor||"#000",speed = speed||300
		var arr_spanEles = new Array()
		!function(arr_elementText){
			element.innerText=element.textContent=""
			for(var i=0;i<arr_elementText.length;i++){
				var span = document.createElement("span")
				element.innerText?span.innerText = arr_elementText[i]:span.textContent = arr_elementText[i]
				element.appendChild(span)
				arr_spanEles.push(span)
			}
		}((element.innerText||element.textContent).split(""))
	 
		var index = -1,length = arr_spanEles.length
		var loadingTimer = setInterval(function(){
			arr_spanEles[Math.max(index,0)].style.color = darkColor
			if(index == length-1){
				index = -1
				callback&&callback()
			}
			++index
			arr_spanEles[index].style.color = lightColor
		},speed)
	}