export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateName = (name) => {
    return name.trim().length >= 2;
  };
  
  export const validateFuelOrder = (order) => {
    return order.location && order.quantity > 0;
  };
  
  export const validateMechRequest = (request) => {
    return request.services.length > 0 && request.location;
  };