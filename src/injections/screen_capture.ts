/**
 * This code implements the selection of the device to capture,
 * the screen capture itself, and the generation of the URL of the
 * result
 */
import { Method, RecStop, sendMessage } from "../rapidrec/communication";

async function startCapture(): Promise<void> {
  // NOTE: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
  const mediaStream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  });
  // NOTE: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
  const mimeTypes = ["video/mp4", "video/webm"];
  const mimeType = mimeTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType)
  );
  const mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType,
  });
  console.log("MediaRecorder created", mimeType);
  // FIXME: Remove `eslint-disable-line` and set specific array type
  const chunks: any[] = []; // eslint-disable-line
  // TODO: Add time slice later
  // const timeSlice = 1 * 1000;
  // mediaRecorder.start(timeSlice);
  mediaRecorder.start();
  mediaRecorder.addEventListener("dataavailable", (event) => {
    console.log("dataavailable");
    chunks.push(event.data);
  });
  mediaRecorder.addEventListener("stop", () => {
    console.log("Stop");
    console.log("Chunks", chunks);
    // NOTE: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    const blob = new Blob(chunks, {
      type: mimeType,
    });
    // NOTE: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    const url = URL.createObjectURL(blob);
    console.log("File url", url);
    sendMessage({
      method: Method.RecStop,
      params: {
        downloadUrl: url,
      },
    } as RecStop)
      .then((response) => {
        console.log("Downloaded", response);
      })
      .catch((err) => console.error("Can't download file", err));
  });
}

async function recordProcess(): Promise<void> {
  await startCapture();
}

recordProcess()
  .then(() => console.log("Process success"))
  .catch((err) => console.error("Can't start capture", err));