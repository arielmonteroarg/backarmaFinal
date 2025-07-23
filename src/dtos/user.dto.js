export class UserDTO {
  constructor(user) {
    this.id        = user._id || user.id;
    this.firstName = user.first_name;
    this.lastName  = user.last_name;
    this.age       = user.age;
    this.email     = user.email;
    this.role      = user.role;
    this.cart      = user.cart;
    // nunca exponemos password
  }
}