PHONY: dist
SHELL := /bin/bash

#  ________  ________  ___  ___  ________           ________  ________  ________  ___
# |\   __  \|\   __  \|\  \|\  \|\   ____\         |\   __  \|\   __  \|\   __  \|\  \
# \ \  \|\  \ \  \|\  \ \  \\\  \ \  \___|_        \ \  \|\  \ \  \|\  \ \  \|\  \ \  \
#  \ \  \\\  \ \   ____\ \  \\\  \ \_____  \        \ \   ____\ \  \\\  \ \  \\\  \ \  \
#   \ \  \\\  \ \  \___|\ \  \\\  \|____|\  \        \ \  \___|\ \  \\\  \ \  \\\  \ \  \____^
#    \ \_______\ \__\    \ \_______\____\_\  \        \ \__\    \ \_______\ \_______\ \_______\
#     \|_______|\|__|     \|_______|\_________\        \|__|     \|_______|\|_______|\|_______|
#                                  \|_________|

# Builds package for distribution
#
dist:
	npm run clean
	npm run build

# Publishes package into npm
#
publish: dist
	npm publish --access public

# Generates docs
#
doc:
	rm -rf docs
	rm -rf book/docs
	# Used for building all files
	npm run doc
	cp -r docs book/docs
	# Used for building only OpusPool(with TOC)
	npm run doc:opuspool
	cp -r docs/classes/OpusPool.md book/docs/classes/OpusPool.md

# Runs local Gitbook instance
#
book: doc
	source /usr/share/nvm/nvm.sh && nvm exec 10.24.1 node ~/node_modules/gitbook-cli serve
