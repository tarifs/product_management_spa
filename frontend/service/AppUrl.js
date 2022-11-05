class AppUrl {
  static ApiBaseURL = process.env.NEXT_PUBLIC_API_SERVER_BASE_URL + "/api";

  //auth routes
  static userLogin = this.ApiBaseURL + "/login";
  static logout = this.ApiBaseURL + "/logout";
  static userRegister = this.ApiBaseURL + "/register";
  //categories
  static categories = this.ApiBaseURL + "/categories";
  //products
  static products = this.ApiBaseURL + "/products";
}

export default AppUrl;
