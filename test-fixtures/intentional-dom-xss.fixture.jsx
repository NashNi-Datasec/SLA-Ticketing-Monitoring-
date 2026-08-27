/*
 * INTENTIONAL TEST FIXTURE: medium-severity DOM XSS pattern.
 * This file is never imported by the application and must remain excluded from
 * production bundles. It exists solely to verify static-analysis test flows.
 */
export function IntentionalDomXssFixture({ untrustedHtml }) {
  return <section dangerouslySetInnerHTML={{ __html: untrustedHtml }} />;
}