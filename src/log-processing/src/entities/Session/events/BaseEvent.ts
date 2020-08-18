export default class BaseEvent {
  private name = 'LogProcessedEvent'

  get event(): string {
    return this.name
  }
}
