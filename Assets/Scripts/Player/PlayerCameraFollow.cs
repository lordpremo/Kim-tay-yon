using UnityEngine;

public class PlayerCameraFollow : MonoBehaviour
{
    public Transform target;
    public Vector3 offset = new Vector3(0, 4, -6);
    public float followSpeed = 10f;
    public float rotateSpeed = 80f;

    void LateUpdate()
    {
        if (target == null) return;

        float mouseX = Input.GetAxis("Mouse X") * rotateSpeed * Time.deltaTime;
        Quaternion rot = Quaternion.AngleAxis(mouseX, Vector3.up);
        offset = rot * offset;

        Vector3 desiredPos = target.position + offset;
        transform.position = Vector3.Lerp(transform.position, desiredPos, followSpeed * Time.deltaTime);
        transform.LookAt(target.position + Vector3.up * 1.5f);
    }
}
