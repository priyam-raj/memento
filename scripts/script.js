
let polaroids = document.querySelectorAll('.polaroid');

polaroids.forEach(item => {
  const randomRotation = Math.floor(Math.random() * (6 - -6 + 1) + -6);
  
  item.style.transform = `rotate(${randomRotation}deg)`
})



// Function to calculate days since the user was born
function calculateDays() {
  const birthday = new Date('03/23/2001');
  const today = new Date();
  const days = Math.floor((today - birthday) / (1000 * 60 * 60 * 24));
  document.querySelector('#days').innerHTML = days;
}


calculateDays()




