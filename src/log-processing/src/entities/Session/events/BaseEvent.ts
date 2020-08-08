export default class BaseEvent {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  get event(): string {
    return this.name
  }
}
