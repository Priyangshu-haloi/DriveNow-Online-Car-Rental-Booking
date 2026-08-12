// script.js

const cars = [
    { id: 1, name: "Mahindra Scorpio", type: "SUV", fuel: "Petrol", transmission: "Manual", price: 2500, img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-47.jpeg?isig=0&q=80" },
    { id: 2, name: "Mahindra Thar", type: "SUV", fuel: "Petrol", transmission: "Manual", price: 2500, img: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Mahindra/Thar/10741/1755775915560/front-left-side-47.jpg" },
    { id: 3, name: "Toyota Fortuner", type: "SUV", fuel: "Petrol", transmission: "Manual", price: 2600, img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg?isig=0&q=80" },
    { id: 4, name: "Honda City", type: "Sedan", fuel: "Petrol", transmission: "Manual", price: 1800, img: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/134287/city-exterior-right-front-three-quarter-78.jpeg?isig=0&q=80&q=80" },
    { id: 5, name: "Maruti Suzuki Dzire", type: "Sedan", fuel: "Petrol", transmission: "Automatic", price: 1800, img: "https://imgd-ct.aeplcdn.com/664x415/n/cw/ec/170299/dzire-2024-right-front-three-quarter.jpeg?isig=0&q=80" },
    { id: 6, name: "Hyundai Verna", type: "Sedan", fuel: "Petrol", transmission: "Automatic", price: 1800, img: "https://www.motorbeam.com/wp-content/uploads/Hyundai-Verna-Specifications-1.jpg" },
    { id: 7, name: "Maruti Swift", type: "Hatchback", fuel: "Petrol", transmission: "Manual", price: 1500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrVwoUuEo4ytoHHQPoTBpsQp_c_wIA7irbBQ&s" },
    { id: 8, name: "Hyundai i20 N-Line", type: "Hatchback", fuel: "Petrol", transmission: "Manual", price: 1500, img: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/158139/i20-n-line-exterior-right-front-three-quarter-15.jpeg?isig=0&q=80&q=80" },
    { id: 9, name: "Maruti Baleno", type: "Hatchback", fuel: "Petrol", transmission: "Manual", price: 1600, img: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-71.jpeg?isig=0&q=80&q=80" },
];

const carContainer = document.getElementById('carsGrid');
const filterType = document.getElementById('filterType');
const filterFuel = document.getElementById('filterFuel');
const filterTrans = document.getElementById('filterTrans');
const minPrice = document.getElementById('minPrice');

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// Toast Notification
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <div>${message}</div>`;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500); // Wait for transition
    }, 4000);
}

function renderCars() {
    carContainer.innerHTML = '';
    
    const maxBudget = minPrice.value ? parseInt(minPrice.value) : Infinity;

    const filtered = cars.filter(c => {
        return (!filterType.value || c.type === filterType.value)
            && (!filterFuel.value || c.fuel === filterFuel.value)
            && (!filterTrans.value || c.transmission === filterTrans.value)
            && (c.price <= maxBudget);
    });

    if (filtered.length === 0) {
        carContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 1.2rem; padding: 2rem;">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; display: block; margin-bottom: 1rem; color: #3f3f46;"></i>
            No premium vehicles found matching your exact criteria. Try adjusting your filters.
        </p>`;
        return;
    }

    filtered.forEach((c, index) => {
        // Create element to add staggered show animation
        const cardHtml = `
      <div class="car-card glow-card" id="car-${c.id}" style="transition-delay: ${index * 0.1}s">
        <div class="car-image">
            <span class="car-badge">${c.type}</span>
            <img src="${c.img}" alt="${c.name}" loading="lazy">
        </div>
        <div class="car-info">
          <h3>${c.name}</h3>
          <div class="car-specs">
            <span class="spec-item"><i class="fa-solid fa-gas-pump"></i> ${c.fuel}</span>
            <span class="spec-item"><i class="fa-solid fa-gears"></i> ${c.transmission}</span>
          </div>
          <div class="car-price">
            <div class="price-tag">${formatCurrency(c.price)}<span> / day</span></div>
            <button class="btn btn-primary" onclick="openModal(${c.id})">Reserve</button>
          </div>
        </div>
      </div>`;
      
      carContainer.insertAdjacentHTML('beforeend', cardHtml);
      
      // Trigger entrance animation slightly after insertion
      setTimeout(() => {
          const el = document.getElementById(`car-${c.id}`);
          if(el) el.classList.add('show');
      }, 50);
    });
}

[filterType, filterFuel, filterTrans, minPrice].forEach(el => el.addEventListener('input', () => {
    // Debounce rendering slightly for smooth typing in budget
    clearTimeout(window.filterTimeout);
    window.filterTimeout = setTimeout(renderCars, 300);
}));

let selectedCar = null;

function openModal(id) {
    selectedCar = cars.find(c => c.id === id);
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'flex';
    // Small timeout to allow display:flex to apply before adding the show class for transition
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        selectedCar = null;
    }, 400); // Wait for transition
}

document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const date = document.getElementById('pickupDate').value;
    const notes = document.getElementById('notes').value;
    
    if (selectedCar) {
        const booking = { 
            id: Date.now(),
            carName: selectedCar.name, 
            carImg: selectedCar.img,
            name, 
            email, 
            date, 
            notes,
            status: 'Confirmed'
        };
        let bookings = JSON.parse(localStorage.getItem('premium_bookings') || '[]');
        bookings.unshift(booking); // Add to beginning
        localStorage.setItem('premium_bookings', JSON.stringify(bookings));
        
        // Reset form
        this.reset();
        closeModal();
        loadBookings();
        
        // Show stylish toast notification
        showToast(`Reservation Confirmed for ${selectedCar.name}! Check your bookings.`);
    }
});

function loadBookings() {
    let bookings = JSON.parse(localStorage.getItem('premium_bookings') || '[]');
    const container = document.getElementById('myBookings');
    container.innerHTML = '';
    
    if (bookings.length === 0) { 
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 1.1rem; padding: 2rem;">No upcoming reservations found. Start your journey today!</p>'; 
        return; 
    }
    
    bookings.forEach(b => {
        const formattedDate = new Date(b.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        
        container.innerHTML += `
            <div class="booking-item">
                <div class="booking-details">
                    <h3>${b.carName}</h3>
                    <p><i class="fa-regular fa-calendar"></i> ${formattedDate}</p>
                    <p><i class="fa-regular fa-user"></i> ${b.name} (${b.email})</p>
                    ${b.notes ? `<p><i class="fa-regular fa-comment"></i> <em>${b.notes}</em></p>` : ''}
                </div>
                <div class="booking-status">
                    <span class="status-badge"><i class="fa-solid fa-check"></i> ${b.status}</span>
                </div>
            </div>`;
    });
}

// Review System
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 400);
}

const defaultReviews = [
    { name: "Michael T.", rating: 5, text: "Absolutely stunning service. The car was in pristine condition, and the process was seamless.", date: new Date().toISOString() },
    { name: "Sarah W.", rating: 4, text: "Great selection of premium vehicles. Had a wonderful weekend trip thanks to DriveNow.", date: new Date().toISOString() },
    { name: "David L.", rating: 5, text: "The booking process was so easy, and the customer support team was very helpful.", date: new Date().toISOString() }
];

function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem('premium_reviews'));
    if (!reviews) {
        reviews = defaultReviews;
        localStorage.setItem('premium_reviews', JSON.stringify(reviews));
    }
    
    const container = document.getElementById('reviewsGrid');
    container.innerHTML = '';
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">No reviews yet. Be the first to leave one!</p>';
        return;
    }
    
    reviews.forEach((r, index) => {
        let starsHtml = '';
        for(let i=0; i<5; i++) {
            starsHtml += i < r.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }
        
        container.innerHTML += `
            <div class="review-card glow-card animate-fade-up" style="transition-delay: ${index * 0.1}s">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h4>${r.name}</h4>
                    </div>
                    <div class="review-rating">${starsHtml}</div>
                </div>
                <div class="review-body">
                    <p>"${r.text}"</p>
                </div>
            </div>`;
    });
    
    // Setup observer for new elements
    setTimeout(() => {
        document.querySelectorAll('#reviewsGrid .animate-fade-up').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }, 100);
}

document.getElementById('reviewForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('reviewerName').value;
    const rating = parseInt(document.getElementById('reviewRating').value);
    const text = document.getElementById('reviewText').value;
    
    const review = { name, rating, text, date: new Date().toISOString() };
    
    let reviews = JSON.parse(localStorage.getItem('premium_reviews') || '[]');
    reviews.unshift(review);
    localStorage.setItem('premium_reviews', JSON.stringify(reviews));
    
    this.reset();
    closeReviewModal();
    loadReviews();
    showToast('Thank you! Your feedback has been submitted successfully.');
});

// Initial load
renderCars();
loadBookings();
loadReviews();

// Close modal when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const reviewModal = document.getElementById('reviewModal');
    if (event.target === bookingModal) {
        closeModal();
    }
    if (event.target === reviewModal) {
        closeReviewModal();
    }
}

// Add scroll animation observer for elements
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Pause animations initially if they are below fold
    document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});

// Interactive UI Enhancements
document.addEventListener('mousemove', e => {
    document.querySelectorAll('.glow-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

window.addEventListener('scroll', () => {
    // Header Scroll Effect
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Scroll Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scrollProgress').style.width = scrolled + '%';
    }
});
