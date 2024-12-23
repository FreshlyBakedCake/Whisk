{
  description = "Convection, a git forge with code review you can be a fan of";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    fenix,
    ...
  }@inputs:
    (flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [fenix.overlays.default];
      };
      toolchain = pkgs.fenix.complete;
      inherit (pkgs) lib;
      connectorPackages = [
        pkgs.pkg-config
      ] ++ (with toolchain; [
        cargo
        rustc
        rust-src
        clippy
        rustfmt
      ]);
      frontendPackages = [
        pkgs.nodejs-slim_23
        pkgs.pnpm
      ];
    in {

      devShells.connector = pkgs.mkShell {
        packages = connectorPackages;
        enterShell = ''
          export RUST_SRC_PATH=${toolchain.rust-src}/lib/rustlib/src/rust/library
        '';
      };

      devShells.frontend = pkgs.mkShell {
        packages = frontendPackages;
      };

      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.reuse
        ] ++ frontendPackages ++ connectorPackages;

        enterShell = ''
          export RUST_SRC_PATH=${toolchain.rust-src}/lib/rustlib/src/rust/library
        '';
      };

      packages = let
        version = "2024.12.23+0";
      in {
        frontend = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "whisk-frontend";
          inherit version;

          src = ./frontend;

          nativeBuildInputs = [
            pkgs.nodejs
            pkgs.pnpm.configHook
          ];

          pnpmDeps = pkgs.pnpm.fetchDeps {
            inherit (finalAttrs) pname version src;
            hash = "sha256-ztUcfCQtlL473hnCL8yhhIMtUs4chiwsT9Rg5/a2tTc=";
          };
        });

        connector = let
          toolchain = fenix.packages.${system}.minimal.toolchain;
          pkgs = nixpkgs.legacyPackages.${system};
        in (pkgs.makeRustPlatform {
          cargo = toolchain;
          rustc = toolchain;
        }).buildRustPackage {
          pname = "whisk-connector";
          inherit version;

          src = ./connector;

          cargoLock.lockFile = ./connector/Cargo.lock;
        };
      };
    }));
}

