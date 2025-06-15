export function initVideoPlayer() {
  // Handle iframe videos (like YouTube embeds)
  const videoTrigger = document.getElementById("video-trigger");
  const videoContainer = document.getElementById("video-container");
  const videoIframe = document.getElementById("video-iframe");

  if (videoTrigger && videoContainer && videoIframe) {
    videoTrigger.addEventListener("click", () => {
      videoContainer.classList.remove("hidden");
      videoIframe.src += "?autoplay=1";
    });
  }

  // Handle HTML5 video elements with play buttons
  const playButtons = document.querySelectorAll(".play-btn");

  playButtons.forEach((button) => {
    const videoContainer = button.closest(".overflow-hidden, .relative");
    if (!videoContainer) return;

    const video = videoContainer.querySelector("video");
    if (!video) return;

    console.log("Video player initialized for:", video);

    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      try {
        if (video.paused) {
          video
            .play()
            .then(() => {
              console.log("Video playing");
              // Update button to show pause icon
              this.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            `;

              // Hide the overlay if it exists
              const overlay = videoContainer.querySelector(".absolute");
              if (overlay) {
                overlay.style.opacity = "0";
              }
            })
            .catch((err) => {
              console.error("Error playing video:", err);
            });
        } else {
          video.pause();
          console.log("Video paused");

          // Update button to show play icon
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          `;

          // Show the overlay if it exists
          const overlay = videoContainer.querySelector(".absolute");
          if (overlay) {
            overlay.style.opacity = "0.8";
          }
        }
      } catch (error) {
        console.error("Video control error:", error);
      }
    });

    // Handle video ending
    video.addEventListener("ended", function () {
      console.log("Video ended");

      // Reset play button icon
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;

      // Show the overlay
      const overlay = videoContainer.querySelector(".absolute");
      if (overlay) {
        overlay.style.opacity = "0.8";
      }
    });

    // Make video clickable to toggle play/pause
    video.addEventListener("click", function (e) {
      if (e.target === this) {
        if (this.paused) {
          this.play();
        } else {
          this.pause();
        }
      }
    });
  });

  console.log(`Initialized ${playButtons.length} video players`);
}
