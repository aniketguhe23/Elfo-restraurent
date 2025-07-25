import BackendUrl from "./BackendUrl";

export default function ProjectApiList(): Record<string, string> {
  const baseUrl = BackendUrl;
  const apiList = {
    // Resturant login
    apiRestaurantLogin: `${baseUrl}/api/restaurants/login`,

    // Orders
    apiGetAllOrders: `${baseUrl}/api/reports/orders`,
    apiGetAllOrdersForResturant: `${baseUrl}/api/reports/orders/get-by-restaurant`,
    apiGetOrdersById: `${baseUrl}/api/reports/orders-by-id`,
    apiUpdateStatusOrdersById: `${baseUrl}/api/reports/update-orders-status`,

    //Order Report
    apiOrderReportofResturant: `${baseUrl}/api/restaurants/getOrderStatusCounts`,
    apiTransactionReportofResturant: `${baseUrl}/api/reports/getTransactionReport`,

    // Refunds
    apiGetRefundsByResNo: `${baseUrl}/api/refunds/getRefundsByRestaurantId`,
    apiUpdateRefundsStatus: `${baseUrl}/api/refunds/updateRefundStatus`,

    //support
    apiGetContactSUpport: `${baseUrl}/api/support/getsupport`,
    apiUpdateSupportStatus: `${baseUrl}/api/support/updateSupport`,

    // resturant config

    // resturant Items
    apiGetResturantItems: `${baseUrl}/api/restaurant-items`,
    apiGetResturantAllMenu: `${baseUrl}/api/allMenu/getAllmenu`,
    apiResturantItemsAssign: `${baseUrl}/api/restaurant-items/assign`,

    // resturant api
    apiUpdateResturantStatus: `${baseUrl}/api/restaurants/update`,
    apiGetResturantData: `${baseUrl}/api/restaurants/getbyid`,

    //resturant hours
    apiPostResturantHours: `${baseUrl}/api/restaurants/createHours`,
    apiGettResturantHours: `${baseUrl}/api/restaurants/getHours`,
    apiUpdateResturantHours: `${baseUrl}/api/restaurants/updateHours`,

    //resturant General Settings
    apiCreateGeneralSettings: `${baseUrl}/api/restaurants/general-setting/create`,
    apiGetGeneralSettings: `${baseUrl}/api/restaurants/general-setting/getByRestNo`,
    apiUpdateGeneralSettings: `${baseUrl}/api/restaurants/general-setting/updateByRestNo`,

    //resturant Basic Settings
    apiCreateBasicSettings: `${baseUrl}/api/restaurants/basic-setting/create`,
    apiGetBasicSettings: `${baseUrl}/api/restaurants/basic-setting/getByRestNo`,
    apiUpdateBasicSettings: `${baseUrl}/api/restaurants/basic-setting/updateByRestNo`,

    //Chats
    apigetChatsRestConversations: `${baseUrl}/api/chat/restaurant`,
    apigetChatsRestMessages: `${baseUrl}/api/chat/conversation`,
    apipostChatsRestMessages: `${baseUrl}/api/chat/send`,
    
    //Dashboard
    apigetTotalSalesChart: `${baseUrl}/api/dashboard/getTotalSalesChart`,
    apigetTopSellingItems: `${baseUrl}/api/dashboard/getTopSellingItems`,
    apigetAverageOrderValue: `${baseUrl}/api/dashboard/getAverageOrderValue`,
    apigetTopRestaurantsByOrders: `${baseUrl}/api/dashboard/getTopRestaurantsByOrders`,
    apigetTotalCustomers: `${baseUrl}/api/dashboard/getTotalCustomers`,
    apigetSalesTypePieChart: `${baseUrl}/api/dashboard/getSalesTypePieChart`,


  };

  return apiList;
}
