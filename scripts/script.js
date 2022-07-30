
var polaroids = document.querySelectorAll('.polaroid');

polaroids.forEach(item => {
  const randomRotation = Math.floor(Math.random() * (6 - -6 + 1) + -6);
  
  item.style.transform = `rotate(${randomRotation}deg)`
})

