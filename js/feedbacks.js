import { fetchCollection } from './apiClient.js';

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1440;

const feedbackList = document.querySelector('.feedback');
const prevButton = document.querySelector('.feedback_prev_button');
const nextButton = document.querySelector('.feedback_next_button');

let feedbacks = [];
let startIndex = 0;
let visibleCount = getVisibleCount();

function getVisibleCount() {
  const width = window.innerWidth;
  if (width >= DESKTOP_BREAKPOINT) return 3;
  if (width >= TABLET_BREAKPOINT) return 2;
  return 1;
}

async function fetchFeedbacks() {
  try {
    return await fetchCollection('feedbacks');
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    if (feedbackList) {
      feedbackList.insertAdjacentHTML(
        'beforeend',
        `<li class="feedback_load_error">Failed to load feedbacks. Please try again later.</li>`,
      );
    }
    return [];
  }
}

function getInitial(author) {
  if (!author) return '';
  const parts = author.trim().split(/\s+/);
  const first = parts[0] ?? '';
  const last = parts[1] ?? '';
  return last ? `${first} ${last.charAt(0)}.` : first;
}

function buildFeedbackMarkup(feedback) {
  return `
    <li class="feedback_li">
      <h3 class="feedback_list">"${feedback.text}"</h3>
      <p class="bestsellers_subtitle_list client_name">${getInitial(feedback.author)}</p>
    </li>
  `;
}

function renderFeedbacks() {
  if (!feedbackList) return;

  feedbackList.innerHTML = '';
  const visible = feedbacks.slice(startIndex, startIndex + visibleCount);
  const markup = visible.map(buildFeedbackMarkup).join('');
  feedbackList.insertAdjacentHTML('beforeend', markup);

  updateArrowState();
}

function updateArrowState() {
  if (!prevButton || !nextButton) return;

  const atStart = startIndex === 0;
  const atEnd = startIndex + visibleCount >= feedbacks.length;

  prevButton.setAttribute('aria-disabled', String(atStart));
  prevButton.disabled = atStart;

  nextButton.setAttribute('aria-disabled', String(atEnd));
  nextButton.disabled = atEnd;
}

function showNextFeedback() {
  if (startIndex + visibleCount >= feedbacks.length) return;
  startIndex += 1;
  renderFeedbacks();
}

function showPreviousFeedback() {
  if (startIndex === 0) return;
  startIndex -= 1;
  renderFeedbacks();
}

function updateVisibleCount() {
  const newCount = getVisibleCount();
  if (newCount === visibleCount) return;

  visibleCount = newCount;
  const maxStart = Math.max(0, feedbacks.length - visibleCount);
  if (startIndex > maxStart) startIndex = maxStart;
  renderFeedbacks();
}

async function initFeedbacks() {
  feedbacks = await fetchFeedbacks();
  if (feedbacks.length === 0) return;

  renderFeedbacks();

  nextButton?.addEventListener('click', showNextFeedback);
  prevButton?.addEventListener('click', showPreviousFeedback);
  window.addEventListener('resize', updateVisibleCount);
}

document.addEventListener('DOMContentLoaded', initFeedbacks);
