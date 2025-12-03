#!/usr/bin/env node
const { spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
    const ifaces = os.networkInterfaces();
    for (const name of Object.keys(ifaces)) {
        for (const iface of ifaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
}

const ip = getLocalIP();

const env = Object.assign({}, process.env, { HOST: '0.0.0.0' });
const args = ['next', 'dev', '--hostname', '0.0.0.0'];

// Spawn next and intercept output so we can rewrite the Local/Network lines.
const proc = spawn('npx', args, { stdio: ['inherit', 'pipe', 'pipe'], env });

let stdoutBuf = '';
let printedOverride = false;

function tryRewriteLine(line) {
    // If we've already printed our override, skip the original Local/Network lines
    if (printedOverride) {
        if (/[-\s]*Local:/.test(line) || /[-\s]*Network:/.test(line)) return; // drop duplicates
        console.log(line);
        return;
    }

    // Look for a URL with port (e.g. http://192.168.0.229:3001)
    const urlMatch = line.match(/https?:\/\/[^\s:]+:(\d+)/);
    if (urlMatch && /Local:|Network:/.test(line)) {
        const port = urlMatch[1] || '3000';
        // Print our two-line version: Local => localhost, Network => detected IP
        console.log(`  - Local:        http://localhost:${port}`);
        if (ip) {
            console.log(`  - Network:      http://${ip}:${port}`);
        }
        printedOverride = true;
        return;
    }

    // Fallback: just print the line
    console.log(line);
}

proc.stdout.on('data', chunk => {
    stdoutBuf += chunk.toString();
    const parts = stdoutBuf.split(/\r?\n/);
    stdoutBuf = parts.pop();
    parts.forEach(tryRewriteLine);
});

proc.stderr.on('data', chunk => {
    // Pass through stderr lines unchanged
    process.stderr.write(chunk);
});

proc.on('exit', code => process.exit(code));
proc.on('error', err => {
    console.error('Failed to start Next dev:', err);
    process.exit(1);
});
