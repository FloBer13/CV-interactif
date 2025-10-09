// script.js - comportement minimal pour CV-BERGA
document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js chargé');

  // exemple : click log pour icones
  document.querySelectorAll('.icone1, .icone2').forEach(el => {
    el.addEventListener('click', () => {
      console.log('Icône cliquée:', el.className);
    });
  });

  // gestionnaire spécifique : quand on double-clique sur .icone1, afficher l'alerte "bonjour"
  const icone1 = document.querySelector('.icone1');
  if (icone1) {
    icone1.addEventListener('dblclick', () => {
      // ajoute l'état 'busy' pour montrer le curseur sablier
      document.documentElement.classList.add('busy');
      // attendre un repaint pour s'assurer que le curseur est affiché
      requestAnimationFrame(() => {
        setTimeout(() => {
          const overlay = document.getElementById('modalOverlay');
          const winBox = overlay && overlay.querySelector('.window-box');
          const closeBtn = overlay && overlay.querySelector('.window-close');
          if (overlay && winBox) {
            overlay.setAttribute('aria-hidden', 'false');
            // retirer l'état busy et appliquer busy-alt brièvement
            document.documentElement.classList.remove('busy');
            document.documentElement.classList.add('busy-alt');
            setTimeout(() => {
              document.documentElement.classList.remove('busy-alt');
            }, 1000);

            // focus management
            const previouslyFocused = document.activeElement;
            closeBtn && closeBtn.focus();

            // make modal draggable via its titlebar (mouse + touch) - same behavior as winOverlay
            const titlebarModal = overlay.querySelector('.window-titlebar');
            let draggingModal = false;
            let mStartX = 0, mStartY = 0, mStartLeft = 0, mStartTop = 0;

            function onModalPointerDown(e) {
              draggingModal = true;
              const rect = winBox.getBoundingClientRect ? winBox.getBoundingClientRect() : winBox.getBoundingClientRect();
              mStartLeft = rect.left;
              mStartTop = rect.top;
              if (e.type === 'touchstart') {
                mStartX = e.touches[0].clientX;
                mStartY = e.touches[0].clientY;
              } else {
                mStartX = e.clientX;
                mStartY = e.clientY;
              }
              document.addEventListener('mousemove', onModalPointerMove);
              document.addEventListener('mouseup', onModalPointerUp);
              document.addEventListener('touchmove', onModalPointerMove, { passive: false });
              document.addEventListener('touchend', onModalPointerUp);
            }

            function onModalPointerMove(e) {
              if (!draggingModal) return;
              e.preventDefault();
              let clientX = (e.touches ? e.touches[0].clientX : e.clientX);
              let clientY = (e.touches ? e.touches[0].clientY : e.clientY);
              const dx = clientX - mStartX;
              const dy = clientY - mStartY;
              winBox.style.left = (mStartLeft + dx) + 'px';
              winBox.style.top = (mStartTop + dy) + 'px';
            }

            function onModalPointerUp() {
              draggingModal = false;
              document.removeEventListener('mousemove', onModalPointerMove);
              document.removeEventListener('mouseup', onModalPointerUp);
              document.removeEventListener('touchmove', onModalPointerMove);
              document.removeEventListener('touchend', onModalPointerUp);
            }

            titlebarModal && titlebarModal.addEventListener('mousedown', onModalPointerDown);
            titlebarModal && titlebarModal.addEventListener('touchstart', onModalPointerDown, { passive: false });

            function closeModal() {
              overlay.setAttribute('aria-hidden', 'true');
              document.removeEventListener('keydown', onKey);
              overlay.removeEventListener('click', onOverlayClick);
              closeBtn && closeBtn.removeEventListener('click', onCloseClick);
              // cleanup modal drag listeners
              titlebarModal && titlebarModal.removeEventListener('mousedown', onModalPointerDown);
              titlebarModal && titlebarModal.removeEventListener('touchstart', onModalPointerDown);
              document.removeEventListener('mousemove', onModalPointerMove);
              document.removeEventListener('mouseup', onModalPointerUp);
              document.removeEventListener('touchmove', onModalPointerMove);
              document.removeEventListener('touchend', onModalPointerUp);
              previouslyFocused && previouslyFocused.focus();
            }

            function onKey(e) {
              if (e.key === 'Escape') closeModal();
            }
            function onOverlayClick(e) {
              if (e.target === overlay) closeModal();
            }
            function onCloseClick() {
              closeModal();
            }

            overlay.addEventListener('click', onOverlayClick);
            document.addEventListener('keydown', onKey);
            closeBtn && closeBtn.addEventListener('click', onCloseClick);

          } else {
            // fallback : retirer busy si pas de modal
            document.documentElement.classList.remove('busy');
          }
        }, 50);
      });
    });
  }

  // double-clic sur icone2 ouvre une fenêtre "Windows" intégrée
  const icone2 = document.querySelector('.icone2');
  if (icone2) {
    icone2.addEventListener('dblclick', () => {
      const winOverlay = document.getElementById('winOverlay');
      const winBox = winOverlay && winOverlay.querySelector('.window-box');
      const closeBtn = winOverlay && winOverlay.querySelector('.window-close');
      if (winOverlay && winBox) {
        document.documentElement.classList.add('busy');
        requestAnimationFrame(() => {
          setTimeout(() => {
            winOverlay.setAttribute('aria-hidden', 'false');
            document.documentElement.classList.remove('busy');
            // focus
            const prev = document.activeElement;
            closeBtn && closeBtn.focus();

            // no toggle: window is modal by default

            // make the window draggable by its titlebar (mouse + touch)
            const titlebar = winOverlay.querySelector('.window-titlebar');
            let dragging = false;
            let startX = 0, startY = 0, startLeft = 0, startTop = 0;

            function onPointerDown(e) {
              dragging = true;
              const rect = winBox.getBoundingClientRect();
              startLeft = rect.left;
              startTop = rect.top;
              if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
              } else {
                startX = e.clientX;
                startY = e.clientY;
              }
              document.addEventListener('mousemove', onPointerMove);
              document.addEventListener('mouseup', onPointerUp);
              document.addEventListener('touchmove', onPointerMove, { passive: false });
              document.addEventListener('touchend', onPointerUp);
            }

            function onPointerMove(e) {
              if (!dragging) return;
              e.preventDefault();
              let clientX = (e.touches ? e.touches[0].clientX : e.clientX);
              let clientY = (e.touches ? e.touches[0].clientY : e.clientY);
              const dx = clientX - startX;
              const dy = clientY - startY;
              winBox.style.left = (startLeft + dx) + 'px';
              winBox.style.top = (startTop + dy) + 'px';
            }

            function onPointerUp() {
              dragging = false;
              document.removeEventListener('mousemove', onPointerMove);
              document.removeEventListener('mouseup', onPointerUp);
              document.removeEventListener('touchmove', onPointerMove);
              document.removeEventListener('touchend', onPointerUp);
            }

            titlebar && titlebar.addEventListener('mousedown', onPointerDown);
            titlebar && titlebar.addEventListener('touchstart', onPointerDown, { passive: false });

            function closeWin() {
              winOverlay.setAttribute('aria-hidden', 'true');
              // cleanup listeners
              closeBtn && closeBtn.removeEventListener('click', onClose);
              titlebar && titlebar.removeEventListener('mousedown', onPointerDown);
              titlebar && titlebar.removeEventListener('touchstart', onPointerDown);
              document.removeEventListener('mousemove', onPointerMove);
              document.removeEventListener('mouseup', onPointerUp);
              document.removeEventListener('touchmove', onPointerMove);
              document.removeEventListener('touchend', onPointerUp);
              prev && prev.focus();
            }
            function onClose() { closeWin(); }

            // Only allow manual close via the close button
            closeBtn && closeBtn.addEventListener('click', onClose);
          }, 40);
        });
      }
    });
  }

  // double-clic sur icone3 ouvre une fenêtre "Windows" intégrée
  const icone3 = document.querySelector('.icone3');
  if (icone3) {
    icone3.addEventListener('dblclick', () => {
      const winOverlay = document.getElementById('modalOverlay2');
      const winBox = winOverlay && winOverlay.querySelector('.window-box');
      const closeBtn = winOverlay && winOverlay.querySelector('.window-close');
      if (winOverlay && winBox) {
        document.documentElement.classList.add('busy');
        requestAnimationFrame(() => {
          setTimeout(() => {
            winOverlay.setAttribute('aria-hidden', 'false');
            document.documentElement.classList.remove('busy');
            // focus
            const prev = document.activeElement;
            closeBtn && closeBtn.focus();

            // no toggle: window is modal by default

            // make the window draggable by its titlebar (mouse + touch)
            const titlebar = winOverlay.querySelector('.window-titlebar');
            let dragging = false;
            let startX = 0, startY = 0, startLeft = 0, startTop = 0;

            function onPointerDown(e) {
              dragging = true;
              const rect = winBox.getBoundingClientRect();
              startLeft = rect.left;
              startTop = rect.top;
              if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
              } else {
                startX = e.clientX;
                startY = e.clientY;
              }
              document.addEventListener('mousemove', onPointerMove);
              document.addEventListener('mouseup', onPointerUp);
              document.addEventListener('touchmove', onPointerMove, { passive: false });
              document.addEventListener('touchend', onPointerUp);
            }

            function onPointerMove(e) {
              if (!dragging) return;
              e.preventDefault();
              let clientX = (e.touches ? e.touches[0].clientX : e.clientX);
              let clientY = (e.touches ? e.touches[0].clientY : e.clientY);
              const dx = clientX - startX;
              const dy = clientY - startY;
              winBox.style.left = (startLeft + dx) + 'px';
              winBox.style.top = (startTop + dy) + 'px';
            }

            function onPointerUp() {
              dragging = false;
              document.removeEventListener('mousemove', onPointerMove);
              document.removeEventListener('mouseup', onPointerUp);
              document.removeEventListener('touchmove', onPointerMove);
              document.removeEventListener('touchend', onPointerUp);
            }

            titlebar && titlebar.addEventListener('mousedown', onPointerDown);
            titlebar && titlebar.addEventListener('touchstart', onPointerDown, { passive: false });

            function closeWin() {
              winOverlay.setAttribute('aria-hidden', 'true');
              // cleanup listeners
              closeBtn && closeBtn.removeEventListener('click', onClose);
              titlebar && titlebar.removeEventListener('mousedown', onPointerDown);
              titlebar && titlebar.removeEventListener('touchstart', onPointerDown);
              document.removeEventListener('mousemove', onPointerMove);
              document.removeEventListener('mouseup', onPointerUp);
              document.removeEventListener('touchmove', onPointerMove);
              document.removeEventListener('touchend', onPointerUp);
              prev && prev.focus();
            }
            function onClose() { closeWin(); }

            // Only allow manual close via the close button
            closeBtn && closeBtn.addEventListener('click', onClose);
          }, 40);
        });
      }
    });
  }

});
