using UnityEngine;

public class EnterExitVehicle : MonoBehaviour
{
    public Transform player;
    public PlayerController playerController;
    public Camera playerCamera;
    public Camera carCamera;
    public CarController carController;
    public Transform exitPoint;

    private bool inCar = false;

    void Start()
    {
        carCamera.gameObject.SetActive(false);
        carController.enabled = false;
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            if (!inCar) TryEnterCar();
            else ExitCar();
        }
    }

    void TryEnterCar()
    {
        float dist = Vector3.Distance(player.position, transform.position);
        if (dist > 3f) return;

        inCar = true;
        playerController.enabled = false;
        player.gameObject.SetActive(false);

        playerCamera.gameObject.SetActive(false);
        carCamera.gameObject.SetActive(true);
        carController.enabled = true;
    }

    void ExitCar()
    {
        inCar = false;
        carController.enabled = false;
        carCamera.gameObject.SetActive(false);

        player.position = exitPoint != null ? exitPoint.position : transform.position + transform.right * 2f;
        player.gameObject.SetActive(true);
        playerController.enabled = true;
        playerCamera.gameObject.SetActive(true);
    }
}
