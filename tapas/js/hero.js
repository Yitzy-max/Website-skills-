/* HALIDE_CORE hero — vanilla port of the supplied React component's useEffect.
   Same parallax math, same entrance animation, same timings. */
(function () {
  var canvas = document.getElementById('canvas3d');
  if (!canvas) return;

  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-layer]'));

  // Mouse Parallax Logic
  function handleMouseMove(e) {
    var x = (window.innerWidth / 2 - e.pageX) / 25;
    var y = (window.innerHeight / 2 - e.pageY) / 25;

    // Rotate the 3D Canvas
    canvas.style.transform = 'rotateX(' + (55 + y / 2) + 'deg) rotateZ(' + (-25 + x / 2) + 'deg)';

    // Apply depth shift to layers
    layers.forEach(function (layer, index) {
      if (!layer) return;
      var depth = (index + 1) * 15;
      var moveX = x * (index + 1) * 0.2;
      var moveY = y * (index + 1) * 0.2;
      layer.style.transform = 'translateZ(' + depth + 'px) translate(' + moveX + 'px, ' + moveY + 'px)';
    });
  }

  // Entrance Animation
  canvas.style.opacity = '0';
  canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)';

  setTimeout(function () {
    canvas.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
    canvas.style.opacity = '1';
    canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
  }, 300);

  window.addEventListener('mousemove', handleMouseMove);
})();
