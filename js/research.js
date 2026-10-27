(function () {
  'use strict';

  var loop = document.querySelector('.research-loop');
  if (!loop) return;

  var stages = ['data', 'training', 'deployment'];
  var names = ['Data and evaluation', 'Scalable training', 'Reliable deployment and feedback'];
  var nodes = Array.prototype.slice.call(loop.querySelectorAll('[data-research-stage]'));
  var panels = Array.prototype.slice.call(loop.querySelectorAll('[data-stage-panel]'));
  var play = loop.querySelector('.research-play');
  var playLabel = loop.querySelector('.research-play-label');
  var playIcon = loop.querySelector('.research-play-icon');
  var status = loop.querySelector('.research-stage-status');
  var next = loop.querySelector('.research-next');
  var current = 0;
  var timer = null;
  var inView = true;

  function selectStage(index, announce) {
    current = (index + stages.length) % stages.length;
    loop.setAttribute('data-active-stage', stages[current]);
    nodes.forEach(function (node, i) {
      node.classList.toggle('is-active', i === current);
      node.setAttribute('aria-pressed', i === current ? 'true' : 'false');
    });
    panels.forEach(function (panel, i) {
      panel.classList.toggle('is-active', i === current);
      panel.hidden = i !== current;
    });
    if (announce) status.textContent = names[current] + '. Research details updated.';
  }

  function stopPlayback() {
    window.clearInterval(timer);
    timer = null;
    loop.classList.remove('is-playing');
    play.setAttribute('aria-pressed', 'false');
    playLabel.textContent = 'Play the loop';
    playIcon.textContent = '\u25b6';
  }

  function startPlayback() {
    timer = window.setInterval(function () {
      // Do not change or hide a panel while its links have keyboard focus.
      if (!document.hidden && inView && !loop.querySelector('.research-details').contains(document.activeElement)) {
        selectStage(current + 1, false);
      }
    }, 4500);
    loop.classList.add('is-playing');
    play.setAttribute('aria-pressed', 'true');
    playLabel.textContent = 'Pause the loop';
    playIcon.textContent = '\u2161';
  }

  nodes.forEach(function (node, i) {
    node.addEventListener('click', function () {
      stopPlayback();
      selectStage(i, true);
    });
    node.addEventListener('keydown', function (event) {
      var target = i;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (i + 1) % stages.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (i + stages.length - 1) % stages.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = stages.length - 1;
      else return;
      event.preventDefault();
      stopPlayback();
      selectStage(target, true);
      nodes[target].focus();
    });
  });

  play.addEventListener('click', function () {
    if (timer) stopPlayback();
    else startPlayback();
  });
  next.addEventListener('click', function () {
    stopPlayback();
    selectStage(current + 1, true);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (!inView) stopPlayback();
    }, { threshold: 0 }).observe(loop);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopPlayback();
  });

  loop.classList.add('is-enhanced');
  loop.querySelector('.research-map-controls').hidden = false;
  next.hidden = false;
  selectStage(0, false);
}());
