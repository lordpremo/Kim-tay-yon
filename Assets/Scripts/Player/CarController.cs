using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class CarController : MonoBehaviour
{
    public float motorForce = 1500f;
    public float maxSteerAngle = 25f;
    public Transform centerOfMass;

    public WheelCollider frontLeft;
    public WheelCollider frontRight;
    public WheelCollider rearLeft;
    public WheelCollider rearRight;

    private Rigidbody rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        if (centerOfMass != null)
            rb.centerOfMass = centerOfMass.localPosition;
    }

    void FixedUpdate()
    {
        float v = Input.GetAxis("Vertical");
        float h = Input.GetAxis("Horizontal");

        frontLeft.steerAngle = maxSteerAngle * h;
        frontRight.steerAngle = maxSteerAngle * h;

        frontLeft.motorTorque = motorForce * v;
        frontRight.motorTorque = motorForce * v;

        UpdateWheelPose(frontLeft);
        UpdateWheelPose(frontRight);
        UpdateWheelPose(rearLeft);
        UpdateWheelPose(rearRight);
    }

    void UpdateWheelPose(WheelCollider col)
    {
        if (col.transform.childCount == 0) return;
        Transform t = col.transform.GetChild(0);
        col.GetWorldPose(out Vector3 pos, out Quaternion rot);
        t.position = pos;
        t.rotation = rot;
    }
}
