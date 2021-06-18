
if (window.location.href == "https://codedev.mojo626.repl.co/") {
  window.location.replace("/data");
}
if (window.location.href == "https://codedev.mojo626.repl.co/data") {
  window.location.replace("/home.html");
}

function Like(post, thread) {
  if (localStorage.getItem("liked" + post + "." + thread) == null) {
    localStorage.setItem("liked" + post + "." + thread, true);
    window.location.replace("/like/" + post + "/" + thread);
  }
  
}

function reply2(post) {
  $("#postBox" + post + "").css('display', 'inline-block');

}