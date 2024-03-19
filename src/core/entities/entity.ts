import UniqueEntityID from './unique-entity-id';

export default class Entity<T> {
  private _id: UniqueEntityID;
  protected props: T;

  protected constructor(props: T, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID(id);
    this.props = props;
  }

  get id() {
    return this._id;
  }
}
