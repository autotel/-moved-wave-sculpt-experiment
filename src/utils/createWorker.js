
const createWorker = (relativePath) => new Worker(new URL(relativePath, import.meta.url));
export default createWorker;