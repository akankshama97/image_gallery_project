// DOM Elements
const galleryItems = document.querySelectorAll('.gallery-item');
const filterButtons = document.querySelectorAll('.filter-btn');

const lightbox = document.getElementById('imageViewer');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCounter = document.getElementById('lightboxCounter');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Active state tracking
let visibleItems = Array.from(galleryItems);
let currentIndex = 0;

// Initialize gallery events
function initGallery() {
    // Card click events for opening lightbox
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const currentList = getVisibleItems();
            const indexInVisible = currentList.indexOf(item);
            if (indexInVisible !== -1) {
                openLightbox(indexInVisible);
            }
        });
    });

    // Category filter button click events
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });

    // Lightbox navigation events
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    closeBtn.addEventListener('click', closeLightbox);

    // Close when clicking directly on the dark overlay (outside the media wrapper)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support: Escape to close, Left/Right arrows to navigate
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
}

// Get array of currently visible gallery items based on filter
function getVisibleItems() {
    return Array.from(galleryItems).filter((item) => !item.classList.contains('hidden'));
}

// Filter items by category
function applyFilter(category) {
    galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Open Lightbox with specified index in visible items
function openLightbox(index) {
    visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;

    currentIndex = index;
    updateLightboxMedia();

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
}

// Update image, title and counter
function updateLightboxMedia() {
    const activeItem = visibleItems[currentIndex];
    if (!activeItem) return;

    const img = activeItem.querySelector('img');
    const title = activeItem.getAttribute('data-title') || img.alt || 'Photo Preview';

    lightboxImg.src = img.src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
}

// Next photo handler
function showNext() {
    visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;

    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxMedia();
}

// Previous photo handler
function showPrev() {
    visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;

    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxMedia();
}

// Close Lightbox
function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = ''; // Restore background scrolling
}

// Run setup on load
document.addEventListener('DOMContentLoaded', initGallery);
