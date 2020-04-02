import fetch, { RequestInit, Response } from 'node-fetch';
import { sspi, InitializeSecurityContextInput } from '../lib/api';
import { encode, decode } from 'base64-arraybuffer';
import dbg from 'debug';

const debug = dbg('node-expose-sspi:handleAuth');

async function handleAuth(
  response: Response,
  resource: string,
  init: RequestInit = {}
): Promise<Response> {
  debug('handleAuth: start');
  if (!response.headers.has('www-authenticate')) {
    return response;
  }
  if (!response.headers.get('www-authenticate').startsWith('Negotiate')) {
    return response;
  }
  if (response.status !== 401) {
    return response;
  }

  const clientCred = sspi.AcquireCredentialsHandle({
    packageName: 'Negotiate',
    credentialUse: 'SECPKG_CRED_OUTBOUND',
  });
  const packageInfo = sspi.QuerySecurityPackageInfo('Negotiate');
  let input: InitializeSecurityContextInput = {
    credential: clientCred.credential,
    targetName: 'kiki',
    cbMaxToken: packageInfo.cbMaxToken,
    targetDataRep: 'SECURITY_NATIVE_DREP',
  };
  let clientSecurityContext = sspi.InitializeSecurityContext(input);
  // encode to Base64 and send via HTTP
  let base64 = encode(clientSecurityContext.SecBufferDesc.buffers[0]);
  let requestInit: RequestInit = { ...init };
  requestInit.headers = {
    ...init.headers,
    'Authorization': 'Negotiate ' + base64,
  };
  response = await fetch(resource, requestInit);
  while (
    response.headers.has('www-authenticate') &&
    response.status === 401 &&
    response.headers.get('www-authenticate').startsWith('Negotiate ')
  ) {
    const buffer = decode(
      response.headers.get('www-authenticate').substring('Negotiate '.length)
    );
    input = {
      credential: clientCred.credential,
      targetName: 'kiki',
      cbMaxToken: packageInfo.cbMaxToken,
      serverSecurityContext: {
        SecBufferDesc: {
          ulVersion: 0,
          buffers: [buffer],
        },
      },
      contextHandle: clientSecurityContext.contextHandle,
      targetDataRep: 'SECURITY_NATIVE_DREP',
    };
    clientSecurityContext = sspi.InitializeSecurityContext(input);
    base64 = encode(clientSecurityContext.SecBufferDesc.buffers[0]);
    requestInit = { ...init };
    requestInit.headers = {
      ...init.headers,
      'Authorization': 'Negotiate ' + base64,
    };
    response = await fetch(resource, requestInit);
  }
  debug('handleAuth: end');
  return response;
}

class Client {
  async fetch(resource: string, init?: RequestInit): Promise<Response> {
    const response = await fetch(resource, init);
    const result = await handleAuth(response, resource, init);
    return result;
  }
}

export const client = new Client();
