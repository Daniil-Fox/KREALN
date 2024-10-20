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



