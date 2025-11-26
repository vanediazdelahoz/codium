#!/usr/bin/env bash
# Simple helper to compile / run C++ code in an isolated short-lived container
# This is a safety demo: it *doesn't* replace a proper sandbox (nsjail/isolate/gvisor)

set -euo pipefail

SRC_FILE=${1:-main.cpp}
TIMEOUT=${2:-3s}  # maximum allowed runtime
MEM_LIMIT=${3:-200m}
CPUS=${4:-0.5}

if [[ ! -f "$SRC_FILE" ]]; then
  echo "Source file doesn't exist: $SRC_FILE" >&2
  exit 2
fi

CONTAINER_IMAGE=gcc:12

# Run compilation and execution in a temporary container with strict limits.
# Note: requires access to Docker socket from the worker (security implications)

docker run --rm \
  --cpus="$CPUS" \
  --memory="$MEM_LIMIT" \
  --pids-limit=64 \
  -v "$(pwd)":/sandbox:ro \
  -w /sandbox \
  "$CONTAINER_IMAGE" \
  /bin/sh -c "g++ -O2 -std=c++17 -o /tmp/program '$SRC_FILE' && timeout $TIMEOUT /tmp/program"

# The above mounts the current directory read-only into the container (so no persistent writes)
# and limits CPU/memory/pids. This is a simple example and NOT suitable for production sandboxing.

exit 0
