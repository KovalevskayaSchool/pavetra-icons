import * as React from "react";
export const CircleOutline = props => {
  return <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}><g data-name="Layer 2"><g data-name="radio-button-on" width="1em" height="1em" fill="currentColor"><rect width={24} height={24} opacity={0} /><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z" /></g></g></svg>;
};
CircleOutline.displayName = "CircleOutline";
export default CircleOutline;