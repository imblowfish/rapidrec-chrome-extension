import React from "react";
import ReactDOM from "react-dom/client";
import Draggable from "react-draggable";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { Id } from "../islands/enums";

// NOTE @imblowfish: https://www.npmjs.com/package/react-draggable
const Controls = () => {
  return (
    <Draggable>
      <Fab
        sx={{
          position: "fixed",
          bottom: "100px",
        }}
        color='primary'
        aria-label='add'
      >
        <AddIcon />
      </Fab>
    </Draggable>
  );
};

const body = document.getElementsByTagName("body")[0];
const div = document.createElement("div");
div.id = Id.CONTROLS;
if (body) {
  body.prepend(div);
}

const root = ReactDOM.createRoot(
  document.getElementById(div.id) as Element | DocumentFragment
);
root.render(<Controls />);