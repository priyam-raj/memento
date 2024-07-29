let polaroids = document.querySelectorAll('.polaroid')

polaroids.forEach(item => {
  const randomRotation = Math.floor(Math.random() * (6 - -6 + 1) + -6)

  item.style.transform = `rotate(${randomRotation}deg)`
})

function calculateDays() {
  // 23 March 2001 4:00 AM IST (UTC+5:30)
  const birthday = new Date(Date.UTC(2001, 2, 22, 22, 30)); // UTC time equivalent
  const today = new Date();
  const timeDiff = today.getTime() - birthday.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  document.querySelector('#days').innerHTML = days;

  // Check if age is 110 years or more
  const ageInYears = Math.floor(days / 365.25);
  if (ageInYears >= 110) {
    convertToPastTense();
  }
}

function convertToPastTense() {
  const elements = document.querySelectorAll('.paragraph, .spider-tag, .birthday-area');
  const replacements = {
    '\\bis\\b': 'was',
    '\\bare\\b': 'were',
    '\\bhas\\b': 'had',
    '\\bhave\\b': 'had',
    '\\bam\\b': 'was',
    '\\bwill\\b': 'would',
    '\\bcan\\b': 'could',
    '\\bdo\\b': 'did',
    '\\bdoes\\b': 'did',
    '\\bgo\\b': 'went',
    '\\bmake\\b': 'made',
    '\\bcreate\\b': 'created',
    '\\bkeep\\b': 'kept'
  };

  elements.forEach(element => {
    let text = element.innerHTML;
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'gi');
      text = text.replace(regex, value);
    }
    element.innerHTML = text;
  });
}

calculateDays();