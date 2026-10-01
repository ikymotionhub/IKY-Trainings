$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server listening on http://localhost:$port/"
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        $filepath = Join-Path (Get-Location).Path $path.TrimStart('/')
        
        if (Test-Path $filepath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filepath)
            $response.ContentLength64 = $content.Length
            
            # Basic mime types
            $ext = [System.IO.Path]::GetExtension($filepath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".webp" { $response.ContentType = "image/webp" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            try {
                $response.OutputStream.Write($content, 0, $content.Length)
            } catch {
                Write-Host "Connection closed by client."
            }
        } else {
            $response.StatusCode = 404
            Write-Host "404 Not Found: $path"
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped."
} finally {
    $listener.Stop()
}
