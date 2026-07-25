import { NextRequest, NextResponse } from "next/server";

function rewriteUrls(content: string, basePath: string, type: "html" | "css" | "js") {
  let result = content;

  if (type === "html") {
    result = result.replace(
      /((?:src|href|action|poster|data)\s*=\s*["'])\/(?!\/|api\/proxy)/gi,
      `$1${basePath}/`
    );
    result = result.replace(
      /((?:src|href)\s*=\s*["'])\/\//gi,
      `$1/api/proxy/https/`
    );
    result = result.replace(
      /(srcset\s*=\s*["'])\/(?!\/|api\/proxy)/gi,
      `$1${basePath}/`
    );
  }

  if (type === "js") {
    // Rewrite string literals containing absolute paths in JS
    // "/_next/static/..." → "/api/proxy/https/host/_next/static/..."
    // Handles both single and double quoted strings
    result = result.replace(
      /(["'])\/_next\//g,
      `$1${basePath}/_next/`
    );
    // Rewrite other common absolute path patterns in JS string literals
    // Catches: "/bundles/", "/assets/", "/static/", "/images/", "/fonts/", "/css/", "/js/"
    result = result.replace(
      /(["'])\/((?:bundles|assets|static|images|fonts|css|js|media|public)\/)/g,
      `$1${basePath}/$2`
    );
  }

  // Rewrite url() in CSS and inline styles
  result = result.replace(
    /url\(\s*(["']?)\/(?!\/|api\/proxy)/gi,
    `url($1${basePath}/`
  );
  result = result.replace(
    /url\(\s*(["']?)\/\//gi,
    `url($1/api/proxy/https/`
  );

  return result;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  if (!segments || segments.length < 2) {
    return NextResponse.json({ error: "Invalid proxy URL" }, { status: 400 });
  }

  const protocol = segments[0];
  const rest = segments.slice(1).join("/");
  const search = req.nextUrl.search;
  const targetUrl = `${protocol}://${rest}${search}`;

  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: req.headers.get("accept") || "*/*",
        "Accept-Encoding": "identity",
      },
      redirect: "follow",
    });

    const contentType = res.headers.get("content-type") || "";
    const isHtml = contentType.includes("text/html");
    const isCss = contentType.includes("text/css");
    const isJs = contentType.includes("javascript") || contentType.includes("ecmascript");
    const host = new URL(targetUrl).host;
    const basePath = `/api/proxy/${protocol}/${host}`;

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    if (contentType) headers.set("Content-Type", contentType);

    const cacheControl = res.headers.get("cache-control");
    if (cacheControl) headers.set("Cache-Control", cacheControl);

    if (isHtml) {
      let html = await res.text();
      const origin = new URL(targetUrl).origin;

      html = rewriteUrls(html, basePath, "html");

      const baseTag = `<base href="${basePath}/">`;
      const interceptScript = `<script>
        (function() {
          var B = "${basePath}";
          var origSetAttr = Element.prototype.setAttribute;
          function rw(v) {
            if (typeof v !== "string") return v;
            if (v.startsWith("/") && !v.startsWith("/api/proxy")) return B + v;
            if (v.startsWith("//")) return "/api/proxy/https/" + v.slice(2);
            return v;
          }
          function fixEl(el) {
            if (!el || !el.tagName) return;
            var tag = el.tagName;
            if (tag === "SCRIPT" || tag === "IMG") {
              var s = el.getAttribute("src");
              if (s && s.startsWith("/") && !s.startsWith("/api/proxy")) {
                origSetAttr.call(el, "src", rw(s));
              }
            } else if (tag === "LINK") {
              var h = el.getAttribute("href");
              if (h && h.startsWith("/") && !h.startsWith("/api/proxy")) {
                origSetAttr.call(el, "href", rw(h));
              }
            }
          }

          // Intercept appendChild/insertBefore — catch elements right before DOM insertion
          var origAppend = Node.prototype.appendChild;
          Node.prototype.appendChild = function(child) {
            fixEl(child);
            return origAppend.call(this, child);
          };
          var origInsert = Node.prototype.insertBefore;
          Node.prototype.insertBefore = function(child, ref) {
            fixEl(child);
            return origInsert.call(this, child, ref);
          };

          // Intercept setAttribute for src/href
          Element.prototype.setAttribute = function(name, value) {
            if ((name === "src" || name === "href") && typeof value === "string") {
              value = rw(value);
            }
            return origSetAttr.call(this, name, value);
          };

          // Intercept fetch
          var of = window.fetch;
          window.fetch = function(url, opts) {
            if (typeof url === "string") url = rw(url);
            return of.call(this, url, opts);
          };

          // Intercept XMLHttpRequest
          var xo = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(m, url) {
            arguments[1] = rw(url);
            return xo.apply(this, arguments);
          };

          // Intercept link clicks for navigation
          document.addEventListener("click", function(e) {
            var a = e.target.closest("a");
            if (!a) return;
            var href = a.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
            e.preventDefault();
            try {
              var full = new URL(href, "${origin}").href;
              window.parent.postMessage({ type: "browser-navigate", url: full }, "*");
            } catch(err) {}
          }, true);
        })();
      </script>`;

      if (html.includes("<head>")) {
        html = html.replace("<head>", "<head>" + baseTag + interceptScript);
      } else if (html.includes("<HEAD>")) {
        html = html.replace("<HEAD>", "<HEAD>" + baseTag + interceptScript);
      } else {
        html = baseTag + interceptScript + html;
      }

      return new NextResponse(html, { status: res.status, headers });
    }

    if (isCss) {
      let css = await res.text();
      css = rewriteUrls(css, basePath, "css");
      return new NextResponse(css, { status: res.status, headers });
    }

    if (isJs) {
      let js = await res.text();
      js = rewriteUrls(js, basePath, "js");
      return new NextResponse(js, { status: res.status, headers });
    }

    const body = await res.arrayBuffer();
    return new NextResponse(body, { status: res.status, headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch the requested URL" },
      { status: 502 }
    );
  }
}
