document.addEventListener('DOMContentLoaded', function() {
  var video = document.getElementById('myVideo');
  video.play().catch(function(error) {
    console.log("Video autoplay failed:", error);
  });
}); 