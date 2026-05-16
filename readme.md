# Screeps

## Install
Clone repository in the screeps folder ex: `Screeps/scripts/xx_xxx_xx_xxx___21025/default/`
```sh
npm install
```

## Compile
```sh
npm run build
```
This compiles `screeps.go` with GopherJS and prepends a Screeps runtime prelude that polyfills missing globals (`TextDecoder`, `setTimeout`, `clearTimeout`).

The output is written to `main.js`, which is the only file Screeps can access.
