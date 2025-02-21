
    document.addEventListener("DOMContentLoaded", function () {
        let audio = document.getElementById("background-audio");
        let audioButton = document.getElementById("toggle-audio");

        function playAudio() {
            audio.play().then(() => {
                audioButton.textContent = "🔇 Silenciar";
            }).catch(error => console.log("Autoplay bloqueado:", error));
        }

        // Intentar reproducir el audio cuando el usuario interactúa
        audioButton.addEventListener("click", function () {
            if (audio.paused) {
                playAudio();
            } else {
                audio.pause();
                audioButton.textContent = "🔊 Activar sonido";
            }
        });

        // Si quieres intentar iniciar el audio automáticamente
        playAudio();
    });
