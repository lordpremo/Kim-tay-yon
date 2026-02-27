using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class PlayerController : MonoBehaviour
{
    public float walkSpeed = 3f;
    public float runSpeed = 6f;
    public float gravity = -9.81f;
    public float jumpHeight = 1.2f;
    public Transform cameraTransform;

    private CharacterController controller;
    private Vector3 velocity;
    private bool isGrounded;

    void Awake()
    {
        controller = GetComponent<CharacterController>();
        if (cameraTransform == null && Camera.main != null)
            cameraTransform = Camera.main.transform;
    }

    void Update()
    {
        isGrounded = controller.isGrounded;
        if (isGrounded && velocity.y < 0)
            velocity.y = -2f;

        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");

        Vector3 inputDir = new Vector3(h, 0, v);
        inputDir = Vector3.ClampMagnitude(inputDir, 1f);

        Vector3 camForward = cameraTransform.forward;
        camForward.y = 0;
        camForward.Normalize();
        Vector3 camRight = cameraTransform.right;
        camRight.y = 0;
        camRight.Normalize();

        Vector3 moveDir = camForward * inputDir.z + camRight * inputDir.x;

        bool isRunning = Input.GetKey(KeyCode.LeftShift);
        float speed = isRunning ? runSpeed : walkSpeed;

        controller.Move(moveDir * speed * Time.deltaTime);

        if (moveDir.sqrMagnitude > 0.01f)
        {
            transform.rotation = Quaternion.Slerp(
                transform.rotation,
                Quaternion.LookRotation(moveDir),
                10f * Time.deltaTime
            );
        }

        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
        }

        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}
