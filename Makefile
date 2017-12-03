all: mkdir run-gccx compile-cpp compile-wasm webpack
	@echo Please navigate to ./out/dist/index.html

clean:
	rm -rf out/

#-------------------------------------------------------------------------------

includes += "node_modules/asm-dom/cpp/"

files += node_modules/asm-dom/cpp/asm-dom.cpp
files += out/gccx/index.cpp

webasm_options += -O3
webasm_options += --bind
webasm_options += --memory-init-file 0
webasm_options += --llvm-lto 3
webasm_options += --llvm-opts 3
webasm_options += --js-opts 1
webasm_options += --closure 1
webasm_options += --pre-js src/glue/prefix.js
webasm_options += --post-js src/glue/postfix.js
webasm_options += -s ALLOW_MEMORY_GROWTH=1
webasm_options += -s AGGRESSIVE_VARIABLE_ELIMINATION=1
webasm_options += -s ABORTING_MALLOC=1
webasm_options += -s NO_EXIT_RUNTIME=1
webasm_options += -s NO_FILESYSTEM=1
webasm_options += -s DISABLE_EXCEPTION_CATCHING=2
webasm_options += -s BINARYEN=1

#-------------------------------------------------------------------------------

mkdir:
	mkdir -p out/dist
	mkdir -p out/gccx
	mkdir -p out/compiled/

run-gccx:
	npm run gccx

compile-cpp:
	em++ \
		-O3 \
		-Wall \
		-Werror \
		--bind \
		-I $(includes) \
		$(files) \
		-o out/gccx/app.bc

compile-wasm:
	em++ \
		$(webasm_options) \
		out/gccx/app.bc \
		-o out/compiled/app.js

webpack:
	webpack --env.production
