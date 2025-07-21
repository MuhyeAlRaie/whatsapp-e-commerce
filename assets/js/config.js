const CONFIG = {
  STORE_NAME: "متجر علي",
  WHATSAPP_NUMBER: "962781313782", // بدون +
  CURRENCY: "د.أ",
  
  // رابط Google Apps Script لقراءة المنتجات من Google Sheet
  PRODUCTS_API_URL: "https://script.google.com/macros/s/AKfycbyTWZ4NdXupMvjEhGclyqLgD_azy_00aDicEtRf_O4_1noUr2N-PfxDeVup8OXViQxgvw/exec",

  // رابط Google Apps Script لتخزين الطلبات في Google Sheet
  ORDERS_API_URL: "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec",

  // رابط Google Apps Script لإدارة الكوبونات من Google Sheet
  COUPONS_API_URL: "https://script.google.com/macros/s/AKfycbwzGdb3o1wNNDzuV4AP0Pog9wSlBhqPvznqapsnYOaKhBGRt2edyaN0iHA6bB6EzXTU/exec", // ← Replace with your actual coupon API URL

  // رابط Google Apps Script لإدارة صور البانر من Google Sheet
  HERO_SLIDER_API_URL: "https://script.google.com/macros/s/AKfycbx2bOYD5aMCYvgcKmmpfLVdQctrKsttXSYMNCjfUNJj1tyttY0CM7mVCNPnNRMJYUFf/exec", // ← Replace with your actual hero slider API URL

  // رابط Google Apps Script لتحليل المنتجات الأكثر مبيعاً من Google Sheet (using Orders API)
  TOP_SELLING_API_URL: "https://script.google.com/macros/s/AKfycbyDGk9Bd2yynaBQAKmsvQYH9clQTwQQvUpv9J5cP5UZ_zZJ7AjpHmaWkAZDI5TekFzT/exec",

  // رسوم التوصيل حسب المناطق (تعديل حسب الحاجة)
  DELIVERY_FEES: {
    area1: 5,
    area2: 10,
    area3: 15
  },

  // الكوبونات المسموح بها (خصم بنسبة مئوية) - سيتم استبدالها بالبيانات من Google Sheets
  COUPONS: {
    SAVE10: 10,
    VIP20: 20,
    SUPER30: 30
  }
};