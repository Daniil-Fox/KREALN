import './_components.js';


const service = document.querySelectorAll('.service')
if(service.length > 0){
  service.forEach(section => {
    const serviceArr = section.querySelector('.service__wrapper')
    section.addEventListener('mousemove', e => {

      const x = e.pageX - window.innerWidth / section.clientWidth * 400
      const y = e.pageY - 900

      // serviceArr.style.transform = `translateX(${x}px)`
      serviceArr.style.setProperty('--pos', x + 'px')
    })
  })

}
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}


window.addEventListener('DOMContentLoaded', e => {
  const circle = document.querySelectorAll('.team-lic__circle circle')
  if(circle.length > 0){
    let percnetage = 32

    let radius = document.querySelector('.team-lic__circle').clientWidth / 2
    circle.forEach(c => {
      let circleLength = 2 * Math.PI * radius
      c.setAttribute('stroke-dasharray', circleLength)
      c.setAttribute('stroke-dashoffset', circleLength - circleLength * percnetage / 100)
    })
  }
})


