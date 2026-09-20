window.AppGuard.ready();
document.getElementById("boom").onclick = () => { setTimeout(() => { throw new Error("test explosion"); }, 0); };
document.getElementById("net").onclick = () => { fetch("http://127.0.0.1:1/x").catch(e => AppGuard.fail("network")); };
