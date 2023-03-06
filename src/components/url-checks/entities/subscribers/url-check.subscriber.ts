import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { PollingService } from 'src/components/polling/polling.service';
import {
  // EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  Connection,
  RemoveEvent,
} from 'typeorm';
import { UrlCheck } from '../url-check.entity';

// @EventSubscriber()
/**
 * I used the deperecated InjectConnection here as it's the only work around to inject a service
 * in a TypeORM subscriber and it's working fine
 */
@Injectable()
export class UrlCheckSubscriber implements EntitySubscriberInterface<UrlCheck> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private pollingService: PollingService,
  ) {
    connection.subscribers.push(this);
  }

  /**
   * Indicates that this subscriber only listen to UrlCheck events.
   */
  listenTo() {
    return UrlCheck;
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<UrlCheck>) {
    const urlCheck = event.entity;
    this.pollingService.addInterval(urlCheck);
  }

  /**
   * Called after entity removal.
   */
  beforeRemove(event: RemoveEvent<UrlCheck>) {
    const urlCheck = event.entity;
    this.pollingService.deleteInterval(`${urlCheck.id}`);
  }
}
