/**
 * jsdom doesn't implement HTMLDialogElement's imperative methods
 * (https://github.com/jsdom/jsdom/issues/3294) — it does support the `open`
 * property/attribute reflection, just not `showModal()`/`close()` actually
 * toggling it. Polyfilled here, feature-detected, so this never touches a
 * real browser: only jsdom is missing these.
 */
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
}

if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    const wasOpen = this.open;

    this.open = false;

    if (wasOpen) {
      this.dispatchEvent(new Event("close"));
    }
  };
}
