const CONFIG = {
  STORE_NAME: "متجر علي",
  WHATSAPP_NUMBER: "962781313782", // بدون +
  CURRENCY: "د.أ",
  
  // رابط Google Apps Script لقراءة المنتجات من Google Sheet
  PRODUCTS_API_URL: "https://script.google.com/macros/s/AKfycbyWjt64bxMAJIoaV1FbAQoYEU0wHRFJ7EUFGgBq4YNWqBWKmAQFBTHCDDCBoLLla40gnQ/exec",

  // رابط Google Apps Script لتخزين الطلبات في Google Sheet
  ORDERS_API_URL: "https://script.google.com/macros/s/AKfycbzX6MUglLN46AlqD99QZ7LY31e3IWFx8BopRcfPewX0mO7gbHPzsFG-yTzVRQUqmGlH/exec",

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