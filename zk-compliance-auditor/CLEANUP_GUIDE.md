# Cleanup Guide

This guide helps you clean up any stuck processes from the ZK Compliance Auditor demo.

## Quick Cleanup

If the demo gets stuck during cleanup, run:

```bash
npm run cleanup
```

This will automatically find and kill any remaining processes.

## Manual Cleanup

If the automatic cleanup doesn't work, you can manually kill processes:

### 1. Find processes by name
```bash
# Find client processes
pgrep -f "tsx src/index.ts"

# Find dashboard processes  
pgrep -f "next dev"
```

### 2. Kill processes by PID
```bash
# Replace PID with the actual process ID
kill -TERM <PID>

# Force kill if needed
kill -KILL <PID>
```

### 3. Kill processes by port
```bash
# Find processes using port 3000
lsof -ti:3000

# Kill processes on port 3000
kill -TERM $(lsof -ti:3000)
```

## Common Issues

### Demo gets stuck at "Cleaning up processes..."
- **Solution**: Press `Ctrl+C` to interrupt, then run `npm run cleanup`

### Dashboard won't start (port 3000 in use)
- **Solution**: Run `npm run cleanup` to kill existing processes

### Client process won't stop
- **Solution**: Use `kill -KILL <PID>` to force kill the process

## Prevention

To avoid cleanup issues:

1. **Use timeout**: Run demo with a timeout: `timeout 60s npm run demo`
2. **Interrupt gracefully**: Use `Ctrl+C` instead of closing the terminal
3. **Run cleanup**: Always run `npm run cleanup` after stopping the demo

## Process Types

The demo runs these processes:
- **Client**: `tsx src/index.ts` (ZK proof generation)
- **Dashboard**: `next dev` (React dashboard on port 3000)

Both processes are automatically managed by the demo orchestrator and cleanup script.
