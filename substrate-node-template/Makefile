restart: build purge run
rerun: purge run

run:
	RUST_LOG=warn;babe=debug target/debug/node-template --dev -d target/substrate --execution=Both --ws-external -lruntime=debug

run-wasm:
	target/debug/node-template --dev -d target/node-template --execution=Wasm --ws-external -lruntime=debug

purge:
	-target/debug/node-template purge-chain --dev -y -d target/substrate
	-target/debug/node-template purge-chain --chain local -y -d target/alice
	-target/debug/node-template purge-chain --chain local -y -d target/bob

build:
	WASM_BUILD_TYPE=release cargo build

alice: purge
	RUST_LOG=warn;babe=debug target/debug/node-template -d target/alice \
		--node-key 0000000000000000000000000000000000000000000000000000000000000001 \
		--prometheus-port 9615 \
		--rpc-cors=all \
		--rpc-methods=Unsafe \
		--unsafe-ws-external \
		--chain local \
		--alice \
		--port 30333 \
		--ws-port 9944 \
		--rpc-port 9933 \
		--telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
		--validator --name vpp-test-node01

bob:
	RUST_LOG=warn;babe=debug target/debug/node-template -d target/bob \
		--node-key 0000000000000000000000000000000000000000000000000000000000000002 \
		--prometheus-port 9616 \
		--rpc-cors=all \
		--rpc-methods=Unsafe \
		--unsafe-ws-external \
		--chain local \
		--bob \
		--port 30334 \
		--ws-port 9945 \
		--rpc-port 9934 \
		--telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
		--validator  --name vpp-test-node02 \
		--bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp

check:
	SKIP_WASM_BUILD= cargo check

check-debug:
	RUSTFLAGS="-Z macro-backtrace" BUILD_DUMMY_WASM_BINARY= cargo +nightly check

check-dummy:
	BUILD_DUMMY_WASM_BINARY= cargo check

check-wasm:
	WASM_BUILD_TYPE=release cargo check

toolchain:
	./scripts/init.sh

init: toolchain submodule

submodule:
	git submodule update --init --recursive

release:
	WASM_BUILD_TYPE=release cargo build --release

