using System;
using System.Collections.Generic;

using UnityEngine;

public class HttpServerBehaviour : MonoBehaviour
{
    public GameObject objectContainer;
    public GameObject objectPrefab;

    private HttpServer server;
    private Dictionary<Type, HttpHandler> Handlers;

    public void Start()
    {
        server = new HttpServer("http://*:7000/");

        Handlers = new Dictionary<Type, HttpHandler>
        {
            { typeof(SpawnObjectCommand),
                new SpawnObjectHandler(server, objectContainer, objectPrefab) },
            { typeof(MoveObjectCommand),
                new MoveObjectHandler(server, objectContainer) },
        };

        server.Start();
    }

    public void Update()
    {
        var item = server.Pop();
        while (item != null)
        {
            var type = item.Request.GetType();
            if (Handlers.ContainsKey(type))
            {
                Handlers[type].Handle(item);
            }

            item = server.Pop();
        }
    }
}
