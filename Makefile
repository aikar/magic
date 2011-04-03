CWD = $(shell pwd -P)
NODE_WAF ?= node-waf
NODE_SRC_DIR ?= $(HOME)/src/node
CFLAGS ?= -g -Wall
CXXFLAGS ?= -g -Wall

MODULE_LIB_DIR = $(CWD)/lib
# We need to build position-independent code regardless of platform
CFLAGS += -fPIC
CXXFLAGS += -fPIC

# These variables are respected by waf if we export them
export CFLAGS CXXFLAGS

all: magic

#build libs then clean up - for NPM
makelibs: magic cleanbuild

# Build Magic
magic:
	cd src && \
		$(NODE_WAF) configure build && \
		cp ../build/default/magicBindings.node $(MODULE_LIB_DIR)
	
cleanbuild:
	rm -rf build src/.lock-wscript
	
clean: cleanbuild
	rm -f lib/whBindings.node
	
