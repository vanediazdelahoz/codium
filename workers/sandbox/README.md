# Sandbox helpers (demo)

This folder contains a tiny demo of a safe execution approach using ephemeral Docker containers.

Important: this is only a demo. DO NOT treat this as a complete security solution. For production, prefer:

- nsjail (Google's nsjail) or `isolate` for strong chroot/namespace-based sandboxing
- run user code in short-lived containers using a separate runner process and the Docker socket (careful: this requires careful hardening)
- use gVisor or other container runtimes offering stronger isolation

What the demo script does

`execute_in_isolated_container.sh` compiles and runs a given C++ file in an ephemeral `gcc` container with basic resource limits (cpus, memory, pids) and mounts the current folder read-only. It's a pragmatic step to isolate execution but has limitations:

- requires worker to have access to Docker socket (`/var/run/docker.sock`)
- not sufficient to avoid container escape on a dedicated host
- doesn't limit syscalls (for that use nsjail or seccomp profiles)

Recommendations

1. Use a dedicated execution sandbox like nsjail / isolate. These give fine-grained syscall filtering, filesystem chroot, and process control.
2. If using Docker-based sandboxes, run them under a separate runtime and don't mount the host socket directly into untrusted processes. Use a runner service that manages the container lifecycle.
3. Add monitoring and strict resource limits (CPU, memory, pids, disk, and wall-clock timeout) for each submission.
4. Audit any approach carefully before allowing untrusted code execution.
