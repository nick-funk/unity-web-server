using System;
using System.Collections.Generic;

using UnityEngine;

[Serializable]
public class ObjectsQuery : HttpRequest
{
}

[Serializable]
public class ObjectQueryItem
{
    public int Id;
    public float X;
    public float Y;
    public float Z;
}

[Serializable]
public class ObjectsQueryResult
{
    public ObjectQueryItem[] objects;
}

public class ObjectsQueryHandler : HttpHandler
{
    private GameObject container;

    public ObjectsQueryHandler(
        HttpServer server,
        GameObject container
    )
        : base(server)
    {
        this.container = container;
    }

    public override void Handle(QueueRequestItem item)
    {
        ObjectsQuery query = item.Request as ObjectsQuery;
        if (query == null)
        {
            return;
        }

        var objects = container.GetComponentsInChildren<ObjectBehaviour>();

        var items = new List<ObjectQueryItem>();
        foreach (var obj in objects)
        {
            items.Add(new ObjectQueryItem
            {
                Id = obj.Id,
                X = obj.transform.position.x,
                Y = obj.transform.position.y,
                Z = obj.transform.position.z,
            });
        }

        var response = new ObjectsQueryResult
        {
            objects = items.ToArray(),
        };

        server.Respond(
            item.HttpResponse,
            JsonUtility.ToJson(response)
        );
    }
}