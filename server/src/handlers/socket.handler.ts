import { Server, Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { Database } from '../data/database';
import { ReorderServiceProxy } from '../logger/reorder.proxy.service';

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderServiceProxy;

  protected io: Server;

  public constructor(
    io: Server,
    db: Database,
    reorderService: ReorderServiceProxy
  ) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
