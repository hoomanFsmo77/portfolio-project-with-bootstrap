////////////////////Variables//////////////////////////////////////

const navItems=$('.nav-items')
const tabSections=$('.tabSection')
const navItemsArray=_qAll('.nav-items')
const projectLiNav=$('#tab-4 li')
const projectSection=$('.content_nav section')
const messageForm=document.getElementById('message_form')
const nameInput=document.getElementById('nameInput')
const emailInput=document.getElementById('emailInput')
const messageInput=document.getElementById('messageInput')
let nameRegex=/^\w+$/
let emailRegex=/^([^\.\-\_\&\^\%\$\#\@]+)([a-zA-Z0-9\_\.]+)@(\w{4,6})\.(\w{2,4})$/
const message=document.querySelector('.message')
const loader=document.querySelector('.spinner-border')
const skillsContainer=document.getElementById('skills_container')
/////////////// Catching Elements with functions////////////////////
function _id(tag) {
    return  document.getElementById(tag)
}
function _class(tag) {
    return document.getElementsByClassName(tag)
}
function _q(tag) {
    return document.querySelector(tag)
}
function _qAll(tag) {
    return document.querySelectorAll(tag)
}
/////////////////////////// fire on nav items /////////////////////
navItems.click(function () {
    navItems.removeClass('text-red')
    $(this).addClass('text-red')
    navItems.removeClass('active')
    navItems.find('.bi').remove()
    $(this).addClass('active')
    if(window.innerWidth<768){
        $(this).append('<i class="bi bi-arrow-down"></i>')
    }else{
        $(this).append('<i class="bi bi-arrow-right"></i>')
    }

    let navItemsIndex=$(this).index()
    tabSections.css('display','none')
    tabSections.eq(navItemsIndex+1).fadeIn(200)
})
//////////////////////// scroll fire for mobile ////////////////////
function getOffset( el ) {
    let _x = 0;
    let _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

console.log(document.querySelector('.tabSection').offsetTop)
let y = getOffset( document.querySelector('.tabSection') ).top;
navItemsArray.forEach(function (item) {
    item.addEventListener('click',function () {
        window.scrollTo(0,y)
    })
})
////////////////////// project nav fire
projectLiNav.click(function () {
    projectLiNav.removeClass('active')
    $(this).addClass('active')
    let indexOfLi=$(this).index()
    projectSection.css('display','none')
    projectSection.eq(indexOfLi).fadeIn(200)
})
///////////////////// wow js
new WOW().init()
/////////////////// type js
const typeAnimation=new TypeIt("#job-title",{
    afterComplete: () => {
        typeAnimation.reset()
            .go()
    },
})
    .delete()
    .type("Front End Programmer")
    .pause(500)
    .delete(10)
    .type('Developer')
    .type(" / React Js Programmer")
    .pause(1500)
    .delete()
    .type("Front End Developer / React Js Programmer")
    .pause(1500)
    .go()

////////////////////////////////////////////
const sendData = async newData => {
  let response=await fetch('https://about-me-e63b3-default-rtdb.firebaseio.com/messages.json',{
      method:'POST',
      headers:{
          'content-type':'application/json'
      },
      body:JSON.stringify(newData)
  })
  if(response.ok){
        return await response.json()
  }else{
        throw Error(`${response.status}`)
  }
}
const clearInput = () => {
  nameInput.value=''
  emailInput.value=''
  messageInput.value=''

}



messageForm.addEventListener('submit',e=>{
    e.preventDefault()
    loader.style.display='inline-block'
    let date=new  Date()
    if(nameRegex.test(nameInput.value) && emailRegex.test(emailInput.value)){
        let newMessage={
            name:nameInput.value,
            email:emailInput.value,
            message:messageInput.value,
            date:`${date.toDateString()}`
        }
        sendData(newMessage).then(result=>{
            loader.style.display='none'
            message.innerHTML='Message has been sent!'
            message.style.color='green'
            clearInput()
            setTimeout(()=>{
                location.reload()
            },1000)
        }).catch(error=>{
            message.innerHTML='Server is not responding! Try again.'
            message.style.color='red'
        })
    }else{
        message.innerHTML='Invalid Email or Name !'
        message.style.color='red'
        loader.style.display='none'
    }

})


/////////////////////////////////////////// get data
const getPosts = async () => {
  let response=await fetch('https://about-me-e63b3-default-rtdb.firebaseio.com/posts.json')
    if(response.ok){
        return await response.json()
    }else{
        throw Error(`${response.status}`)
    }
}
const showSkillsData = res => {
    let randomNum=Math.floor(Math.random()*99999999)
    skillsContainer.insertAdjacentHTML('beforeend',` <div class="accordion-item"><h2 class="accordion-header" id="panelsStayOpen-headingOne2"><button class="accordion-button collapsed fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#accrordion-${randomNum}" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">${res[1].title}</button></h2><div id="accrordion-${randomNum}" class="accordion-collapse collapse " aria-labelledby="panelsStayOpen-headingOne"><div class="accordion-body">${res[1].description}</div></div></div>`)

}

const showWebData = res => {
    let targetContainer=document.querySelector(`.${res[1].tab}`)
    targetContainer.insertAdjacentHTML('beforeend',`<div class="card wow animate__animated  animate__fadeIn animate__slow my-2" ><div class="card-header text-dark fw-bold ">${res[1].title}</div><div class="card-body text-dark">${res[1].description}Visit this <a  target=”_blank” class="text-red" href="${res[1].link}">link</a>.</div></div>`)
}

window.addEventListener('DOMContentLoaded',()=>{
    clearInput()
    getPosts().then(result=>{
        Object.entries(result).forEach(post=>{
            post[1].category==='skills' && showSkillsData(post)
            post[1].category==='web project' && showWebData(post)
        })
    }).catch(error=>{
        console.log(error)
    })


})
