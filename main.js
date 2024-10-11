function playAudioAndRedirect() {
  const audio = document.getElementById('buttonClickAudio');
  audio.play(); // Play the audio
  setTimeout(() => {
    window.location.href = 'game.html'; // Redirect to game.html after audio plays
  }, 1000); // Adjust the timeout as needed
}