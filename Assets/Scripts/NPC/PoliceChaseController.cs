using UnityEngine;
using UnityEngine.AI;

public class PoliceChaseController : MonoBehaviour
{
    public Transform player;
    public float baseDetectRange = 10f;
    public float baseSpeed = 3.5f;

    private NavMeshAgent agent;

    void Awake()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        if (player == null) return;

        int wanted = WantedSystem.Instance.wantedLevel;

        // Police get stronger with wanted level
        float detectRange = baseDetectRange + (wanted * 5f);
        agent.speed = baseSpeed + (wanted * 1.2f);

        float dist = Vector3.Distance(transform.position, player.position);

        if (dist <= detectRange)
        {
            agent.SetDestination(player.position);
        }
    }
}
