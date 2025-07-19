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

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function displayProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => (currentFilter === 'all' || p.category === currentFilter) && p.name.toLowerCase().includes(search));
    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'col-6 col-md-3';

     const availableText = product.available ? '' : '<div class="text-danger fw-bold">غير متوفر حالياً</div>';

const addButton = product.available
  ? `<button class="btn btn-sm btn-outline-primary" onclick='addToCart(${product.id})'>أضف إلى السلة</button>`
  : `<button class="btn btn-sm btn-secondary" disabled>غير متوفر</button>`;

card.innerHTML = `
  <div class="card product-card">
    <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">${product.shortDesc}</p>
     <p class="card-text text-danger fw-bold">
  $${product.price}
  ${Number(product.oldPrice) > 0 ? `<span class="ms-2 text-muted text-decoration-line-through">$${product.oldPrice}</span>` : ''}
</p>
      ${availableText}
      ${addButton}
      <button class="btn btn-sm btn-link" onclick='showProductPopup(${product.id})'>عرض التفاصيل</button>
      <button class="btn btn-sm btn-outline-secondary" onclick="shareProduct(${product.id})">
  📤 مشاركة
</button>
    </div>
  </div>`;
      container.appendChild(card);
    });
  }

  function setFilter(filter) {
    currentFilter = filter;
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


  const coupons = {
  "SAVE10": 10, 
  "OFF20": 20, 
  "VIP30": 30  
};

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
  setInterval(refreshProducts, 10000); // يحدث كل دقيقة