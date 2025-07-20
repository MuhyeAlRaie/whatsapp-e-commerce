 let products = [];
 fetch(CONFIG.PRODUCTS_API_URL)
  .then(res => res.json())
  .then(data => {
    products = data
      .map(item => ({
        id: Number(item.id || 0),
        name: item.name || '',
        category: item.category || 'other',
        price: Number(item.price || 0),
        oldPrice: Number(item.oldPrice || 0),
        shortDesc: item.shortDesc || '',
        description: item.description || '',
        images: (item.images || '').split(',').map(s => s.trim()).filter(s => s),
        colors: (item.colors || '').split(',').map(c => c.trim()).filter(c => c),
        available: item.available?.toLowerCase() === 'yes' 
      }))
      .filter(p => p.name.trim() !== ''); // ✅ لا تعرض المنتجات بدون اسم

    displayProducts();
    document.getElementById("preloader").style.display = "none";

  });

  function refreshProducts() {
    fetch(CONFIG.PRODUCTS_API_URL)
      .then(res => res.json())
      .then(data => {
        products = data.map(item => ({
          id: Number(item.id || 0),
          name: item.name || 'منتج بدون اسم',
          category: item.category || 'other',
          price: Number(item.price || 0),
          oldPrice: Number(item.oldPrice || 0),
          shortDesc: item.shortDesc || '',
          description: item.description || '',
          images: (item.images || '').split(',').map(s => s.trim()).filter(s => s),
          colors: (item.colors || '').split(',').map(c => c.trim()).filter(c => c),
          available: item.available?.toLowerCase() === 'yes' 
        }));
         if (!p.name || p.name.trim() === "") return;
        displayProducts();
      });
  }

  // ✅ تحميل السلة من localStorage أو البدء بسلة فارغة
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentProduct = null;
  let currentFilter = 'all';
  let currentPage = 1;
  let productsPerPage = 20;
  let filteredProducts = [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function displayProducts() {
    const container = document.getElementById('products');
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter products based on category and search
    filteredProducts = products.filter(p => {
      const matchesCategory = currentFilter === 'all' || p.category === currentFilter;
      const matchesSearch = p.name.toLowerCase().includes(search) || 
                           p.shortDesc.toLowerCase().includes(search) ||
                           p.description.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });

    // Update results count
    updateResultsCount();

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Clear container
    container.innerHTML = '';

    // Display products
    productsToShow.forEach(product => {
      const card = document.createElement('div');
      card.className = 'col-6 col-md-4 col-lg-3';

      const availableText = product.available ? '' : '<div class="text-danger fw-bold">غير متوفر حالياً</div>';

      const addButton = product.available
        ? `<button class="btn btn-sm btn-outline-primary" onclick='addToCart(${product.id})'>أضف إلى السلة</button>`
        : `<button class="btn btn-sm btn-secondary" disabled>غير متوفر</button>`;

      card.innerHTML = `
        <div class="card product-card h-100">
          <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text flex-grow-1">${product.shortDesc}</p>
            <p class="card-text text-danger fw-bold">
              $${product.price}
              ${Number(product.oldPrice) > 0 ? `<span class="ms-2 text-muted text-decoration-line-through">$${product.oldPrice}</span>` : ''}
            </p>
            ${availableText}
            <div class="mt-auto">
              ${addButton}
              <button class="btn btn-sm btn-link" onclick='showProductPopup(${product.id})'>عرض التفاصيل</button>
              <button class="btn btn-sm btn-outline-secondary" onclick="shareProduct(${product.id})">
                📤 مشاركة
              </button>
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    });

    // Update pagination
    updatePagination(totalPages);
  }

  function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(currentPage * productsPerPage, filteredProducts.length);
    
    if (filteredProducts.length === 0) {
      resultsCount.textContent = 'لا توجد منتجات تطابق البحث';
    } else {
      resultsCount.textContent = `عرض ${startIndex}-${endIndex} من ${filteredProducts.length} منتج`;
    }
  }

  function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">السابق</a>`;
    pagination.appendChild(prevLi);

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
      pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">التالي</a>`;
    pagination.appendChild(nextLi);
  }

  function changePage(page) {
    if (page < 1 || page > Math.ceil(filteredProducts.length / productsPerPage)) return;
    currentPage = page;
    displayProducts();
    // Scroll to top of products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  }

  function changeProductsPerPage() {
    productsPerPage = parseInt(document.getElementById('products-per-page').value);
    currentPage = 1; // Reset to first page
    displayProducts();
  }

  function setFilter(filter) {
    // Update active button
    document.querySelectorAll('.filter-buttons .btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentFilter = filter;
    currentPage = 1; // Reset to first page when filter changes
    displayProducts();
  }

  function addToCart(id, color = null) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === product.id && item.color === color);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1, color });
    }
    updateCart();
    saveCart(); // ✅ حفظ التغير في السلة
  }

  function updateCart() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    const list = document.getElementById('cart-items');
    list.innerHTML = '';

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center justify-content-between';
      li.innerHTML = `
        <img src="${item.images[0]}" style="width: 40px; height: 40px; object-fit: cover; margin-left: 10px;">
        <span class="flex-grow-1">(${item.id}) ${item.name}${item.color ? ' - ' + item.color : ''}<br> × ${item.quantity} </span>
        <span class="me-2">$${item.price * item.quantity}</span>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">×</button>`;
      list.appendChild(li);
    });

    let totalPrice = 0;
    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    document.getElementById('cart-total').textContent = totalPrice + ' د.أ';

    if (discountPercent > 0) {
  const discount = totalPrice * (discountPercent / 100);
  const finalTotal = totalPrice - discount;

  document.getElementById('cart-total').innerHTML = `
    <div><s>${totalPrice.toFixed(2)} د.أ</s></div>
    <div class="text-success">${finalTotal.toFixed(2)} د.أ بعد الخصم</div>`;
} else {
  document.getElementById('cart-total').textContent = totalPrice.toFixed(2) + ' د.أ';
}
  }

  function removeFromCart(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
    saveCart(); // ✅ حفظ التغير في السلة
  }

  function toggleCartPopup() {
    const popup = document.getElementById('cart-popup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  }

  function showProductPopup(id) {
    currentProduct = products.find(p => p.id === id);

    document.getElementById('popup-title').textContent = currentProduct.name;
    document.getElementById('popup-description').textContent = currentProduct.description;
   document.getElementById('popup-price').innerHTML = `
  $${currentProduct.price}
  ${Number(currentProduct.oldPrice) > 0 ? `<span class="ms-2 text-muted text-decoration-line-through">(كان $${currentProduct.oldPrice})</span>` : ''}
`;
    
    const addBtn = document.getElementById('popup-add-button');

    const carouselInner = document.getElementById('popup-carousel-inner');
    const thumbnails = document.getElementById('popup-thumbnails');
    carouselInner.innerHTML = '';
    thumbnails.innerHTML = '';


    addBtn.disabled = !currentProduct.available;
addBtn.textContent = currentProduct.available ? "أضف إلى السلة" : "غير متوفر";
addBtn.className = currentProduct.available ? "btn btn-primary" : "btn btn-secondary";

    currentProduct.images.forEach((img, idx) => {
      const item = document.createElement('div');
      item.className = `carousel-item ${idx === 0 ? 'active' : ''}`;
      item.innerHTML = `<img src="${img}" class="d-block w-100" alt="${currentProduct.name}">`;
      carouselInner.appendChild(item);

      const thumb = document.createElement('img');
      thumb.src = img;
      thumb.className = 'img-thumbnail';
      thumb.style.width = '70px';
      thumb.style.cursor = 'pointer';
      thumb.onclick = () => {
        const carousel = new bootstrap.Carousel(document.getElementById('popup-carousel'));
        carousel.to(idx);
      };
      thumbnails.appendChild(thumb);
    });

    const colorSelect = document.getElementById('color-select');
    colorSelect.innerHTML = '';
    if (currentProduct.colors && currentProduct.colors.length > 0) {
      currentProduct.colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
      });
      colorSelect.style.display = 'block';
    } else {
      colorSelect.style.display = 'none';
    }

    document.getElementById('product-popup').style.display = 'block';
  }

  function addToCartFromPopup() {
    if (currentProduct) {
      const selectedColor = document.getElementById('color-select').value || null;
      addToCart(currentProduct.id, selectedColor);
      closePopup('product-popup');
    }
  }

  function closePopup(id) {
    document.getElementById(id).style.display = 'none';
  }

  function showCheckoutPopup() {
    closePopup('cart-popup');
    document.getElementById('checkout-popup').style.display = 'block';
    updateOrderSummary(); // ✅ تحديث الملخص
  }

  function updateOrderSummary() {
  const list = document.getElementById('summary-items');
  const totalEl = document.getElementById('summary-total');
  list.innerHTML = '';

  let totalBefore = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `(${item.id}) ${item.name}${item.color ? ' - ' + item.color : ''} × ${item.quantity}`;
    list.appendChild(li);
    totalBefore += item.price * item.quantity;
  });

  const discountAmount = discountPercent > 0 ? totalBefore * (discountPercent / 100) : 0;
  const totalAfterDiscount = totalBefore - discountAmount;
  const totalFinal = totalAfterDiscount + deliveryFee;

  totalEl.innerHTML = `
    ${discountPercent > 0 ? `<div>المجموع قبل الخصم: <s>${totalBefore.toFixed(2)} د.أ</s></div>
    <div>قيمة الخصم (${discountPercent}%): -${discountAmount.toFixed(2)} د.أ</div>` : ''}
    <div>رسوم التوصيل: ${deliveryFee.toFixed(2)} د.أ</div>
    <div class="text-success fw-bold">المجموع النهائي: ${totalFinal.toFixed(2)} د.أ</div>
  `;
}

const deliveryFees = {
  area1: 2,  // رسوم التوصيل 5 د.أ للمنطقة 1
  area2: 2.5, // رسوم التوصيل 10 د.أ للمنطقة 2
  area3: 3  // رسوم التوصيل 15 د.أ للمنطقة 3
};
let deliveryFee = 0;

function updateDeliveryFee() {
  const areaSelect = document.getElementById('delivery-area');
  const selectedArea = areaSelect.value;
  const feeMessage = document.getElementById('delivery-fee-message');

  if (deliveryFees[selectedArea] !== undefined) {
    deliveryFee = deliveryFees[selectedArea];
    feeMessage.textContent = `رسوم التوصيل: ${deliveryFee.toFixed(2)} د.أ`;
  } else {
    deliveryFee = 0;
    feeMessage.textContent = '';
  }
  updateOrderSummary();
  updateCart();  // لتحديث المجموع في السلة إذا تعرض هناك
}


// Dynamic coupons loaded from Google Sheets
let coupons = {};

// Load coupons from Google Sheets API
function loadCoupons() {
  fetch(CONFIG.COUPONS_API_URL)
    .then(res => res.json())
    .then(data => {
      coupons = {};
      if (Array.isArray(data)) {
        data.forEach(coupon => {
          // Only include active coupons that haven't expired
          const isActive = coupon.Active === true || coupon.Active === 'TRUE' || coupon.Active === 'true';
          const isNotExpired = !coupon.ExpiryDate || new Date(coupon.ExpiryDate) >= new Date();
          
          if (isActive && isNotExpired && coupon.Code && coupon.Discount) {
            coupons[coupon.Code.toUpperCase()] = parseFloat(coupon.Discount);
          }
        });
      }
      console.log('Loaded coupons:', coupons);
    })
    .catch(error => {
      console.error('Error loading coupons:', error);
      // Fallback to config coupons if API fails
      coupons = CONFIG.COUPONS;
    });
}

// Initialize coupons on page load
loadCoupons();

// ==================== TOP-SELLING PRODUCTS FUNCTIONS ====================

// Load top-selling products from Google Sheets
function loadTopSellingProducts() {
  fetch(CONFIG.TOP_SELLING_API_URL + '?top_selling=true&limit=6&period=month')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data && data.data.length > 0) {
        renderTopSellingProducts(data.data);
      } else {
        // Hide section if no data
        document.getElementById('top-selling-products').parentElement.parentElement.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error loading top-selling products:', error);
      // Hide section on error
      document.getElementById('top-selling-products').parentElement.parentElement.style.display = 'none';
    });
}

// Render top-selling products
function renderTopSellingProducts(topProducts) {
  const container = document.getElementById('top-selling-products');
  container.innerHTML = '';

  topProducts.forEach(item => {
    const product = products.find(p => p.id.toString() === item.productId.toString());
    
    if (product) {
      const card = document.createElement('div');
      card.className = 'col-6 col-md-4 col-lg-2';

      const availableText = product.available ? '' : '<div class="text-danger fw-bold small">غير متوفر حالياً</div>';

      const addButton = product.available
        ? `<button class="btn btn-sm btn-outline-primary" onclick='addToCart(${product.id})'>أضف إلى السلة</button>`
        : `<button class="btn btn-sm btn-secondary" disabled>غير متوفر</button>`;

      card.innerHTML = `
        <div class="card product-card h-100 border-warning">
          <div class="position-relative">
            <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
            <div class="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 small rounded-bottom-start">
              🔥 ${item.totalQuantitySold} مبيع
            </div>
          </div>
          <div class="card-body d-flex flex-column p-2">
            <h6 class="card-title small">${product.name}</h6>
            <p class="card-text text-danger fw-bold small">
              $${product.price}
              ${Number(product.oldPrice) > 0 ? `<span class="ms-1 text-muted text-decoration-line-through">$${product.oldPrice}</span>` : ''}
            </p>
            ${availableText}
            <div class="mt-auto">
              ${addButton}
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    }
  });
}

// Load hero slider images from Google Sheets
function loadHeroSlider() {
  fetch(CONFIG.HERO_SLIDER_API_URL)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        // Filter active slides and sort by order
        const activeSlides = data.filter(slide => 
          slide.Active === true || slide.Active === 'TRUE' || slide.Active === 'true'
        ).sort((a, b) => (a.Order || 0) - (b.Order || 0));
        
        if (activeSlides.length > 0) {
          renderHeroSlider(activeSlides);
        }
      }
    })
    .catch(error => {
      console.error('Error loading hero slider:', error);
      // Keep default slide if API fails
    });
}

// Render hero slider with fetched data
function renderHeroSlider(slides) {
  const carouselInner = document.getElementById('hero-carousel-inner');
  const indicators = document.getElementById('hero-indicators');
  
  // Clear existing content
  carouselInner.innerHTML = '';
  indicators.innerHTML = '';
  
  slides.forEach((slide, index) => {
    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    
    const heroSlide = document.createElement('div');
    heroSlide.className = 'hero-slide';
    
    // Set background image if provided
    if (slide.ImageURL) {
      heroSlide.style.backgroundImage = `url('${slide.ImageURL}')`;
    }
    
    heroSlide.innerHTML = `
      <h1>${slide.Title || 'مرحباً بكم في متجرنا'}</h1>
      <p>${slide.Subtitle || 'اكتشف منتجاتنا المميزة'}</p>
    `;
    
    carouselItem.appendChild(heroSlide);
    carouselInner.appendChild(carouselItem);
    
    // Create indicator
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.setAttribute('data-bs-target', '#heroCarousel');
    indicator.setAttribute('data-bs-slide-to', index.toString());
    indicator.className = index === 0 ? 'active' : '';
    indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    
    indicators.appendChild(indicator);
  });
  
  // Reinitialize Bootstrap carousel
  const carousel = new bootstrap.Carousel(document.getElementById('heroCarousel'));
}

let appliedCoupon = null;
let discountPercent = 0;

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  const message = document.getElementById('coupon-message');

  if (coupons[code]) {
    appliedCoupon = code;
    discountPercent = coupons[code];
    message.textContent = `تم تطبيق كوبون الخصم (${discountPercent}%) بنجاح ✅`;
    message.style.color = 'green';
    message.style.display = 'block';
    document.getElementById('coupon-code').disabled = true;

    updateCart();
    updateOrderSummary();
  } else {
    appliedCoupon = null;
    discountPercent = 0;
    message.textContent = '❌ الكود غير صالح';
    message.style.color = 'red';
    message.style.display = 'block';
    updateCart();
  }
}

let userLocation = null;

function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const addressInput = document.getElementById('address');

        // أضف الرابط إلى خانة العنوان الحالية
        if (addressInput.value.trim()) {
          addressInput.value = ` - الموقع: ${locationURL}`;
        } else {
          addressInput.value = `الموقع: ${locationURL}`;
        }

        document.getElementById('location-error').style.display = 'none';
        alert("✅ تم إدراج موقعك في خانة العنوان");
      },
      error => {
        console.error("Location error:", error);
        document.getElementById('location-error').style.display = 'block';
      }
    );
  } else {
    alert("المتصفح لا يدعم تحديد الموقع");
  }
}

function shareProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

const productUrl = `${window.location.origin}/whatsapp-e-commerce/product-share.html?id=${product.id}`;
  const text = `شاهد هذا المنتج: ${product.name} - بسعر ${product.price} د.أ\n${productUrl}`;

  if (navigator.share) {
    navigator.share({
      title: product.name,
      text: text,
      url: productUrl
    }).catch(err => console.log("فشل المشاركة:", err));
  } else {
    const encodedText = encodeURIComponent(text);
    const whatsapp = `https://wa.me/?text=${encodedText}`;
    const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(encodedText)}`;

    const win = window.open("", "_blank", "width=320,height=360");
    win.document.write(`
      <html lang="ar" dir="rtl">
        <head>
          <title>${product.name}</title>
          <style>
            body { font-family: Arial; padding: 20px; text-align: center; }
            a, button { display: block; margin: 10px 0; text-decoration: none; font-size: 16px; }
          </style>
        </head>
        <body>
          <h3>${product.name}</h3>
          <a href="${whatsapp}" target="_blank">📱 واتساب</a>
          <a href="${facebook}" target="_blank">📘 فيسبوك</a>
          <button onclick="navigator.clipboard.writeText('${productUrl}').then(() => alert('✅ تم نسخ الرابط!'))">
            🔗 نسخ رابط المنتج
          </button>
        </body>
      </html>
    `);
    win.document.close();
  }
}


  function submitOrder() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const payment = document.getElementById('payment').value;
  const areaSelect = document.getElementById('delivery-area');
  const selectedArea = areaSelect.options[areaSelect.selectedIndex]?.text ;
  const email = document.getElementById("email").value || ""; // ← الجديد


  if (name && phone && address && payment && selectedArea !== 'اختر منطقة التوصيل' && email !== '') {
    const orderItems = cart.map(i => `- (${i.id}) ${i.name}${i.color ? ' - ' + i.color : ''} × ${i.quantity}`).join('\n');
    const totalBefore = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountAmount = discountPercent > 0 ? totalBefore * discountPercent / 100 : 0;
    const totalAfter = totalBefore - discountAmount + deliveryFee;

   const framedMessage = `
╔═══════════════ طلب شراء ═══════════════╗

${orderItems}

${appliedCoupon ? `كود الخصم: ${appliedCoupon} (${discountPercent}%)\n` : ''}

رسوم التوصيل: ${deliveryFee.toFixed(2)} د.أ
المجموع النهائي: ${totalAfter.toFixed(2)} د.أ

المنطقة: ${selectedArea}

الهاتف: ${phone}
العنوان: ${address}
${userLocation ? `📍 الموقع: ${userLocation}` : ''}

الدفع: ${payment}

╚════════════════════════════════════════╝
  `;

const whatsappURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(framedMessage)}`;
  // window.open(whatsappURL, '_blank');


fetch(CONFIG.ORDERS_API_URL, {
  method: "POST",
  body: JSON.stringify({
    name,
    phone,
    email,
    area: selectedArea,
    address,
    payment,
    items: orderItems,
    deliveryFee: deliveryFee.toFixed(2),
    coupon: appliedCoupon || '',
    discountAmount: discountAmount.toFixed(2),
    total: totalAfter.toFixed(2)
  }),
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    localStorage.removeItem("cart"); // تفريغ السلة
    closePopup('checkout-popup');
    window.location.href = "thankyou.html"; // التوجيه لصفحة الشكر
  } else {
    alert("❌ فشل إرسال الطلب");
  }
})
.catch(() => {
  alert("⚠️ حدث خطأ في الاتصال بالخادم");
});

    cart.length = 0;
    appliedCoupon = null;
    discountPercent = 0;
    deliveryFee = 0;

    document.getElementById('coupon-code').value = '';
    document.getElementById('coupon-code').disabled = false;
    document.getElementById('coupon-message').style.display = 'none';
    document.getElementById('delivery-area').selectedIndex = 0;
    document.getElementById('delivery-fee-message').textContent = '';

    updateCart();
    saveCart();
    closePopup('checkout-popup');

 

  } else {
    alert('يرجى تعبئة جميع الحقول واختيار المنطقة.');
  }
}

  displayProducts();
  updateCart(); // ✅ تأكد من تحميل السلة بعد فتح الصفحة
  loadCoupons(); // ✅ Load coupons when page loads
  loadHeroSlider(); // ✅ Load hero slider when page loads
  loadTopSellingProducts(); // ✅ Load top-selling products when page loads
  setInterval(refreshProducts, 10000); // يحدث كل دقيقة
  setInterval(loadCoupons, 30000); // ✅ Refresh coupons every 30 seconds
  setInterval(loadHeroSlider, 60000); // ✅ Refresh hero slider every minute
  setInterval(loadTopSellingProducts, 300000); // ✅ Refresh top-selling products every 5 minutes