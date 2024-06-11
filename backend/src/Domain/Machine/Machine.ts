export default class Machine {
  private id: string;
  private name: string;
  private type: string;
  private userId: string;

  constructor(
    id: string,
    name: string,
    type: string,
    userId: string,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.userId = userId;
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

  public setType(type: string) {
    this.type = type;
  }

  public getType() {
    return this.type;
  }
  
  public setUserId(userId: string) {
    this.userId = userId;
  }

  public getUserId() {
    return this.userId;
  }
  
}
