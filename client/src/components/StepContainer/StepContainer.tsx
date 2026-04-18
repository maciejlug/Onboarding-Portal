import type { ReactNode } from "react";
import "./StepContainer.css";

type StepContainerProps = {
  children: ReactNode;
};

export default function StepContainer({ children }: StepContainerProps) {
  return <div className="step-container">{children}</div>;
}
