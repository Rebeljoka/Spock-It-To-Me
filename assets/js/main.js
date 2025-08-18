const userRockBtn = document.getElementById('rock');
const userRockImg = document.getElementById('UserRockImg');
const defaultSrc = 'assets/images/stoneBtn.webp';
const selectedSrc = 'assets/images/stoneBtnClicked.webp';

userRockBtn.addEventListener('click', function() {
  userRockImg.src = selectedSrc;
  setTimeout(() => {
    userRockImg.src = defaultSrc;
  }, 200); // 200ms delay before switching back
});