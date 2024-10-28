const audio = new Audio('music/Sakura-Girl-Daisy-chosic.com_.mp3');

// Set the audio to loop
audio.loop = true;
audio.volume = 0.3; 

// Function to play audio
function playAudio() {
    audio.play().then(() => {
        console.log('Audio is playing');
    }).catch(error => {
        console.log('Audio playback failed:', error);
    });
}

// Automatically play audio on page load
window.addEventListener('load', () => {
    playAudio();
});

