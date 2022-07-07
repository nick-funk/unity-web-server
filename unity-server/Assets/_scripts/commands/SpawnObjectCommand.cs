using System;
using UnityEngine;

[Serializable]
public class SpawnObjectCommand : HttpRequest
{
    public float x;
    public float y;
    public float z;
}

[Serializable]
public class SpawnObjectResult
{
    public bool success;
    public string message;
    public int id;
}

public class SpawnObjectHandler : HttpHandler
{
    private GameObject container;
    private GameObject prefab;

    public SpawnObjectHandler(
        HttpServer server,
        GameObject container,
        GameObject prefab
    )
        : base(server)
    {
        this.container = container;
        this.prefab = prefab;
    }

    public override void Handle(QueueRequestItem item)
    {
        SpawnObjectCommand command = item.Request as SpawnObjectCommand;
        if (command == null)
        {
            return;
        }

        if (container == null)
        {
            server.Respond(
                item.HttpResponse,
                JsonUtility.ToJson(
                    new SpawnObjectResult
                    {
                        success = false,
                        message = "object container object does not exist",
                        id = -1,
                    }
                )
            );

            return;
        }

        var obj = GameObject.Instantiate(
            prefab,
            new Vector3(command.x, command.y, command.z),
            Quaternion.identity,
            container.transform
        );

        var behaviour = obj.GetComponent<ObjectBehaviour>();
        if (behaviour == null)
        {
            behaviour = obj.AddComponent<ObjectBehaviour>();
        }

        behaviour.Id = GenerateId();

        server.Respond(
            item.HttpResponse,
            JsonUtility.ToJson(
                new SpawnObjectResult
                {
                    success = true,
                    message = "successfully spawned object",
                    id = behaviour.Id,
                }
            )
        );
    }

    private int GenerateId()
    {
        var now = DateTime.Now;
        var zeroDate = 
            DateTime.MinValue
                .AddHours(now.Hour)
                .AddMinutes(now.Minute)
                .AddSeconds(now.Second)
                .AddMilliseconds(now.Millisecond);
        int uniqueId = (int)(zeroDate.Ticks / 10000);

        return uniqueId;
    }
} 
