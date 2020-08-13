FROM parity/rust-builder:latest

ADD . /var/www/node-template

WORKDIR /var/www/node-template

RUN cargo build --release

CMD ./target/release/node-template --dev --ws-external