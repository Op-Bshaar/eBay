import { ReactNode } from "react";
import "./ErrorMessage.css"

interface ErrorProps { children:ReactNode, className?:string };
function ErrorMessage({children,className="" }:ErrorProps) {
    return (
        <div className={`${className} error-message`} role="alert" aria-live="assertive">
            {children }
        </div>
  );
}

export default ErrorMessage;