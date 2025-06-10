
const button = document.getElementById('clickMeBtn');

const colors = [
  '#FFADAD', '#FFD6A5', '#FDFFB6',
  '#CAFFBF', '#9BF6FF', '#A0C4FF',
  '#BDB2FF', '#FFC6FF', '#FFFFFC'
];
let currentIndex = 0;
button.addEventListener('click', () => {
  document.body.style.backgroundColor = colors[currentIndex];
  currentIndex = (currentIndex + 1) % colors.length;
});
