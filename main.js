function playAudioAndRedirect() {
  const audio = document.getElementById('buttonClickAudio');
  audio.play(); // Play the audio
  setTimeout(() => {
    window.location.href = 'game.html';
  }, 1000); 
}