export enum Method {
  StartRecording,
  StopRecording,
  CancelRecording,
  DownloadRecording,

  ShowCameraBubble,
  HideCameraBubble,

  AllowMicrophone,
  DisallowMicrophone,

  BrowserTabChange,
  BrowserTabClosing,
  BrowserTabUpdated,
  TabStopMediaRecorder,
  OpenUserActiveWindow,
}

export type DownloadRecordingArgs = { downloadUrl: string };
export type BrowserTabChangeArgs = { newTabId: number };
export type BrowserTabClosingArgs = { closedTabId: number };

export type RecordingInProgressResult = boolean;
export type IsCameraBubbleVisibleResult = boolean;
export type IsMicrophoneAllowedResult = boolean;

export type MethodArgs =
  | DownloadRecordingArgs
  | BrowserTabChangeArgs
  | BrowserTabClosingArgs
  | Record<string, never>;

export type MethodResult =
  | RecordingInProgressResult
  | IsCameraBubbleVisibleResult
  | IsMicrophoneAllowedResult
  | "OK";

export interface Message {
  method: Method;
  args?: MethodArgs;
}
export type MessageResponse = {
  result?: MethodResult;
  error?: string;
};

function buildStartRecording(): Message {
  return {
    method: Method.StartRecording,
  };
}

function buildStopRecording(): Message {
  return {
    method: Method.StopRecording,
  };
}

function buildCancelRecording(): Message {
  return {
    method: Method.CancelRecording,
  };
}

function buildDownloadRecording(downloadUrl: string): Message {
  return {
    method: Method.DownloadRecording,
    args: {
      downloadUrl,
    },
  };
}

function buildShowCameraBubble(): Message {
  return {
    method: Method.ShowCameraBubble,
  };
}

function buildHideCameraBubble(): Message {
  return {
    method: Method.HideCameraBubble,
  };
}

function buildAllowMicrophone(): Message {
  return {
    method: Method.AllowMicrophone,
  };
}

function buildDisallowMicrophone(): Message {
  return {
    method: Method.DisallowMicrophone,
  };
}

function buildBrowserTabChange(newTabId: number): Message {
  return {
    method: Method.BrowserTabChange,
    args: {
      newTabId,
    },
  };
}

function buildBrowserTabClosing(closedTabId: number): Message {
  return {
    method: Method.BrowserTabClosing,
    args: {
      closedTabId,
    },
  };
}

function buildBrowserTabUpdated(): Message {
  return {
    method: Method.BrowserTabUpdated,
  };
}

function buildTabStopMediaRecorder(): Message {
  return {
    method: Method.TabStopMediaRecorder,
  };
}

function buildOpenUserActiveWindow(): Message {
  return {
    method: Method.OpenUserActiveWindow,
  };
}

function buildOkResponse(result: MethodResult = "OK"): MessageResponse {
  return {
    result,
  };
}

function buildErrorResponse(err: Error): MessageResponse {
  return {
    error: err.message,
  };
}

export const builder = {
  startRecording: buildStartRecording,
  stopRecording: buildStopRecording,
  cancelRecording: buildCancelRecording,
  downloadRecording: buildDownloadRecording,
  showCameraBubble: buildShowCameraBubble,
  hideCameraBubble: buildHideCameraBubble,
  allowMicrophone: buildAllowMicrophone,
  disallowMicrophone: buildDisallowMicrophone,
  tabStopMediaRecorder: buildTabStopMediaRecorder,
  openUserActiveWindow: buildOpenUserActiveWindow,
  event: {
    browserTabChange: buildBrowserTabChange,
    browserTabClosing: buildBrowserTabClosing,
    browserTabUpdated: buildBrowserTabUpdated,
  },
  response: {
    ok: buildOkResponse,
    error: buildErrorResponse,
  },
};

export const sender = {
  send: (message: Message, tabId?: number): Promise<MessageResponse> => {
    if (!tabId) {
      return chrome.runtime.sendMessage(message);
    }
    console.log(`Send message to tab ${tabId}`);
    return chrome.tabs.sendMessage(tabId, message);
  },
};
