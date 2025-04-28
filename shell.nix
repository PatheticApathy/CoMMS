{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
	name = "Comms";
	
	buildInputs = [
		pkgs.neovim
		pkgs.nodejs
		pkgs.nodePackages.npm
		pkgs.bun
		pkgs.tmux
		pkgs.git
		pkgs.watchman
	];

shellHook = ''
	echo "Comms Bro"
'';
}
