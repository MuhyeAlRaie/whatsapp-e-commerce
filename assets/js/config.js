const CONFIG = {
  STORE_NAME: "متجر علي",
  WHATSAPP_NUMBER: "962781313782", // بدون +
  CURRENCY: "د.أ",
  
  // رابط Google Apps Script لقراءة المنتجات من Google Sheet
  PRODUCTS_API_URL: "https://script.google.com/macros/s/AKfycbyTWZ4NdXupMvjEhGclyqLgD_azy_00aDicEtRf_O4_1noUr2N-PfxDeVup8OXViQxgvw/exec",

  // رابط Google Apps Script لتخزين الطلبات في Google Sheet
  ORDERS_API_URL: "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec",

  // رابط Google Apps Script لإدارة الكوبونات من Google Sheet
  COUPONS_API_URL: "https://script.google.com/macros/s/AKfycbwzGdb3o1wNNDzuV4AP0Pog9wSlBhqPvznqapsnYOaKhBGRt2edyaN0iHA6bB6EzXTU/exec", 

 
  // رابط Google Apps Script لتحليل المنتجات الأكثر مبيعاً من Google Sheet (using Orders API)
  TOP_SELLING_API_URL: "https://script.google.com/macros/s/AKfycbyDGk9Bd2yynaBQAKmsvQYH9clQTwQQvUpv9J5cP5UZ_zZJ7AjpHmaWkAZDI5TekFzT/exec",

  DELIVERY_FEE_API_URL: "https://script.google.com/macros/s/AKfycbz4ThX4G_E2TmgWyvd_TPixtBYE_FaMpAV-wUe7Qw9HlBE8O9bZ_GWDjzsGEdDn8HEB0g/exec", 


 // DELIVERY_FEES will be loaded dynamically from DELIVERY_FEE_API_URL
  DELIVERY_FEES: {},


  // الكوبونات المسموح بها (خصم بنسبة مئوية) - سيتم استبدالها بالبيانات من Google Sheets
  COUPONS: {
    
  }
};