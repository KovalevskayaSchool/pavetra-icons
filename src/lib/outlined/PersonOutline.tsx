import * as React from "react";
export const PersonOutline = props => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}><g data-name="Layer 2"><g data-name="person"><rect width={24} height={24} opacity={0} /><path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" /><path d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z" /></g></g></svg>;
};
PersonOutline.displayName = "PersonOutline";
export default PersonOutline;