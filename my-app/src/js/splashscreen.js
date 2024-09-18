/*
function redirectToAnotherWebsite() {
    setTimeout(function() {
        window.location.href = "login.html";
    }, 5 * 1000); 
}
window.onload = redirectToAnotherWebsite;
*/
/*
// Simulate loading time with setTimeout
window.addEventListener('load', function() {
    setTimeout(function() {
      // Hide the splash screen after some time (e.g., 3 seconds)
      document.getElementById('splash-screen').style.display = 'none';
      // Show the main app content
      // document.getElementById('app').style.display = 'block';
      window.location.href = "login.html";
    }, 3000); // Adjust the timeout value as needed

    // Animate the loading bar to fill up
    var loadingBar = document.querySelector('.fill');
    loadingBar.style.width = '100%';
  }); 
  window.onload = redirectToAnotherWebsite;
*/
  window.addEventListener('load', function() {
    // Start the loading bar animation
    setTimeout(function() {
        var loadingBar = document.querySelector('.fill');
        loadingBar.style.width = '100%';
    }, 100); // Slight delay to ensure CSS transition applies

    // Hide the splash screen and redirect after 3 seconds
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
        window.location.href = "login.html";
    }, 3000); // Adjust the timeout value as needed
});