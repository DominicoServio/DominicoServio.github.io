// Open modal
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', () => {
    const modalId = item.dataset.modal;
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  });
});

// Close modal
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal-overlay');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  });
});

// Optional: click outside modal-box to close
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
});
