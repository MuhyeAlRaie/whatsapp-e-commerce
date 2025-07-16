const CONFIG = {
  STORE_NAME: "متجر علي",
  WHATSAPP_NUMBER: "962781313782", // بدون +
  CURRENCY: "د.أ",
  
  // رابط Google Apps Script لقراءة المنتجات من Google Sheet
  PRODUCTS_API_URL: "https://script.google.com/macros/s/AKfycbwzLk31B9W5GYm1Tmk1Ht7eDrQiBLxaMEzqq7pxxjBziHhK16H9VZhyYfGwwHPVHE8NBA/exec",

  // رابط Google Apps Script لتخزين الطلبات في Google Sheet
  ORDERS_API_URL: "https://script.google.com/macros/s/AKfycbzpc2GiJnynndf21z2dELxrWC9CIaV4DehMp5_5pLBRZtt1C80qTkF3uuOhUjYatbOa/exec",

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