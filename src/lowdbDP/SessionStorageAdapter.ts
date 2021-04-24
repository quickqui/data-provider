import Base from "lowdb/adapters/Base";
export class SessionStorage extends Base {
  read() {
    const data = sessionStorage.getItem(this.source);
    if (data) {
      return this.deserialize!(data);
    } else {
      sessionStorage.setItem(this.source, this.serialize!(this.defaultValue));
      return this.defaultValue;
    }
  }

  write(data: object): void {
    sessionStorage.setItem(this.source, this.serialize!(data));
  }
}
