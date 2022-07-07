using System;
using UnityEngine;

[Serializable]
public class MoveObjectCommand : HttpRequest
{
    public int id;
    public float x;
    public float y;
    public float z;
}

[Serializable]
public class MoveObjectResult
{
    public bool success;
    public string message;
    public int id;
}

public class MoveObjectHandler : HttpHandler
{
    private GameObject container;

    public MoveObjectHandler(
        HttpServer server,
        GameObject container
    )
        : base(server)
    {
        this.container = container;
    }

    public override void Handle(QueueRequestItem item)
    {
        MoveObjectCommand command = item.Request as MoveObjectCommand;
        if (command == null)
        {
            return;
        }

        if (container == null)
        {
            server.Respond(
                item.HttpResponse,
                JsonUtility.ToJson(
                    new MoveObjectResult
                    {
                        success = false,
                        message = "object container object does not exist",
                        id = command.id,
                    }
                )
            );

            return;
        }

        var children = container.GetComponentsInChildren<ObjectBehaviour>();

        foreach (var child in children)
        {
            if (child.Id == command.id)
            {
                child.Move(new Vector3(command.x, command.y, command.z));

                server.Respond(
                    item.HttpResponse,
                    JsonUtility.ToJson(
                        new MoveObjectResult
                        {
                            success = true,
                            message = "sucessfully moved object",
                            id = command.id,
                        }
                    )
                );

                return;
            }
        }

        server.Respond(
            item.HttpResponse, 
            JsonUtility.ToJson(
                new MoveObjectResult
                {
                    success = false,
                    message = "unable to find object with id",
                    id = command.id,
                }
            )
        );
    }
} 
