/**
 * This module implements the interaction between the extension
 * and the UI/tabs via a specific list of methods that the extension
 * supports
 */
import { ErrorCode } from "./errors";

export enum Method {
  RecSetMode = "RecSetMode",
  RecStart = "RecStart",
  RecStop = "RecStop",
  BrowserTabChange = "BrowserTabChange",
  BrowserTabClosing = "BrowserTabClosing",
}

export enum MethodResult {
  Success = "Success",
  Failed = "Failed",
}

export interface Success {
  result: MethodResult.Success;
}

export interface Failure {
  result: MethodResult.Failed;
  errCode: ErrorCode;
  message: string;
}

/* Methods */
export enum RecMode {
  ScreenOnly = "ScreenOnly",
  ScreenAndCam = "ScreenAndCam",
}

export interface RecSetMode {
  method: Method.RecSetMode;
  params: {
    mode: RecMode;
  };
}

export interface RecStart {
  method: Method.RecStart;
}

export interface RecStop {
  method: Method.RecStop;
  params: {
    downloadUrl: string;
  };
}

export interface BrowserTabChange {
  method: Method.BrowserTabChange;
  params: {
    tabId: number;
  };
}

export interface BrowserTabClosing {
  method: Method.BrowserTabClosing;
  params: {
    tabId: number;
  };
}

/* Communication */
export type Message =
  | RecSetMode
  | RecStart
  | RecStop
  | BrowserTabChange
  | BrowserTabClosing;
export type MessageResponse = Success | Failure;

/** `UI<->background` communication channel */
export async function sendMessage(message: Message): Promise<MessageResponse> {
  return await chrome.runtime.sendMessage(message);
}
