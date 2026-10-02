import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const connectionString = window.APP_CONFIG?.applicationInsightsConnectionString;
const applicationInsights = connectionString
  ? new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: false
      }
    })
  : null;

applicationInsights?.loadAppInsights();

export function trackPageView({ name, uri, properties }) {
  if (!applicationInsights) return;

  applicationInsights.trackPageView({ name, uri, properties });
  applicationInsights.trackTrace({
    message: `Page visited: ${name}`,
    properties: { ...properties, pageUrl: uri }
  });
}
