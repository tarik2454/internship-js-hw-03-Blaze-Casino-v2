(function () {
  try {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
