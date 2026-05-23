import { fetchCollection } from './apiClient.js';

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1440;

const bestsellersList = document.querySelector('.bestsellers_list');
const dotsList = document.querySelector('.bestsellers_dots');
const prevButton = document.querySelector('.bestsellers_prev_button');
const nextButton = document.querySelector('.bestsellers_next_button');

let bestsellers = [];
let startIndex = 0;
let visibleCount = getVisibleCount();

function getVisibleCount() {
  const width = window.innerWidth;
  if (width >= DESKTOP_BREAKPOINT) return 3;
  if (width >= TABLET_BREAKPOINT) return 2;
  return 1;
}

async function fetchBestsellers() {
  try {
    return await fetchCollection('bestsellers');
  } catch (error) {
    console.error('Failed to fetch bestsellers:', error);
    if (bestsellersList) {
      bestsellersList.insertAdjacentHTML(
        'beforeend',
        `<li class="bestsellers_load_error">Failed to load bestsellers. Please try again later.</li>`,
      );
    }
    return [];
  }
}

function buildCardMarkup(item) {
  return `
    <li data-bestseller-id="${item.id}">
      <img
        class="bouquet_image"
        src="${item.img}"
        alt="${item.title}"
      />
      <h3 class="section_subtitle">${item.title}</h3>
      <p class="bouquet_description">${item.text}</p>
      <p class="section_subtitle price">$${item.price}</p>
    </li>
  `;
}

function buildDotMarkup(index, isActive) {
  const background = isActive ? 'black' : 'gray';
  const opacity = isActive ? '1' : '0.2';
  return `
    <li>
      <span
        data-dot-index="${index}"
        style="
          display: inline-block;
          width: 8px;
          height: 8px;
          background: ${background};
          border-radius: 50%;
          opacity: ${opacity};
        "
      ></span>
    </li>
  `;
}

function renderBestsellers() {
  if (!bestsellersList) return;

  bestsellersList.innerHTML = '';
  const visible = bestsellers.slice(startIndex, startIndex + visibleCount);
  const markup = visible.map(buildCardMarkup).join('');
  bestsellersList.insertAdjacentHTML('beforeend', markup);

  updateDots();
  updateArrowState();
}

function updateDots() {
  if (!dotsList) return;

  const totalDots = Math.max(1, bestsellers.length - visibleCount + 1);
  dotsList.innerHTML = '';
  let markup = '';
  for (let i = 0; i < totalDots; i += 1) {
    markup += buildDotMarkup(i, i === startIndex);
  }
  dotsList.insertAdjacentHTML('beforeend', markup);
}

function updateArrowState() {
  if (!prevButton || !nextButton) return;

  const atStart = startIndex === 0;
  const atEnd = startIndex + visibleCount >= bestsellers.length;

  prevButton.setAttribute('aria-disabled', String(atStart));
  prevButton.disabled = atStart;

  nextButton.setAttribute('aria-disabled', String(atEnd));
  nextButton.disabled = atEnd;
}

function showNextBestseller() {
  if (startIndex + visibleCount >= bestsellers.length) return;
  startIndex += 1;
  renderBestsellers();
}

function showPreviousBestseller() {
  if (startIndex === 0) return;
  startIndex -= 1;
  renderBestsellers();
}

function updateVisibleCount() {
  const newCount = getVisibleCount();
  if (newCount === visibleCount) return;

  visibleCount = newCount;
  const maxStart = Math.max(0, bestsellers.length - visibleCount);
  if (startIndex > maxStart) startIndex = maxStart;
  renderBestsellers();
}

async function initBestsellers() {
  bestsellers = await fetchBestsellers();
  if (bestsellers.length === 0) return;

  renderBestsellers();

  nextButton?.addEventListener('click', showNextBestseller);
  prevButton?.addEventListener('click', showPreviousBestseller);
  window.addEventListener('resize', updateVisibleCount);
}

document.addEventListener('DOMContentLoaded', initBestsellers);
