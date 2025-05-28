// src/components/NameInput.js
import { useState } from "react";
import { withLDConsumer } from "launchdarkly-react-client-sdk";

const EnterName = ({ ldClient }) => {
  const [name, setName] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!ldClient) return;

    const currentContext = ldClient.getUser();

    // Check if the name is unchanged
    if (
      (trimmedName && currentContext.name === trimmedName) ||
      (!trimmedName && !currentContext.name)
    ) {
      setSubmittedMessage("⚠️ Name is unchanged.");
      return;
    }

    const updatedContext = {
      ...currentContext,
      name: trimmedName,
    };

    if (trimmedName) {
      updatedContext.name = trimmedName;
    } else {
      delete updatedContext.name;
    }

    ldClient.identify(updatedContext, null, () => {
      console.log("New context's flags available", updatedContext);
    });

    // Set appropriate message
    if (trimmedName) {
      setSubmittedMessage(`✅ You entered: ${trimmedName}`);
    } else {
      setSubmittedMessage("⚠️ You didn't enter a name!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          What's your name?{" "}<br/>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {submittedMessage && (
        <p style={{ marginTop: "1em" }}>{submittedMessage}</p>
      )}
    </div>
  );
};

export default withLDConsumer()(EnterName);
