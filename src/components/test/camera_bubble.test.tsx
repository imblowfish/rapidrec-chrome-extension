/**
 * @jest-environment jsdom
 */
// NOTE: https://testing-library.com/docs/
import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { builder, sender } from "../../messaging";
import CameraBubble from "../camera_bubble";

jest.mock("../../messaging", () => {
  const mocked: object = jest.createMockFromModule("../../messaging");
  return {
    ...mocked,
    builder: {
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
      showCameraBubble: jest.fn(),
      hideCameraBubble: jest.fn(),
    },
    sender: {
      send: jest.fn().mockResolvedValue({}),
    },
  };
});

beforeAll(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({}),
    },
  });
});

describe("CameraStream", () => {
  test("Avatar is 'div' if CameraRoundedIcon if camera source is unavailable", async () => {
    navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValueOnce({});

    const { container } = await act(() => {
      return render(<CameraBubble />);
    });

    expect(
      container.getElementsByClassName("MuiAvatar-circular")[0].tagName
    ).toEqual("DIV");
  });

  test("Avatar is 'video' if camera source is available", async () => {
    navigator.mediaDevices.getUserMedia = jest.fn().mockResolvedValue({});

    const { container } = await act(() => {
      return render(<CameraBubble />);
    });

    expect(
      container.getElementsByClassName("MuiAvatar-circular")[0].tagName
    ).toEqual("VIDEO");
  });
});

test("StartStopRecording", async () => {
  const { container } = await act(() => {
    return render(<CameraBubble />);
  });

  const buttonGroup = container.getElementsByClassName(
    "MuiButtonGroup-root"
  )[0];
  const [startStopRecording] =
    buttonGroup.getElementsByClassName("MuiButtonBase-root") ?? [];

  fireEvent.click(startStopRecording);

  expect(builder.startRecording).toHaveBeenCalled();
  expect(sender.send).toHaveBeenCalled();
  expect(
    startStopRecording.firstElementChild?.getAttribute("data-testid")
  ).toEqual("StopCircleRoundedIcon");
});