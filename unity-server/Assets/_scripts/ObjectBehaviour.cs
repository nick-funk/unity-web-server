using UnityEngine;

public class ObjectBehaviour : MonoBehaviour
{
    public int Id;

    public void Move(Vector3 position)
    {
        this.transform.position = position;
    }
}
