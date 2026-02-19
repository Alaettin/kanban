const apps = [];

function register(appDef) {
  if (!appDef || !appDef.id || !appDef.name || !appDef.path) {
    throw new Error("App registration requires id, name, and path");
  }
  const existing = apps.findIndex((a) => a.id === appDef.id);
  if (existing >= 0) {
    apps[existing] = appDef;
  } else {
    apps.push(appDef);
  }
}

function getApps() {
  return apps.map((a) => ({ ...a }));
}

function getApp(id) {
  return apps.find((a) => a.id === id) || null;
}

module.exports = { register, getApps, getApp };
