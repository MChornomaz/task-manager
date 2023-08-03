import * as fs from 'fs';

interface LogEntry {
  timestamp: string;
  message: string;
}

//PATTERN:Observer

export class FileLogger {
  private logFilePath: string;

  constructor(logFilePath: string) {
    this.logFilePath = logFilePath;
  }

  private readLogsFromFile(): LogEntry[] {
    try {
      const fileContent = fs.readFileSync(this.logFilePath, 'utf-8');
      return JSON.parse(fileContent) as LogEntry[];
    } catch (error) {
      console.error('Error reading logs from file:', error);
      return [];
    }
  }

  private writeLogsToFile(logs: LogEntry[]): void {
    try {
      fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing logs to file:', error);
    }
  }

  public logToFile(message: string) {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleString(),
      message,
    };

    const existingLogs = this.readLogsFromFile();
    const updatedLogs = [...existingLogs, newLog];

    this.writeLogsToFile(updatedLogs);
  }
}