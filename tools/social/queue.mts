/**
 * Eşzamanlılık sınırlı iş kuyruğu (basit p-limit muadili — yeni bağımlılık
 * gerektirmeyecek kadar küçük). Her iş kendi try/catch'ine sahiptir: biri
 * patlarsa kuyruğun geri kalanı durmaz, hata ledger'a "failed" olarak yazılır.
 */
export type QueueTask<T> = () => Promise<T>;

export async function runQueue<T>(
  tasks: QueueTask<T>[],
  concurrency: number,
  onSettled?: (index: number, result: { ok: true; value: T } | { ok: false; error: unknown }) => void,
): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (cursor < tasks.length) {
      const i = cursor++;
      try {
        const value = await tasks[i]();
        onSettled?.(i, { ok: true, value });
      } catch (error) {
        onSettled?.(i, { ok: false, error });
      }
    }
  });
  await Promise.all(workers);
}
