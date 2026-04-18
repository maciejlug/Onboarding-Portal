type ProfileStepProps = {
  onNext: () => void;
};

export default function ProfileStep({ onNext }: ProfileStepProps) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <h1>Profile details</h1>
        <p>This is the next step of onboarding.</p>
      </div>

      <div className="onboarding-step__body">
        <p>Step 2 placeholder</p>
      </div>

      <div className="onboarding-step__actions">
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
