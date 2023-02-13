export default class InvalidDescriptionError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}