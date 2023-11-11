import perf from '@react-native-firebase/perf';

export async function screenTrace(screenName: any) {
  // Define & start a screen trace
  try {
    const trace = await perf().startScreenTrace(screenName);
    // Stop the trace
    await trace.stop();
  } catch (e) {
    // rejects if iOS or (Android == 8 || Android == 8.1)
    // or if hardware acceleration is off
    console.log('e', e);
  }
}

async function getRequest(url: any) {
  // Define the network metric
  const metric = await perf().newHttpMetric(url, 'GET');

  // Define meta details
  metric.putAttribute('user', 'abcd');

  // Start the metric
  await metric.start();

  // Perform a HTTP request and provide response information
  const response: any = await fetch(url);
  metric.setHttpResponseCode(response.status);
  metric.setResponseContentType(response.headers.get('Content-Type'));
  metric.setResponsePayloadSize(response.headers.get('Content-Length'));

  // Stop the metric
  await metric.stop();

  return response.json();
}

// Call API
getRequest('https://api.com').then(json => {
  console.log(json);
});
