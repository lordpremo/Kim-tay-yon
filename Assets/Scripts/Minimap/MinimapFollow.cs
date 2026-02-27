using UnityEngine;

public class MinimapFollow : MonoBehaviour
{
    public Transform target;
    public float height = 40f;

    void LateUpdate()
    {
        if (target == null) return;

        Vector3 pos = target.position;
        pos.y += height;
        transform.position = pos;

        transform.rotation = Quaternion.Euler(90f, target.eulerAngles.y, 0f);
    }
}
