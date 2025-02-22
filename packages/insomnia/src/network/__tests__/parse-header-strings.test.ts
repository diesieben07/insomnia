import { AUTH_AWS_IAM, CONTENT_TYPE_FORM_DATA } from '../../common/constants';
import { parseHeaderStrings } from '../parse-header-strings';

describe('parseHeaderStrings', () => {
  it('should default with empty inputs', () => {
    const req = { authentication: {}, body: {}, headers: [] };
    expect(parseHeaderStrings({ req })).toEqual(['Accept: */*', 'Accept-Encoding:', 'content-type:']);
  });
  it('should disable expect and transfer-encoding with body', () => {
    const req = { authentication: {}, body: {}, headers: [] };
    expect(parseHeaderStrings({ req, requestBody: 'test' })).toEqual(['Expect:', 'Transfer-Encoding:', 'Accept: */*', 'Accept-Encoding:', 'content-type:']);
  });
  it('should add boundary with multipart body path', () => {
    const req = { authentication: {}, body: { mimeType: CONTENT_TYPE_FORM_DATA }, headers: [] };
    expect(parseHeaderStrings({ req, requestBodyPath: '/tmp/x.z' })).toEqual(['Expect:', 'Transfer-Encoding:', 'Content-Type: multipart/form-data; boundary=X-INSOMNIA-BOUNDARY', 'Accept: */*', 'Accept-Encoding:']);
  });
  it('should sign with aws iam', () => {
    const req = { authentication: { type: AUTH_AWS_IAM }, body: {}, headers: [] };
    const [host, date, auth] = parseHeaderStrings({ req, finalUrl: 'http://x.y' });
    expect(host).toBe('Host: x.y');
    expect(date).toContain('X-Amz-Date: ');
    expect(auth).toContain('Authorization: AWS4-HMAC-SHA256 ');
    expect(auth).toContain('SignedHeaders=host;x-amz-date, Signature=');
  });
});
