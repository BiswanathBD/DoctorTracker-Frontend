import { type NextRequest, NextResponse } from 'next/server';

// resolve target backend API URL
const getBackendUrl = () => {
  const backend =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000/api';
  return backend.replace(/\/+$/, '');
};

async function forwardRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const backendBase = getBackendUrl();
  const pathStr = Array.isArray(path) ? path.join('/') : '';
  const targetUrl = new URL(`${backendBase}/${pathStr}`);

  // preserve query parameters
  req.nextUrl.searchParams.forEach((val, key) => {
    targetUrl.searchParams.append(key, val);
  });

  // clone headers for backend request
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    // omit host/connection specific headers to avoid protocol conflicts
    if (!['host', 'connection', 'content-length'].includes(lower)) {
      headers.set(key, value);
    }
  });

  // forward browser cookies to backend
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  // forward request body if applicable
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  let body: BodyInit | null = null;
  if (hasBody) {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      body = await req.formData();
      // let fetch generate the boundary header automatically
      headers.delete('content-type');
    } else {
      body = await req.arrayBuffer();
    }
  }

  try {
    const backendRes = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
    });

    const resBuffer = await backendRes.arrayBuffer();

    const clientRes = new NextResponse(resBuffer, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    // pass backend headers to client
    backendRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== 'set-cookie' && lower !== 'content-encoding' && lower !== 'content-length') {
        clientRes.headers.set(key, value);
      }
    });

    // forward Set-Cookie headers cleanly to establish first-party same-origin cookies
    const rawCookies =
      typeof backendRes.headers.getSetCookie === 'function'
        ? backendRes.headers.getSetCookie()
        : [backendRes.headers.get('set-cookie')].filter(Boolean) as string[];

    rawCookies.forEach((cookieStr) => {
      clientRes.headers.append('set-cookie', cookieStr);
    });

    return clientRes;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend connection error';
    return NextResponse.json(
      {
        statusCode: 502,
        success: false,
        message: `Failed to connect to backend service: ${message}`,
      },
      { status: 502 }
    );
  }
}

export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;
export const HEAD = forwardRequest;
export const OPTIONS = forwardRequest;

