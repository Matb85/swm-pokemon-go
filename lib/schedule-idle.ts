type IdleTask = () => void;

export function scheduleIdleTask(task: IdleTask): () => void {
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(task);
    return () => cancelIdleCallback(id);
  }

  const timeoutId = setTimeout(task, 1);
  return () => clearTimeout(timeoutId);
}
