import { fetchCollection } from './apiClient.js';

const PRODUCTS_PER_PAGE = 8;

const catalogueList = document.querySelector('.catalogue_list');
const showMoreButton = document.querySelector('.show_more_button');

let products = [];
let renderedCount = 0;

async function fetchProducts() {
  try {
    return await fetchCollection('products');
  } catch (error) {
    console.error('Failed to fetch products:', error);
    if (catalogueList) {
      catalogueList.insertAdjacentHTML(
        'beforeend',
        `<li class="catalogue_load_error">Failed to load bouquets. Please try again later.</li>`,
      );
    }
    return [];
  }
}

function buildCardMarkup(product) {
  const priceClass =
    renderedCount < 4 ? 'price_bouquet_first_row' : 'price_bouquet_second_row';

  return `
    <li class="catalogue_list_item" data-product-id="${product.id}">
      <img
        class="bouquet_image"
        src="${product.img}"
        alt="${product.title}"
      />
      <h3 class="section_subtitle center_text">${product.title}</h3>
      <p class="bouquet_description_center_list">${product.desc}</p>
      <p class="section_subtitle ${priceClass}">$${product.price}</p>
    </li>
  `;
}

function renderProducts(items) {
  if (!catalogueList || items.length === 0) return;

  const markup = items
    .map((product) => {
      const html = buildCardMarkup(product);
      renderedCount += 1;
      return html;
    })
    .join('');

  catalogueList.insertAdjacentHTML('beforeend', markup);
}

function updateShowMoreButton() {
  if (!showMoreButton) return;

  if (renderedCount >= products.length) {
    showMoreButton.style.display = 'none';
    showMoreButton.setAttribute('aria-disabled', 'true');
  } else {
    showMoreButton.style.display = '';
    showMoreButton.setAttribute('aria-disabled', 'false');
  }
}

function loadMoreProducts() {
  const nextBatch = products.slice(
    renderedCount,
    renderedCount + PRODUCTS_PER_PAGE,
  );
  renderProducts(nextBatch);
  updateShowMoreButton();
}

async function initProducts() {
  products = await fetchProducts();
  if (products.length === 0) return;

  const firstBatch = products.slice(0, PRODUCTS_PER_PAGE);
  renderProducts(firstBatch);
  updateShowMoreButton();

  if (showMoreButton) {
    showMoreButton.addEventListener('click', loadMoreProducts);
  }
}

document.addEventListener('DOMContentLoaded', initProducts);
