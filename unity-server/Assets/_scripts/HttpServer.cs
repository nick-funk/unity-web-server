using System.Collections.Generic;
using System;
using System.IO;
using System.Net;
using System.Linq;

using UnityEngine;

public class QueueRequestItem
{
    public readonly HttpRequest Request;
    public readonly HttpListenerRequest HttpRequest;
    public readonly HttpListenerResponse HttpResponse;

    public QueueRequestItem(
        HttpRequest request,
        HttpListenerRequest httpRequest,
        HttpListenerResponse httpResponse)
    {
        Request = request;
        HttpRequest = httpRequest;
        HttpResponse = httpResponse;
    }
}

[Serializable]
public class HttpRequest { }

public abstract class HttpHandler
{
    protected HttpServer server;

    public HttpHandler(HttpServer server)
    {
        this.server = server;
    }

    public abstract void Handle(QueueRequestItem item);
}

public class HttpServer
{
    private string urlBase;

    private HttpListener listener;
    private bool isStarted;
    private Queue<QueueRequestItem> requests;

    private Dictionary<string, Type> commandTypeLookup;
    private Dictionary<string, Type> queryTypeLookup;

    public HttpServer(string urlBase)
    {
        this.urlBase = urlBase;

        requests = new Queue<QueueRequestItem>();
        isStarted = false;

        CreateLookups();
    }

    private void CreateLookups()
    {
        commandTypeLookup = new Dictionary<string, Type>();
        queryTypeLookup = new Dictionary<string, Type>();

        var rootType = typeof(HttpRequest);
        var types = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .Where(t => rootType.IsAssignableFrom(t));

        foreach (var type in types)
        {
            if (type.Name.EndsWith("Command"))
            {
                var name = type.Name.Replace("Command", "").ToLower();
                commandTypeLookup.Add(name, type);
            }
            else if (type.Name.EndsWith("Query"))
            {
                var name = type.Name.Replace("Query", "").ToLower();
                queryTypeLookup.Add(name, type);
            }
        }
    }

    public void Start()
    {
        if (isStarted)
        {
            return;
        }

        if (listener == null)
        {
            listener = new HttpListener();
        }

        listener.Prefixes.Add(urlBase);

        isStarted = true;
        listener.Start();

        IAsyncResult result =
            listener.BeginGetContext(new AsyncCallback(Callback), listener);
    }

    public void Stop()
    {
        if (listener != null)
        {
            listener.Close();
            listener = null;
            isStarted = false;
        }
    }

    private void Callback(IAsyncResult result)
    {
        if (listener == null)
        {
            return;
        }

        HttpListenerContext context = listener.EndGetContext(result);

        // Queue up next listen (like a loop, but using a listener
        // over and over again to hear requests)
        listener.BeginGetContext(new AsyncCallback(Callback), listener);

        ProcessRequest(context);
    }

    private string GetBody(HttpListenerRequest request)
    {
        string body = "";
        using (Stream requestStream = request.InputStream)
        {
            using (StreamReader reader = new StreamReader(requestStream))
            {
                body = reader.ReadToEnd();
            }
        }

        if (body == null || body.Length == 0)
        {
            body = "{}";
        }

        return body;
    }

    public QueueRequestItem Pop()
    {
        try
        {
            return requests.Dequeue();
        }
        catch
        {
            return null;
        }
    }

    private void ProcessRequest(HttpListenerContext context)
    {
        try
        {
            var url = context.Request.Url.LocalPath;

            if (url.StartsWith("/api/command/"))
            {
                var name = url.Replace("/api/command/", "").ToLower();

                if (commandTypeLookup.ContainsKey(name))
                {
                    var type = commandTypeLookup[name];
                    var body = GetBody(context.Request);

                    dynamic req = JsonUtility.FromJson(body, type);
                    requests.Enqueue(
                        new QueueRequestItem
                        (
                            Convert.ChangeType(req, type),
                            context.Request,
                            context.Response
                        )
                    );
                }
            }
            else if (url.StartsWith("/api/query/"))
            {
                var name = url.Replace("/api/query/", "").ToLower();

                if (queryTypeLookup.ContainsKey(name))
                {
                    var type = queryTypeLookup[name];
                    var body = GetBody(context.Request);

                    dynamic req = JsonUtility.FromJson(body, type);
                    requests.Enqueue(
                        new QueueRequestItem
                        (
                            Convert.ChangeType(req, type),
                            context.Request,
                            context.Response
                        )
                    );
                }
            }
            else
            {
                context.Response.StatusCode = 404;
                context.Response.Close();
            }
        }
        catch (Exception ex)
        {
            Respond(context.Response, ex.Message);
        }
    }

    public void Respond(HttpListenerResponse response, string value)
    {
        var data = System.Text.Encoding.UTF8.GetBytes(value);
        response.OutputStream.Write(data, 0, data.Length);

        response.Close();
    }
}
