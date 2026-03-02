// BMEcat Reader — no backend routes needed (client-side only)

async function initBmecatReaderTables() {
  // No database tables required
}

function mountRoutes(/* router */) {
  // No API routes — all parsing happens in the browser
}

module.exports = { initBmecatReaderTables, mountRoutes };
