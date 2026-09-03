/*
 * INTENTIONAL TEST FIXTURE ONLY.
 * This file is not imported by the SLA Guard app and must remain confined to
 * test-fixtures for DPSA/static-analysis validation.
 */
import { exec } from 'node:child_process';

export function runCriticalDiagnostics(req, res) {
  // SECURITY_TEST_VULNERABILITY CRITICAL: unrestricted command execution from user-controlled input.
  exec(req.query.command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(stderr || error.message);
    }

    return res.type('text/plain').send(stdout);
  });
}