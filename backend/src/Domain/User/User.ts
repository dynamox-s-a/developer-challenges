export default class User {
  private id: string | undefined;
  private name: string;
  private email: string;
  private password: string | undefined;

  constructor(
    id: string | undefined,
    name: string,
    email: string,
    password: string | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public setId(id: string) {
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public getEmail() {
    return this.email;
  }
  
  public setPassword(password: string) {
    this.password = password;
  }

  public getPassword() {
    return this.password;
  }
  
}
