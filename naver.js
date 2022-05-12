let queue = []

let notice = document.createElement("div")
notice.id = 'jam-supporter-notice'
notice.style.cssText = "position:fixed;bottom:20px;left:20px;display:none;z-index:999;width:100px;height:40px;opacity:0.7;background:#1641a8;color:#FFF;border-radius:20px;font-size:16px;align-items:center;justify-content:center;";
document.getElementsByTagName("body")[0].prepend(notice)

setInterval(function (){
    let boxs = document.getElementsByClassName("u_cbox_recomm_set")

    Array.from(boxs).forEach(e => {
        if (e.getElementsByClassName("jam-supporter-btn").length) return;

        e.prepend(makeBtn(false))
        e.prepend(makeBtn(true))
        e.style.display = "flex"
    })

    if (!queue.length){
        notice.innerHTML = "4건 대기중"
        return;
    }

    chrome.storage.sync.get(['lastTimestamp'], function (res){
        if (!res.hasOwnProperty('lastTimestamp') || res.lastTimestamp + 11000 < Date.now()){
            chrome.storage.sync.set({
                lastTimestamp: Date.now()
            }, function (){
                let node = queue.pop()
                node.parentNode.getElementsByClassName((node.getAttribute("data-type") == "up") ? "u_cbox_btn_recomm" : "u_cbox_btn_unrecomm")[0].click()
    
                let btns = node.parentNode.getElementsByClassName("jam-supporter-btn")
                btns[0].innerHTML = "완료"
                btns[0].disabled = true
                btns[1].remove()
                notice.innerHTML = queue.length + "건 대기중"
            })
        }
    })
}, 1000)

function makeBtn(type){
    let btn = document.createElement("button")
    btn.innerHTML = type ? '자동추천' : '자동비추천'
    btn.onclick = function () {
        addQueue(this)
    }
    btn.classList.add("jam-supporter-btn")
    btn.setAttribute("data-type", type ? 'up' : 'down')
    btn.style.border = "1px solid #" + (type ? '1641a8' : 'db4b3f')
    btn.style.marginLeft = "5px"
    btn.style.padding = "2px 5px"

    return btn
}

function addQueue(v){
    let btns = v.parentNode.getElementsByClassName("jam-supporter-btn")

    if (v.innerHTML == "대기중"){
        queue = queue.filter((e) => e !== v);
        btns[0].remove();
        btns[1].remove();
        return
    }

    if (queue.indexOf(v) >= 0) return

    queue.push(v)
    v.innerHTML = "대기중"
    if (btns[0].innerHTML == '대기중') btns[1].remove()
    else btns[0].remove()


    notice.innerHTML = queue.length + "건 대기중"
    notice.style.display = "flex"
}