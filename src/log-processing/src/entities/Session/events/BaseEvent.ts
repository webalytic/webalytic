export default class BaseEvent {
  private name: 'LogProcessedEventPayload'

  get event(): string {
    return this.name
  }
}
