import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "wired-button": any;
      "wired-card": any;
    }
  }
}
