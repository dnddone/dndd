import { Button } from "@dndd/react";
import { useState } from "react";
import "./App.css";

const buttonStyle = (disabled: boolean, loading: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "8px 16px",
  border: "1px solid #333",
  borderRadius: 6,
  background: disabled ? "#eee" : loading ? "#ddd" : "#fff",
  cursor: disabled || loading ? "not-allowed" : "pointer",
});

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
          style={buttonStyle(disabled, loading)}
        >
          Click me ({clickCount})
        </Button>

        <Button loading={loading} disabled={disabled} style={buttonStyle(disabled, loading)}>
          <Button.Icon>{"←"}</Button.Icon>
          Icon left
        </Button>

        <Button loading={loading} disabled={disabled} style={buttonStyle(disabled, loading)}>
          Icon right
          <Button.Icon>{"→"}</Button.Icon>
        </Button>

        <Button loading={loading} disabled={disabled} style={buttonStyle(disabled, loading)}>
          <Button.Loader>
            <span className="spinner" />
          </Button.Loader>
          Loader (start)
        </Button>

        <Button loading={loading} disabled={disabled} style={buttonStyle(disabled, loading)}>
          <Button.Loader>
            <span className="spinner" />
          </Button.Loader>
          <Button.Label>Loader (replace)</Button.Label>
        </Button>
      </section>
    </main>
  );
};
