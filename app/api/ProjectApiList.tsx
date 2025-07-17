import BackendUrl from './BackendUrl';

export default function ProjectApiList(): Record<string, string> {
  const baseUrl = BackendUrl;
  const apiList = {
    
    // Resturant login
    apiRestaurantLogin: `${baseUrl}/api/restaurants/login`,
    
    
  };

  return apiList;
}
