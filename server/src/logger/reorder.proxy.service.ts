import { List } from "../data/models/list";
import { ReorderService } from "../services/reorder.service";
import { FileLogger } from "./log-file";
import { Logger } from "./logger";
import path from 'path';


//PATTERN: Proxy
export class ReorderServiceProxy {
  private reorderService: ReorderService;
  private logger: Logger;
  private fileLogger: FileLogger;

  constructor(reorderService: ReorderService) {
    this.reorderService = reorderService;
    this.logger = new Logger();
    this.fileLogger = new FileLogger(path.resolve(__dirname, '..', 'logger', 'log.json'));
    this.logger.subscribe(this.fileLogger.logToFile.bind(this.fileLogger));
  }


  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const parameters = JSON.stringify({ items, startIndex, endIndex });
    this.logger.log(`Calling reorder method with parameters:${parameters}`)
    return this.reorderService.reorder(items, startIndex, endIndex);
  }


  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    const parameters = JSON.stringify({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    })
    this.logger.log(`Calling reorderCards method with parameters:'${parameters}`)
    return this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }
}