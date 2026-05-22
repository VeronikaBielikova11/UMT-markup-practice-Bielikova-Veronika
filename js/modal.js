const detailModal = document.getElementById('detail_modal');
const orderModal = document.getElementById('order_modal');
const closeDetailBtn = document.getElementById('close_detail_modal_button');
const closeOrderBtn = document.getElementById('close_order_modal_button');
const detailModalContent = document.getElementById('detail_modal_content');

let lastFocusedElement = null;

function openModal(modal) {
  modal.classList.add('is-open');
  document.body.classList.add('modal-open');
  setTimeout(() => {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length) focusable[0].focus();
  }, 10);
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

function fillDetailModalContent(li) {
  const img = li.querySelector('.bouquet_image');
  const title = li.querySelector('h3');
  const desc =
    li.querySelector('.bouquet_modal_description') ||
    li.querySelector('.bouquet_description') ||
    li.querySelector('.bouquet_description_center_list');
  const price =
    li.querySelector('.price') ||
    li.querySelector('.price_bouquet_first_row') ||
    li.querySelector('.price_bouquet_second_row');

  detailModalContent.innerHTML = `
    <img
      class="detail_modal_image"
      src="${img ? img.src : ''}"
      srcset="${img && img.srcset ? img.srcset : ''}"
      alt="${img && img.alt ? img.alt : ''}"
    />
    <div class="detail_modal_texts_block">
      <h3 class="detail_modal_title">${title ? title.textContent.trim() : ''}</h3>
           <p class="detail_modal_price">${price ? price.textContent.trim() : ''}</p>
      <p class="detail_modal_text">${desc ? desc.textContent.trim() : ''}</p>
 
      <button
        type="button"
        class="explore_bouquets_button explore_our_bouquets_button detail_modal_button"
        id="buy_now_btn"
      >Buy now</button>
    </div>
  `;
}

function handleCardClick(e) {
  const li = e.target.closest('li');
  if (!li) return;

  const tag = e.target.tagName;
  const classList = e.target.classList;

  const isClickable =
    classList.contains('bouquet_image') ||
    classList.contains('section_subtitle') ||
    tag === 'H3' ||
    tag === 'IMG';

  console.log('Клік:', tag, [...classList], 'isClickable:', isClickable);

  if (isClickable) {
    lastFocusedElement = document.activeElement;
    fillDetailModalContent(li);
    openModal(detailModal);
  }
}

const catalogueList = document.getElementById('catalogue_list');
const bouquetsCatalogue = document.querySelector('.catalogue_list');

if (catalogueList) {
  catalogueList.addEventListener('click', handleCardClick);
} else {
  console.warn('catalogue_list не знайдено!');
}

if (bouquetsCatalogue) {
  bouquetsCatalogue.addEventListener('click', handleCardClick);
}

detailModal.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'buy_now_btn') {
    closeModal(detailModal);
    lastFocusedElement = document.activeElement;
    openModal(orderModal);
  }
});

closeDetailBtn.addEventListener('click', () => closeModal(detailModal));
closeOrderBtn.addEventListener('click', () => closeModal(orderModal));

[detailModal, orderModal].forEach((modal) => {
  modal.addEventListener('mousedown', (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (detailModal.classList.contains('is-open')) closeModal(detailModal);
    if (orderModal.classList.contains('is-open')) closeModal(orderModal);
  }
});

function trapFocus(modal) {
  modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open') || e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

trapFocus(detailModal);
trapFocus(orderModal);
