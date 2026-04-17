const loadedModules = new Set();
const moduleCache = new Map();

export async function importModuleCached(modulePath) {
  if (!moduleCache.has(modulePath)) {
    moduleCache.set(modulePath, import(modulePath));
  }

  return moduleCache.get(modulePath);
}

export function loadModuleOnFirstInteraction({ target, modulePath, initExport = "init" }) {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element) {
    return;
  }

  const load = async () => {
    if (loadedModules.has(modulePath)) {
      return;
    }

    loadedModules.add(modulePath);
    const module = await importModuleCached(modulePath);
    const init = module[initExport];

    if (typeof init === "function") {
      init();
    }
  };

  const events = [
    { name: "focusin", options: { once: true } },
    { name: "pointerdown", options: { once: true, passive: true } },
    { name: "submit", options: { once: true } },
    { name: "click", options: { once: true } },
    { name: "touchstart", options: { once: true, passive: true } }
  ];

  events.forEach(({ name, options }) => {
    element.addEventListener(name, load, options);
  });
}
