import type { Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { ErrorLogger, Logger } from '../logger/logger';
import { Server } from 'socket.io';
import { Database } from '../data/database';
import { FileLogger } from '../logger/log-file';
import path from 'path'
import { ReorderServiceProxy } from '../logger/reorder.proxy.service';

export class ListHandler extends SocketHandler {
  //PATTERN:Observer
  private logger: Logger;
  private fileLogger: FileLogger;
  private errorLogger: ErrorLogger;

  constructor(io: Server, db: Database, reorderService: ReorderServiceProxy) {
    super(io, db, reorderService);
    this.logger = new Logger();
    this.fileLogger = new FileLogger(path.resolve(__dirname,'..', 'logger', 'log.json'));
    this.errorLogger = new ErrorLogger();
    this.logger.subscribe(this.fileLogger.logToFile.bind(this.fileLogger));
    this.logger.subscribeToErrors(this.errorLogger.logToConsole.bind(this.errorLogger));
  }

  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this))
    socket.on(ListEvent.RENAME, this.renameList.bind(this))
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex,
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();
    this.logger.log(`List ${name} created`)
  }

  private deleteList(listId: string){
    const lists = this.db.getData();
    const filteredLists = lists.filter(list => list.id !== listId)
    this.db.setData(filteredLists);
    this.updateLists();
    this.logger.log(`List ${listId} deleted`)
  }

  private renameList({ listId, name }: {listId: string, name: string}){
    const lists = this.db.getData();
    const selectedList = lists.find(list => list.id === listId);
    if(selectedList){
      this.logger.log(`List renamed: ${listId} to ${name}`);
      selectedList.changeListName(name)
      this.updateLists();
    }
    if (!selectedList) {
      this.logger.logError(`List with ID ${listId} not found!`);
    }
  }
}