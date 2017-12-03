import '../../../node_modules/asm-dom/cpp/'
import "../index.css"


(()=> {

  // If WebAssembly is not enable, warn the user about it.
  if ('WebAssembly' in window) {
    console.log("WebAssembly is available");
  } else {
    alert("This require WebAssembly");
    return;
  }

  // Import the WebAssembly module.
  import('../../compiled/app.wasm').then(wasm_bytes => {
    const config = {
      wasmBinary : new Uint8Array(wasm_bytes)
    }
    import('../../compiled/app.js').then(module => module(config));
  })

})();
