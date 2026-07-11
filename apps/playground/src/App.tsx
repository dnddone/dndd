import { Button } from "@dndd/react";
import { useState } from "react";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 32, maxWidth: 480 }}>
      <h1>@dndd/react playground</h1>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={loading}
            onChange={(event) => setLoading(event.target.checked)}
          />
          loading
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(event) => setDisabled(event.target.checked)}
          />
          disabled
        </label>

        <Button
          loading={loading}
          disabled={disabled}
          onClick={() => setClickCount((count) => count + 1)}
          style={{
            padding: "8px 16px",
            border: "1px solid #333",
            borderRadius: 6,
            background: disabled ? "#eee" : loading ? "#ddd" : "#fff",
            cursor: disabled || loading ? "not-allowed" : "pointer",
          }}
        >
          Click me ({clickCount})
        </Button>
      </section>
    </main>
  );
};
