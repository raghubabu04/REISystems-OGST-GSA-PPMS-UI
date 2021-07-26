let id = 0;
export default function createToast(options) {
  return {
    ...options,
    id: id++,
  };
}
