const CONFIG = {
  STORE_NAME: "متجر علي",
  WHATSAPP_NUMBER: "962781313782", // بدون +
  CURRENCY: "د.أ",
  
  // رابط Google Apps Script لقراءة المنتجات من Google Sheet
  PRODUCTS_API_URL: "https://script.google.com/macros/s/AKfycbyQ1eG5EynTHOpxJNFQBVJiAU5QTX880Y-jctfM1GS1UVkpOXOFZ_SEqI1GTAQ87UUPhA/exec",

  // رابط Google Apps Script لتخزين الطلبات في Google Sheet
  ORDERS_API_URL: "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec",

  // رسوم التوصيل حسب المناطق (تعديل حسب الحاجة)
  DELIVERY_FEES: {
    area1: 5,
    area2: 10,
    area3: 15
  },

  // الكوبونات المسموح بها (خصم بنسبة مئوية)
  COUPONS: {
    SAVE10: 10,
    VIP20: 20,
    SUPER30: 30
  }
};