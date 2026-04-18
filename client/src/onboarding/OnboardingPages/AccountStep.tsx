type AccountFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type AccountStepProps = {
  accountData: AccountFormData;
  setAccountData: React.Dispatch<React.SetStateAction<AccountFormData>>;
  onNext: () => void;
  canGoNext: boolean;
};

export default function AccountStep({
  accountData,
  setAccountData,
  onNext,
  canGoNext,
}: AccountStepProps) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <h1>Create account</h1>
        <p>Start your onboarding by creating an account.</p>
      </div>

      <div className="onboarding-step__body">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={accountData.email}
            onChange={(event) =>
              setAccountData((prev) => ({
                ...prev,
                email: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={accountData.password}
            onChange={(event) =>
              setAccountData((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            value={accountData.confirmPassword}
            onChange={(event) =>
              setAccountData((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
          />
        </div>

        {accountData.confirmPassword &&
          accountData.password !== accountData.confirmPassword && (
            <p className="form-error">Passwords do not match.</p>
          )}
      </div>

      <div className="onboarding-step__actions">
        <button onClick={onNext} disabled={!canGoNext}>
          Next
        </button>
      </div>
    </div>
  );
}
