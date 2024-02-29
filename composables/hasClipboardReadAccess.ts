export default async function hasClipboardReadAccess() {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: "clipboard-read",
      allowWithoutGesture: false,
    });

    // Will be 'granted', 'denied' or 'prompt':
    const access = permissionStatus.state;

    if (access === "prompt") {
      await navigator.clipboard.read();
      return true;
    }

    return access === "granted";
  } catch {
    return false;
  }
}
