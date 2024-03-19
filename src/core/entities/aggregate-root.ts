import { DomainEvents } from '../events';
import { DomainEvent } from '../events/domain-event';
import Entity from './entity';

export default abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents() {
    this._domainEvents = [];
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) return true;

    if (entity.id === this.id) return true;

    return false;
  }
}
